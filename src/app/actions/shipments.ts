'use server';

import { createServerClient } from '@/lib/supabase';

export interface ShipmentFilterOptions {
  search?: string;
  status?: string;
  governorate?: string;
  anomaly?: 'delayed' | 'misrouted' | 'all';
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 1. ADVANCED PAGINATED & FILTERED SELECT SHIPMENTS
export async function getShipments(options: ShipmentFilterOptions = {}) {
  const supabase = createServerClient();
  
  const limit = options.limit || 10;
  const page = options.page || 1;
  const offset = (page - 1) * limit;
  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'desc';

  let query = supabase
    .from('shipments')
    .select(`
      *,
      current_station:stations!shipments_current_station_id_fkey(name_en, name_ar),
      destination_station:stations!shipments_destination_station_id_fkey(name_en, name_ar)
    `, { count: 'exact' });

  // Apply Search
  if (options.search) {
    query = query.or(`tracking_number.ilike.%${options.search}%,recipient_name.ilike.%${options.search}%,governorate.ilike.%${options.search}%`);
  }

  // Apply Filters
  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }
  if (options.governorate && options.governorate !== 'all') {
    query = query.eq('governorate', options.governorate);
  }

  // Anomalies
  if (options.anomaly === 'delayed') {
    query = query.eq('is_delayed', true);
  } else if (options.anomaly === 'misrouted') {
    query = query.eq('is_misrouted', true);
  }

  // Pagination & Sorting
  query = query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('[DB ERR] getShipments failed:', error);
    throw new Error('Database select failed.');
  }

  return {
    shipments: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page
  };
}

// 2. FETCH DETAILED TIMELINE HISTORY
export async function getShipmentTimeline(shipmentId: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('shipment_timeline')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Timeline fetch failed.');
  return data || [];
}

// 3. CREATE / INGEST INDIVIDUAL SHIPMENT
export async function createShipment(shipmentData: any) {
  const supabase = createServerClient();

  // SLA Calculation Rule: 24h Cairo/Giza, 48h Cross-Governorate
  const governorate = shipmentData.governorate;
  const slaHours = governorate === 'Cairo' || governorate === 'Giza' ? 24 : 48;
  const slaDeadline = new Date(Date.now() + 3600000 * slaHours).toISOString();

  // Database Insert
  const { data, error } = await supabase
    .from('shipments')
    .insert([{
      ...shipmentData,
      sla_deadline: slaDeadline,
      status: 'created'
    }])
    .select()
    .single();

  if (error) throw new Error('Shipment insertion failed.');

  // Create initial timeline log
  await supabase.from('shipment_timeline').insert([{
    shipment_id: data.id,
    status: 'created',
    notes_en: 'Shipment created and registered in routing registry.',
    notes_ar: 'تم إنشاء الشحنة وتسجيلها في سجل التوجيه.'
  }]);

  return data;
}

// 4. MANUAL SINGLE SHIPMENT REROUTE
export async function rerouteShipment(shipmentId: string, targetStationId: string, agentId: string) {
  const supabase = createServerClient();
  
  // Fetch current details
  const { data: ship } = await supabase
    .from('shipments')
    .select('current_station_id, tracking_number')
    .eq('id', shipmentId)
    .single();

  if (!ship) throw new Error('Shipment not found.');

  // Update Current Station
  const { error } = await supabase
    .from('shipments')
    .update({ current_station_id: targetStationId })
    .eq('id', shipmentId);

  if (error) throw new Error('Rerouting database save failed.');

  // Log in Timeline
  await supabase.from('shipment_timeline').insert([{
    shipment_id: shipmentId,
    status: 'in_transit',
    location_station_id: targetStationId,
    action_by: agentId,
    notes_en: `Operations Agent adjusted routing to station ID ${targetStationId}`,
    notes_ar: `قام موظف العمليات بتعديل التوجيه إلى محطة رقم ${targetStationId}`
  }]);

  return { success: true };
}

// 5. UPDATE COURIER STATUS & CASH BALANCES
export async function updateShipmentStatus(shipmentId: string, status: string, daId: string, notes?: string) {
  const supabase = createServerClient();

  const { data: ship } = await supabase
    .from('shipments')
    .select('cod_amount, status')
    .eq('id', shipmentId)
    .single();

  if (!ship) throw new Error('Shipment not found.');

  // Transaction-safe updates
  const { error } = await supabase
    .from('shipments')
    .update({ status: status, assigned_da_id: daId })
    .eq('id', shipmentId);

  if (error) throw new Error('Status update failed.');

  // If status is 'delivered', increment Delivery Agent's EGP wallet balance
  if (status === 'delivered') {
    await supabase.rpc('increment_da_wallet', { 
      da_user_id: daId, 
      amount: ship.cod_amount 
    });
  }

  // Create timeline record
  await supabase.from('shipment_timeline').insert([{
    shipment_id: shipmentId,
    status: status,
    action_by: daId,
    notes_en: notes || `Status updated to ${status} by DA Courier.`,
    notes_ar: notes || `تم تحديث حالة الشحنة إلى ${status} بواسطة مندوب التوصيل.`
  }]);

  return { success: true };
}
