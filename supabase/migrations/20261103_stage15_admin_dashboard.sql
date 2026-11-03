-- ==============================================================================
-- THINDI E-COMMERCE DATABASE SCHEMA — STAGE 15: COMPLETE ADMIN DASHBOARD
-- Dialect: PostgreSQL 15+ / Supabase
-- ==============================================================================

-- 1. Admin Staff Directory & Role-Based Access Control
CREATE TABLE IF NOT EXISTS admin_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'CUSTOMER_SUPPORT', 'MARKETING_MANAGER', 'FINANCE')),
  active BOOLEAN NOT NULL DEFAULT true,
  department VARCHAR(64),
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_staff_email ON admin_staff(email);
CREATE INDEX IF NOT EXISTS idx_admin_staff_role ON admin_staff(role);

-- 2. Inventory Stock Records (Variant-Level)
CREATE TABLE IF NOT EXISTS inventory_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_sku VARCHAR(64) NOT NULL UNIQUE,
  product_id VARCHAR(64) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  stock_available INT NOT NULL DEFAULT 0 CHECK (stock_available >= 0),
  stock_reserved INT NOT NULL DEFAULT 0 CHECK (stock_reserved >= 0),
  stock_allocated INT NOT NULL DEFAULT 0 CHECK (stock_allocated >= 0),
  stock_damaged INT NOT NULL DEFAULT 0 CHECK (stock_damaged >= 0),
  stock_expired INT NOT NULL DEFAULT 0 CHECK (stock_expired >= 0),
  min_threshold INT NOT NULL DEFAULT 10 CHECK (min_threshold >= 0),
  last_audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_stock_sku ON inventory_stock(variant_sku);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_product ON inventory_stock(product_id);

-- 3. Stock Movement Ledger
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movement_reference VARCHAR(32) NOT NULL UNIQUE,
  variant_sku VARCHAR(64) NOT NULL,
  quantity_change INT NOT NULL,
  new_balance INT NOT NULL CHECK (new_balance >= 0),
  reason VARCHAR(64) NOT NULL,
  order_reference VARCHAR(32),
  batch_id VARCHAR(64),
  actor_email VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_sku ON inventory_movements(variant_sku);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_order ON inventory_movements(order_reference);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_time ON inventory_movements(created_at DESC);

-- 4. Production Batches & Expiry Management
CREATE TABLE IF NOT EXISTS production_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number VARCHAR(64) NOT NULL UNIQUE,
  variant_sku VARCHAR(64) NOT NULL,
  production_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  quantity_produced INT NOT NULL CHECK (quantity_produced > 0),
  quantity_remaining INT NOT NULL CHECK (quantity_remaining >= 0),
  status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'near_expiry', 'expired', 'depleted', 'quarantined')),
  storage_location VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batches_sku ON production_batches(variant_sku);
CREATE INDEX IF NOT EXISTS idx_batches_expiry ON production_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_batches_status ON production_batches(status);

-- 5. Refund Requests Workflow
CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_reference VARCHAR(32) NOT NULL UNIQUE,
  order_reference VARCHAR(32) NOT NULL,
  razorpay_payment_id VARCHAR(64),
  amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
  reason TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'processed', 'rejected')),
  requested_by VARCHAR(255) NOT NULL,
  approved_by VARCHAR(255),
  provider_refund_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refunds_ref ON refund_requests(refund_reference);
CREATE INDEX IF NOT EXISTS idx_refunds_order ON refund_requests(order_reference);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refund_requests(status);

-- 6. Business Operations Settings
CREATE TABLE IF NOT EXISTS business_settings (
  id VARCHAR(32) PRIMARY KEY DEFAULT 'current',
  brand_name VARCHAR(64) NOT NULL DEFAULT 'THINDI',
  kitchen_location VARCHAR(128) NOT NULL DEFAULT 'Hassan, Karnataka',
  pickup_pincode VARCHAR(6) NOT NULL DEFAULT '573201',
  operating_address TEXT NOT NULL,
  fssai_number VARCHAR(32) NOT NULL,
  support_email VARCHAR(255) NOT NULL,
  support_phone VARCHAR(15) NOT NULL,
  free_shipping_threshold_paise BIGINT NOT NULL DEFAULT 49900,
  standard_shipping_fee_paise BIGINT NOT NULL DEFAULT 4900,
  storefront_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Immutable Admin Audit Logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(64) NOT NULL,
  actor_email VARCHAR(255) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  target_resource VARCHAR(64) NOT NULL,
  target_id VARCHAR(128) NOT NULL,
  details TEXT NOT NULL,
  metadata JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON admin_audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON admin_audit_logs(target_resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Zero public access to administration resources
-- ==============================================================================
ALTER TABLE admin_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Deny all direct anonymous or public client operations
CREATE POLICY "Deny anonymous access to admin staff" ON admin_staff FOR ALL USING (false);
CREATE POLICY "Deny anonymous access to inventory stock" ON inventory_stock FOR ALL USING (false);
CREATE POLICY "Deny anonymous access to inventory movements" ON inventory_movements FOR ALL USING (false);
CREATE POLICY "Deny anonymous access to batches" ON production_batches FOR ALL USING (false);
CREATE POLICY "Deny anonymous access to refunds" ON refund_requests FOR ALL USING (false);
CREATE POLICY "Deny anonymous access to audit logs" ON admin_audit_logs FOR ALL USING (false);

-- Service role full access for authenticated backend API operations
CREATE POLICY "Service role full access to admin staff" ON admin_staff FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to inventory stock" ON inventory_stock FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to inventory movements" ON inventory_movements FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to batches" ON production_batches FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to refunds" ON refund_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to audit logs" ON admin_audit_logs FOR ALL USING (auth.role() = 'service_role');

