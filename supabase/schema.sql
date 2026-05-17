-- ==========================================
-- LOGISHUB ENTERPRISE - SUPABASE POSTGRESQL SCHEMA
-- ==========================================

-- ENABLE REQUIRED EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For Egyptian informal address matching

-- CREATE CUSTOM TYPES
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'ops_agent', 'station_manager', 'da_courier', 'fleet_manager');
CREATE TYPE vehicle_type AS ENUM ('motorcycle', 'car', 'van', 'bicycle');
CREATE TYPE shipment_status AS ENUM (
    'created', 'received_at_hub', 'in_transit', 'arrived_at_station', 
    'out_for_delivery', 'delivered', 'postponed', 'failed_delivery', 'returned_to_origin'
);
CREATE TYPE alert_type AS ENUM ('sla_breached', 'misrouted', 'failed_attempt', 'postponed_limit_exceeded', 'cash_limit_warning');

-- 1. TENANTS / SaaS COMPANIES
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    subscription_plan VARCHAR(50) DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'professional', 'enterprise')),
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'canceled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS (MAPPED TO SUPABASE AUTH.USERS)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'da_courier',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. HUBS / STATIONS
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    governorate VARCHAR(100) NOT NULL, -- Destination Governorate mapping
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DELIVERY AGENT PROFILES
CREATE TABLE da_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    station_id UUID REFERENCES stations(id) ON DELETE SET NULL,
    vehicle vehicle_type NOT NULL DEFAULT 'motorcycle',
    license_plate VARCHAR(50),
    max_capacity INT DEFAULT 40,
    current_status VARCHAR(50) DEFAULT 'idle' CHECK (current_status IN ('idle', 'on_route', 'off_duty')),
    wallet_balance DECIMAL(12, 2) DEFAULT 0.00 -- Cash EGP in possession
);

-- 5. SHIPMENTS
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_phone_2 VARCHAR(50),
    governorate VARCHAR(100) NOT NULL, -- Target Governorate
    city VARCHAR(100) NOT NULL,
    address_text TEXT NOT NULL, -- Unstructured Arabic landmarks address
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    cod_amount DECIMAL(12, 2) DEFAULT 0.00, -- Cash to collect (EGP)
    status shipment_status NOT NULL DEFAULT 'created',
    
    origin_station_id UUID REFERENCES stations(id) ON DELETE SET NULL,
    current_station_id UUID REFERENCES stations(id) ON DELETE SET NULL,
    destination_station_id UUID REFERENCES stations(id) ON DELETE SET NULL,
    assigned_da_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    is_delayed BOOLEAN DEFAULT FALSE,
    is_misrouted BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TIMELINE AUDIT LOGS
CREATE TABLE shipment_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    status shipment_status NOT NULL,
    location_station_id UUID REFERENCES stations(id) ON DELETE SET NULL,
    action_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes_en TEXT,
    notes_ar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. OPERATIONS ALERTS
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    type alert_type NOT NULL,
    message_en TEXT NOT NULL,
    message_ar TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 8. PHYSICAL CASH SETTLEMENTS LEDGER
CREATE TABLE cash_settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    da_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    station_manager_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_expected DECIMAL(12, 2) NOT NULL,
    amount_received DECIMAL(12, 2) NOT NULL,
    discrepancy DECIMAL(12, 2) GENERATED ALWAYS AS (amount_received - amount_expected) STORED,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- HIGH PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX idx_shipments_tenant ON shipments(tenant_id);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_current ON shipments(current_station_id);
CREATE INDEX idx_shipments_assigned ON shipments(assigned_da_id);
CREATE INDEX idx_alerts_tenant_unresolved ON alerts(tenant_id) WHERE is_resolved = FALSE;
CREATE INDEX idx_timeline_shipment ON shipment_timeline(shipment_id);

-- ==========================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- We restrict access based on a secure custom claim mapping tenant_id

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_settlements ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch user's tenant ID from JWT token claims to prevent infinite RLS recursion
CREATE OR REPLACE FUNCTION current_user_tenant_id()
RETURNS UUID AS $$
    SELECT COALESCE(
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb -> 'user_metadata' ->> 'tenant_id')::uuid,
        '8c9c7f1a-5b12-4d3a-bf4c-7c8a9d0e1f2b'::uuid -- Fallback to Demonstrator Tenant UUID
    );
$$ LANGUAGE sql STABLE;

-- Users RLS Policies
CREATE POLICY user_tenant_isolation ON users
    FOR ALL USING (tenant_id = current_user_tenant_id());

-- Stations RLS Policies
CREATE POLICY station_tenant_isolation ON stations
    FOR ALL USING (tenant_id = current_user_tenant_id());

-- Shipments RLS Policies
CREATE POLICY shipment_tenant_isolation ON shipments
    FOR ALL USING (tenant_id = current_user_tenant_id());

-- Timeline RLS Policies
CREATE POLICY timeline_tenant_isolation ON shipment_timeline
    FOR ALL USING (
        shipment_id IN (SELECT id FROM shipments WHERE tenant_id = current_user_tenant_id())
    );

-- Alerts RLS Policies
CREATE POLICY alert_tenant_isolation ON alerts
    FOR ALL USING (tenant_id = current_user_tenant_id());

-- Cash Ledger RLS Policies
CREATE POLICY cash_tenant_isolation ON cash_settlements
    FOR ALL USING (tenant_id = current_user_tenant_id());

-- ==========================================
-- DATABASE TRIGGERS & FUNCTIONS
-- ==========================================

-- CHECK MISROUTED SHIPMENTS TRIGGER
CREATE OR REPLACE FUNCTION check_shipment_misroute_trigger()
RETURNS TRIGGER AS $$
DECLARE
    curr_gov VARCHAR;
BEGIN
    IF NEW.current_station_id IS NOT NULL AND NEW.destination_station_id IS NOT NULL THEN
        -- Fetch current station governorate
        SELECT governorate INTO curr_gov FROM stations WHERE id = NEW.current_station_id;
        
        -- If current station governorate does not match package destination governorate
        IF NEW.current_station_id <> NEW.destination_station_id AND curr_gov <> NEW.governorate THEN
            NEW.is_misrouted := TRUE;
            
            -- Insert Operational Alert
            INSERT INTO alerts (tenant_id, shipment_id, station_id, type, message_en, message_ar)
            VALUES (
                NEW.tenant_id,
                NEW.id,
                NEW.current_station_id,
                'misrouted',
                'Shipment ' || NEW.tracking_number || ' scanned at ' || curr_gov || ' Hub, but destination is ' || NEW.governorate,
                'تم فحص الشحنة ' || NEW.tracking_number || ' بمحطة ' || curr_gov || ' بينما وجهتها هي ' || NEW.governorate
            )
            ON CONFLICT DO NOTHING;
        ELSE
            NEW.is_misrouted := FALSE;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_check_shipment_misroute
AFTER INSERT OR UPDATE OF current_station_id ON shipments
FOR EACH ROW EXECUTE FUNCTION check_shipment_misroute_trigger();

-- AUTOMATED HOURLY SLA BREACH SCANNER
CREATE OR REPLACE FUNCTION flag_sla_breach_alerts()
RETURNS VOID AS $$
BEGIN
    -- Flag delayed shipments
    UPDATE shipments
    SET is_delayed = TRUE
    WHERE status NOT IN ('delivered', 'returned_to_origin')
      AND sla_deadline <= CURRENT_TIMESTAMP
      AND is_delayed = FALSE;
      
    -- Insert alerts for newly flagged items
    INSERT INTO alerts (tenant_id, shipment_id, station_id, type, message_en, message_ar)
    SELECT 
        tenant_id,
        id,
        current_station_id,
        'sla_breached',
        'SLA deadline expired for shipment ' || tracking_number || ' in ' || city,
        'انتهت مهلة الـ SLA للشحنة ' || tracking_number || ' في ' || city
    FROM shipments
    WHERE is_delayed = TRUE
      AND id NOT IN (SELECT shipment_id FROM alerts WHERE type = 'sla_breached' AND is_resolved = FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
