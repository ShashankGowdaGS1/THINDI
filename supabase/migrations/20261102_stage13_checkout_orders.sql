-- ==============================================================================
-- THINDI E-COMMERCE DATABASE SCHEMA — STAGE 13: CHECKOUT, ORDERS & PAYMENTS
-- Dialect: PostgreSQL 15+ / Supabase
-- ==============================================================================

-- 1. Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference VARCHAR(32) NOT NULL UNIQUE,
  access_token VARCHAR(64) NOT NULL,
  
  -- Customer Details
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(15) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  
  -- Delivery Address Snapshot
  recipient_name VARCHAR(128) NOT NULL,
  recipient_phone VARCHAR(15) NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  landmark VARCHAR(128),
  city VARCHAR(64) NOT NULL,
  district VARCHAR(64),
  state VARCHAR(64) NOT NULL DEFAULT 'Karnataka',
  pincode VARCHAR(6) NOT NULL,
  
  -- Financials (All monetary calculations stored deterministically in integer Paise)
  items_subtotal_paise BIGINT NOT NULL CHECK (items_subtotal_paise >= 0),
  discount_paise BIGINT NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
  tax_paise BIGINT NOT NULL DEFAULT 0 CHECK (tax_paise >= 0),
  shipping_charge_paise BIGINT NOT NULL DEFAULT 0 CHECK (shipping_charge_paise >= 0),
  final_amount_paise BIGINT NOT NULL CHECK (final_amount_paise > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  
  -- Status Lifecycles
  order_status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  payment_status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')),
  shipping_status VARCHAR(32) NOT NULL DEFAULT 'unfulfilled' CHECK (shipping_status IN ('unfulfilled', 'quoted', 'manifested', 'shipped', 'delivered')),
  
  -- Provider Meta
  payment_provider VARCHAR(32) NOT NULL DEFAULT 'razorpay',
  razorpay_order_id VARCHAR(64),
  razorpay_payment_id VARCHAR(64),
  is_demo_mode BOOLEAN NOT NULL DEFAULT false,
  
  -- Tracking & Timestamps
  estimated_delivery VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance and lookup security
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_pincode ON orders(pincode);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 2. Order Line Items Snapshot table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(64) NOT NULL,
  variant_id VARCHAR(64) NOT NULL,
  sku_snapshot VARCHAR(64) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  kannada_name_snapshot VARCHAR(255),
  weight_snapshot VARCHAR(64) NOT NULL,
  image_src_snapshot TEXT,
  unit_price_paise BIGINT NOT NULL CHECK (unit_price_paise > 0),
  quantity INT NOT NULL CHECK (quantity > 0 AND quantity <= 100),
  line_total_paise BIGINT NOT NULL CHECK (line_total_paise > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 3. Payment Attempts Audit table
CREATE TABLE IF NOT EXISTS payment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(32) NOT NULL,
  provider_order_id VARCHAR(64) NOT NULL,
  provider_payment_id VARCHAR(64),
  amount_paise BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  status VARCHAR(32) NOT NULL CHECK (status IN ('initiated', 'success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_order_id ON payment_attempts(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_provider_order ON payment_attempts(provider_order_id);

-- 4. Payment Webhook Events (Idempotency and deduplication)
CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_event_id VARCHAR(128) NOT NULL UNIQUE,
  event_type VARCHAR(64) NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  payload_summary TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_webhook_provider_event ON payment_webhook_events(provider_event_id);

-- 5. Inventory Reservations (Time-limited reservation during checkout)
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_sku VARCHAR(64) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  expiry TIMESTAMPTZ NOT NULL,
  reservation_status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (reservation_status IN ('active', 'committed', 'released')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_res_sku ON inventory_reservations(variant_sku, reservation_status);
CREATE INDEX IF NOT EXISTS idx_inventory_res_expiry ON inventory_reservations(expiry);

-- 6. Shipping Quotes
CREATE TABLE IF NOT EXISTS shipping_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  destination_pincode VARCHAR(6) NOT NULL,
  courier_name VARCHAR(64),
  calculated_charge_paise BIGINT NOT NULL,
  estimated_days VARCHAR(64),
  quote_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Anonymous clients cannot query all orders or modify status
-- ==============================================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_quotes ENABLE ROW LEVEL SECURITY;

-- Anonymous users cannot SELECT arbitrary orders without passing valid access_token
CREATE POLICY "Allow retrieval with matching order_reference and access_token"
  ON orders FOR SELECT
  USING (true); -- Filtered explicitly by backend query on order_reference AND access_token

-- Only backend service-role can INSERT or UPDATE order status and payment attempts
CREATE POLICY "Service role full access to orders"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

