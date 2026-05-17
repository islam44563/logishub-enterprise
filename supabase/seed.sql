-- ==========================================
-- LOGISHUB ENTERPRISE - DEMONSTRATION SEED DATA
-- ==========================================

-- 1. INSERT TENANTS
INSERT INTO tenants (id, name, subdomain, subscription_plan, subscription_status)
VALUES (
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'LogisHub Egypt Logistics Corp',
    'logishub-eg',
    'professional',
    'active'
);

-- 2. INSERT USERS (COURIERS & OPERATIONS)
-- Admin
INSERT INTO users (id, tenant_id, email, phone, full_name, role, is_active)
VALUES (
    'd8c7b6a5-4f3e-2d1c-b0a9-9876543210ab',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'admin@logishub.eg',
    '+20 100 111 2222',
    'Farouk Hegazi',
    'super_admin',
    TRUE
);

-- Operations Agent
INSERT INTO users (id, tenant_id, email, phone, full_name, role, is_active)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'ahmed.ops@logishub.eg',
    '+20 102 394 8812',
    'Ops Agent Ahmed',
    'ops_agent',
    TRUE
);

-- Station Manager (Cairo Hub)
INSERT INTO users (id, tenant_id, email, phone, full_name, role, is_active)
VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'sherif.manager@logishub.eg',
    '+20 115 293 8475',
    'Manager Sherif',
    'station_manager',
    TRUE
);

-- Delivery Agent / Courier
INSERT INTO users (id, tenant_id, email, phone, full_name, role, is_active)
VALUES (
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'ahmed.courier@logishub.eg',
    '+20 100 293 8472',
    'DA Ahmed Hegazi',
    'da_courier',
    TRUE
);

-- 3. INSERT STATIONS
-- Cairo Station
INSERT INTO stations (id, tenant_id, name_en, name_ar, governorate, city, address, manager_id)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'Cairo Central Hub',
    'محطة القاهرة المركزية',
    'Cairo',
    'Nasr City',
    'Nasr City, Makram Ebeid St, next to Metro Market',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'
);

-- Alexandria Station
INSERT INTO stations (id, tenant_id, name_en, name_ar, governorate, city, address, manager_id)
VALUES (
    '20000000-0000-0000-0000-000000000002',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'Alexandria Hub',
    'محطة الإسكندرية',
    'Alexandria',
    'Smouha',
    'Smouha, Victor Emmanuel Sq, Bldg 8, flat 9',
    NULL
);

-- Giza Station
INSERT INTO stations (id, tenant_id, name_en, name_ar, governorate, city, address, manager_id)
VALUES (
    '30000000-0000-0000-0000-000000000003',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'Giza Station',
    'محطة الجيزة',
    'Giza',
    'Dokki',
    'Dokki, El-Tahrir St, facing Sheraton, 4th floor',
    NULL
);

-- Mansoura Hub
INSERT INTO stations (id, tenant_id, name_en, name_ar, governorate, city, address, manager_id)
VALUES (
    '40000000-0000-0000-0000-000000000004',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'Mansoura Hub',
    'محطة المنصورة',
    'Dakahlia',
    'Mansoura',
    'Mansoura, El-Geish St, facing Governorate bldg',
    NULL
);

-- 4. INSERT DA PROFILES
INSERT INTO da_profiles (user_id, station_id, vehicle, license_plate, max_capacity, current_status, wallet_balance)
VALUES (
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    '10000000-0000-0000-0000-000000000001',
    'motorcycle',
    'أ ب ج 1234',
    40,
    'idle',
    350.00 -- Pre-collected COD
);

-- 5. INSERT SHIPMENTS (WITH SLA DEADLINES)
-- Shipment 1: Delivered
INSERT INTO shipments (id, tenant_id, tracking_number, sender_name, sender_phone, recipient_name, recipient_phone, governorate, city, address_text, cod_amount, status, origin_station_id, current_station_id, destination_station_id, assigned_da_id, sla_deadline, is_delayed, is_misrouted)
VALUES (
    'a1a2a3a4-b1b2-c1c2-d1d2-e1e2e3e4e5e6',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'LH-9402',
    'Jumia Merchant Cairo',
    '+20 102 338 1199',
    'Mustafa Mahmoud',
    '+20 100 293 8472',
    'Cairo',
    'Nasr City',
    'Nasr City, Makram Ebeid St, next to Metro Market',
    350.00,
    'delivered',
    '10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    FALSE,
    FALSE
);

-- Shipment 2: Delayed Same-City Package (SLA Breached)
INSERT INTO shipments (id, tenant_id, tracking_number, sender_name, sender_phone, recipient_name, recipient_phone, governorate, city, address_text, cod_amount, status, origin_station_id, current_station_id, destination_station_id, assigned_da_id, sla_deadline, is_delayed, is_misrouted)
VALUES (
    'b1b2b3b4-c1c2-d1d2-e1e2-f1f2f3f4f5f6',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'LH-9404',
    'Rana Clothing Giza',
    '+20 109 448 2938',
    'Hassan Aly',
    '+20 102 384 1122',
    'Giza',
    'Dokki',
    'Dokki, El-Tahrir St, facing Sheraton, 4th floor',
    1200.00,
    'received_at_hub',
    '30000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000003',
    NULL,
    CURRENT_TIMESTAMP - INTERVAL '30 hours', -- Delayed
    TRUE,
    FALSE
);

-- Shipment 3: Misrouted Shipment (Giza instead of Alexandria)
INSERT INTO shipments (id, tenant_id, tracking_number, sender_name, sender_phone, recipient_name, recipient_phone, governorate, city, address_text, cod_amount, status, origin_station_id, current_station_id, destination_station_id, assigned_da_id, sla_deadline, is_delayed, is_misrouted)
VALUES (
    'c1c2c3c4-d1d2-e1e2-f1f2-a1a2a3a4a5a6',
    '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b',
    'LH-9406',
    'Cairo Gadget Shop',
    '+20 120 482 9918',
    'Rania Selim',
    '+20 112 394 8829',
    'Alexandria',
    'Smouha',
    'Smouha, Victor Emmanuel Sq, Bldg 8, flat 9',
    2200.00,
    'received_at_hub',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000003', -- IN GIZA INSTEAD OF ALEXANDRIA
    '20000000-0000-0000-0000-000000000002',
    NULL,
    CURRENT_TIMESTAMP + INTERVAL '24 hours',
    FALSE,
    TRUE
);

-- 6. INSERT SHIPMENT TIMELINE RECORDS
-- Delivered timelines
INSERT INTO shipment_timeline (shipment_id, status, location_station_id, action_by, notes_en, notes_ar)
VALUES (
    'a1a2a3a4-b1b2-c1c2-d1d2-e1e2e3e4e5e6',
    'created',
    '10000000-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Order imported from Shopify merchant store',
    'تم استيراد الطلب من متجر شوبيفاي التابع للتاجر'
);

INSERT INTO shipment_timeline (shipment_id, status, location_station_id, action_by, notes_en, notes_ar)
VALUES (
    'a1a2a3a4-b1b2-c1c2-d1d2-e1e2e3e4e5e6',
    'received_at_hub',
    '10000000-0000-0000-0000-000000000001',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Manifest barcode scanned at Cairo Central Hub',
    'تم مسح باركود البيان في محطة القاهرة المركزية'
);

INSERT INTO shipment_timeline (shipment_id, status, location_station_id, action_by, notes_en, notes_ar)
VALUES (
    'a1a2a3a4-b1b2-c1c2-d1d2-e1e2e3e4e5e6',
    'out_for_delivery',
    '10000000-0000-0000-0000-000000000001',
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'Handed over to DA Courier Ahmed Hegazi',
    'تم تسليم الطرد لمندوب الشحن أحمد حجازي'
);

INSERT INTO shipment_timeline (shipment_id, status, location_station_id, action_by, notes_en, notes_ar)
VALUES (
    'a1a2a3a4-b1b2-c1c2-d1d2-e1e2e3e4e5e6',
    'delivered',
    '10000000-0000-0000-0000-000000000001',
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'Delivered successfully. Collected cash COD 350.00 EGP',
    'تم التسليم بنجاح. تم تحصيل نقدية 350.00 جنيه مصري'
);

-- Misrouted Timelines
INSERT INTO shipment_timeline (shipment_id, status, location_station_id, action_by, notes_en, notes_ar)
VALUES (
    'c1c2c3c4-d1d2-e1e2-f1f2-a1a2a3a4a5a6',
    'created',
    '10000000-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Manifest created for Alexandria transit transfer',
    'تم إنشاء البيان لعملية النقل ترانزيت للإسكندرية'
);

INSERT INTO shipment_timeline (shipment_id, status, location_station_id, action_by, notes_en, notes_ar)
VALUES (
    'c1c2c3c4-d1d2-e1e2-f1f2-a1a2a3a4a5a6',
    'received_at_hub',
    '30000000-0000-0000-0000-000000000003',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Warning: Scanned at Giza Station by mistake. Destination is Alexandria.',
    'تحذير: تم مسح الطرد بمحطة الجيزة بالخطأ. وجهة الطرد هي الإسكندرية.'
);

-- Redundant alerts insertion removed. Database triggers automatically generate warning alerts on seeding.
