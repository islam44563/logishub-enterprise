'use server';

import { createServerClient } from '@/lib/supabase';

// 1. GET ACTIVE OPERATIONAL ALERTS
export async function getActiveAlerts() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('alerts')
    .select(`
      *,
      shipment:shipments(tracking_number, recipient_name, city, governorate)
    `)
    .eq('is_resolved', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB ERR] getActiveAlerts failed:', error);
    throw new Error('Alert database fetch failed.');
  }

  return data || [];
}

// 2. RESOLVE ALERTS & CREATE TIMELINE AUDIT TRACE
export async function resolveAlert(alertId: string, resolvedByUserId: string, resolutionNotes: string) {
  const supabase = createServerClient();

  // 1. Fetch Alert Details
  const { data: alert } = await supabase
    .from('alerts')
    .select('shipment_id, type')
    .eq('id', alertId)
    .single();

  if (!alert) throw new Error('Alert not found.');

  // 2. Update Alert State in Database
  const { error: alertError } = await supabase
    .from('alerts')
    .update({
      is_resolved: true,
      resolved_by: resolvedByUserId,
      resolved_at: new Date().toISOString()
    })
    .eq('id', alertId);

  if (alertError) throw new Error('Failed to resolve alert.');

  // 3. Clear Anomaly Flags on the Shipment
  if (alert.shipment_id) {
    const updateFields: any = {};
    if (alert.type === 'misrouted') updateFields.is_misrouted = false;
    if (alert.type === 'sla_breached') updateFields.is_delayed = false;

    await supabase
      .from('shipments')
      .update(updateFields)
      .eq('id', alert.shipment_id);

    // 4. Register Auditor Log in Timeline
    await supabase.from('shipment_timeline').insert([{
      shipment_id: alert.shipment_id,
      status: 'received_at_hub', // Preserves active status
      action_by: resolvedByUserId,
      notes_en: `Operations Alert [${alert.type.toUpperCase()}] resolved: ${resolutionNotes}`,
      notes_ar: `تم حل تنبيه العمليات [${alert.type.toUpperCase()}]: ${resolutionNotes}`
    }]);
  }

  return { success: true };
}
