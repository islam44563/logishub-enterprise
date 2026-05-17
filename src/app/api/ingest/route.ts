import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// API Webhook Receiver for Merchant CSV / JSON manifests
export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  
  try {
    const body = await request.json();
    const { shipments } = body; // Array of parcel details

    if (!shipments || !Array.isArray(shipments)) {
      return NextResponse.json({ error: 'Invalid payload structure. Array of shipments expected.' }, { status: 400 });
    }

    const insertedShipments = [];

    for (const ship of shipments) {
      // 1. SLA Calculation
      const slaHours = ship.governorate === 'Cairo' || ship.governorate === 'Giza' ? 24 : 48;
      const slaDeadline = new Date(Date.now() + 3600000 * slaHours).toISOString();

      // 2. Insert shipment record
      const { data, error } = await supabase
        .from('shipments')
        .insert([{
          tenant_id: ship.tenant_id || '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b', // Demonstrator Tenant
          tracking_number: ship.tracking_number || 'LH-' + Math.floor(100000 + Math.random() * 900000),
          sender_name: ship.sender_name || 'Jumia Central Merchant',
          sender_phone: ship.sender_phone || '+20 100 000 0000',
          recipient_name: ship.recipient_name,
          recipient_phone: ship.recipient_phone,
          governorate: ship.governorate,
          city: ship.city,
          address_text: ship.address_text,
          cod_amount: ship.cod_amount || 0.00,
          status: 'created',
          sla_deadline: slaDeadline
        }])
        .select()
        .single();

      if (error) {
        console.error('[INGEST ERR] Failed to insert shipment:', ship.tracking_number, error);
        continue; // Skip failed records
      }

      // 3. Create Timeline Audit Log
      await supabase.from('shipment_timeline').insert([{
        shipment_id: data.id,
        status: 'created',
        notes_en: 'Manifest received via automated merchant API ingestion channel.',
        notes_ar: 'تم استقبال كشف الشحن بنجاح عبر قناة الربط البرمجي للتاجر.'
      }]);

      insertedShipments.push(data);
    }

    return NextResponse.json({
      success: true,
      processed: shipments.length,
      imported: insertedShipments.length
    }, { status: 200 });

  } catch (error) {
    console.error('[INGEST WEBHOCKED ERR]', error);
    return NextResponse.json({ error: 'Internal API Server Error.' }, { status: 500 });
  }
}
