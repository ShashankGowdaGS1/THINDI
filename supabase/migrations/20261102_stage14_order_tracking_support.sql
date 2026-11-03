-- ==============================================================================
-- THINDI E-COMMERCE DATABASE SCHEMA — STAGE 14: TRACKING & CUSTOMER SUPPORT
-- Dialect: PostgreSQL 15+ / Supabase
-- ==============================================================================

-- 1. Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  order_reference VARCHAR(32) NOT NULL,
  shipping_provider VARCHAR(32) NOT NULL DEFAULT 'shiprocket',
  provider_shipment_id VARCHAR(64),
  courier_name VARCHAR(64),
  awb VARCHAR(64) NOT NULL,
  normalized_status VARCHAR(64) NOT NULL DEFAULT 'Shipment Created',
  provider_status VARCHAR(64),
  origin VARCHAR(128) NOT NULL DEFAULT 'Hassan, Karnataka',
  destination VARCHAR(128),
  destination_pincode VARCHAR(6),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_delivery VARCHAR(64),
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_demo_mode BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order_ref ON shipments(order_reference);
CREATE INDEX IF NOT EXISTS idx_shipments_awb ON shipments(awb);
CREATE INDEX IF NOT EXISTS idx_shipments_normalized_status ON shipments(normalized_status);

-- 2. Shipment Events (Scans & Checkpoints Timeline)
CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  provider_event_id VARCHAR(128),
  provider_status_code VARCHAR(64),
  normalized_status VARCHAR(64) NOT NULL,
  event_description TEXT NOT NULL,
  event_location VARCHAR(128),
  event_time TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_event_reference TEXT
);

CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_events_time ON shipment_events(event_time ASC);

-- 3. Order Access Challenges (Guest OTP Verification)
CREATE TABLE IF NOT EXISTS order_access_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  code_hash VARCHAR(128) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_order_ref ON order_access_challenges(order_reference);
CREATE INDEX IF NOT EXISTS idx_challenges_expires_at ON order_access_challenges(expires_at);

-- 4. Customer Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_reference VARCHAR(32) NOT NULL UNIQUE,
  order_reference VARCHAR(32),
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(15),
  customer_name VARCHAR(128),
  category VARCHAR(64) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  preferred_contact VARCHAR(16) DEFAULT 'email',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_ref ON support_tickets(ticket_reference);
CREATE INDEX IF NOT EXISTS idx_support_tickets_order ON support_tickets(order_reference);
CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON support_tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Anonymous clients cannot freely query all shipments or tickets
-- ==============================================================================
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_access_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Anonymous users cannot read challenges or raw webhook events directly
CREATE POLICY "Deny anonymous access to challenges" ON order_access_challenges
  FOR ALL USING (false);

-- Shipments and tickets accessible only by service role or authenticated backend routes
CREATE POLICY "Service role full access to shipments" ON shipments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to support tickets" ON support_tickets
  FOR ALL USING (auth.role() = 'service_role');

