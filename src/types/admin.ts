import { OrderStatus, PaymentStatus, ShippingStatus } from './checkout';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'MARKETING_MANAGER'
  | 'FINANCE';

export type AdminPermission =
  | 'overview:read'
  | 'orders:read'
  | 'orders:write'
  | 'orders:fulfil'
  | 'products:read'
  | 'products:write'
  | 'products:publish'
  | 'categories:manage'
  | 'inventory:read'
  | 'inventory:adjust'
  | 'inventory:batches'
  | 'shipping:read'
  | 'shipping:dispatch'
  | 'payments:read'
  | 'refunds:request'
  | 'refunds:approve'
  | 'support:read'
  | 'support:write'
  | 'campaigns:read'
  | 'campaigns:write'
  | 'customers:read'
  | 'staff:manage'
  | 'settings:manage'
  | 'audit:read';

export interface StaffUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  active: boolean;
  department: string;
  lastSignInAt?: string;
  createdAt: string;
}

export interface AdminSession {
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  issuedAt: number;
  expiresAt: number;
}

export interface InventoryItemRecord {
  variantSku: string;
  productId: string;
  productName: string;
  variantWeight: string;
  category: string;
  stockAvailable: number;
  stockReserved: number;
  stockAllocated: number;
  stockDamaged: number;
  stockExpired: number;
  minThreshold: number;
  unitPricePaise: number;
  lastAuditedAt: string;
}

export type StockMovementReason =
  | 'production_receipt'
  | 'order_reservation'
  | 'order_allocation'
  | 'cancellation_release'
  | 'stock_correction'
  | 'damaged_spoilage'
  | 'expired_disposal'
  | 'audit_adjustment';

export interface StockMovement {
  id: string;
  movementReference: string;
  variantSku: string;
  productName: string;
  quantityChange: number; // positive or negative
  newBalance: number;
  reason: StockMovementReason;
  orderReference?: string;
  batchId?: string;
  actorEmail: string;
  notes?: string;
  timestamp: string;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string; // e.g. BATCH-2026-CHK-01
  variantSku: string;
  productName: string;
  productionDate: string; // ISO date
  expiryDate: string; // ISO date
  shelfLifeDays: number;
  quantityProduced: number;
  quantityRemaining: number;
  status: 'active' | 'near_expiry' | 'expired' | 'depleted' | 'quarantined';
  storageLocation: string; // e.g. "Hassan Main Kitchen Room B"
  fssaiBatchRef?: string;
  notes?: string;
  createdAt: string;
}

export interface RefundRecord {
  id: string;
  refundReference: string; // e.g. REF-2026-XXXX
  orderReference: string;
  razorpayPaymentId?: string;
  amountPaise: number;
  reason: string;
  status: 'requested' | 'approved' | 'processed' | 'rejected';
  requestedBy: string;
  approvedBy?: string;
  providerRefundId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string; // e.g. "PRODUCT_PUBLISHED", "ORDER_STATUS_CHANGED"
  actorEmail: string;
  actorRole: AdminRole;
  targetResource: string; // e.g. "orders", "products", "inventory"
  targetId: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface BusinessSettings {
  brandName: string;
  kannadaName: string;
  tagline: string;
  kitchenLocation: string;
  pickupPincode: string;
  operatingAddress: string;
  fssaiNumber: string;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  currency: string;
  freeShippingThresholdPaise: number;
  standardShippingFeePaise: number;
  storefrontActive: boolean;
  updatedAt: string;
}

