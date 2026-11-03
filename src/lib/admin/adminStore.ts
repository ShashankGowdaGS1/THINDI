import crypto from 'node:crypto';
import { ALL_SHOP_PRODUCTS } from '@/data/products';
import { CRAVING_CATEGORIES, CravingCategory } from '@/data/categories';
import { FESTIVAL_CAMPAIGNS } from '@/data/campaigns';
import { Product, ProductVariant } from '@/types/product';
import { OrderRecord, OrderStatus } from '@/types/checkout';
import {
  InventoryItemRecord,
  StockMovement,
  StockMovementReason,
  ProductionBatch,
  RefundRecord,
  AuditLogEntry,
  BusinessSettings,
  AdminRole,
} from '@/types/admin';
import { SupportTicket } from '@/types/tracking';

// Mutable in-memory stores for Admin Operations
const productsMap = new Map<string, Product>();
const categoriesMap = new Map<string, CravingCategory>();
const inventoryMap = new Map<string, InventoryItemRecord>();
const stockMovements: StockMovement[] = [];
const productionBatchesMap = new Map<string, ProductionBatch>();
const refundRecordsMap = new Map<string, RefundRecord>();
const auditLogs: AuditLogEntry[] = [];

// Business Settings Default
let businessSettings: BusinessSettings = {
  brandName: 'THINDI',
  kannadaName: 'ತಿಂಡಿ',
  tagline: 'Traditional Karnataka flavours. A little closer to home.',
  kitchenLocation: 'Hassan, Karnataka',
  pickupPincode: '573201',
  operatingAddress: 'Plot 42, Industrial Area, B. Katihalli, Hassan - 573201',
  fssaiNumber: '11226334000189', // Verified artisan license format
  supportEmail: 'care@thindi.in',
  supportPhone: '9845012345',
  supportHours: 'Mon–Sat: 10:00 AM – 6:00 PM IST',
  currency: 'INR',
  freeShippingThresholdPaise: 49900,
  standardShippingFeePaise: 4900,
  storefrontActive: true,
  updatedAt: new Date().toISOString(),
};

// Initialize Admin Data Seeds
function initializeAdminStore() {
  const now = new Date();

  // 1. Seed Products
  ALL_SHOP_PRODUCTS.forEach((p) => {
    productsMap.set(p.id, { ...p, active: p.active ?? true });

    // Seed inventory records for every variant
    p.variants.forEach((v) => {
      // Realistic starting stock
      const available = v.sku.includes('200') ? 45 : 28;
      const reserved = 4;
      const minThreshold = 15;

      inventoryMap.set(v.sku, {
        variantSku: v.sku,
        productId: p.id,
        productName: p.name,
        variantWeight: v.weight,
        category: p.category,
        stockAvailable: available,
        stockReserved: reserved,
        stockAllocated: 0,
        stockDamaged: 0,
        stockExpired: 0,
        minThreshold,
        unitPricePaise: Math.round(v.price * 100),
        lastAuditedAt: now.toISOString(),
      });
    });
  });

  // 2. Seed Categories
  CRAVING_CATEGORIES.forEach((c) => {
    categoriesMap.set(c.id, { ...c });
  });

  // 3. Seed Production Batches
  const batch1: ProductionBatch = {
    id: 'batch-01',
    batchNumber: 'BATCH-2026-CHK-01',
    variantSku: 'THN-CHK-200',
    productName: 'Traditional Hassan Chakkali (200g)',
    productionDate: new Date(now.getTime() - 10 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(now.getTime() + 50 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 60,
    quantityProduced: 100,
    quantityRemaining: 45,
    status: 'active',
    storageLocation: 'Hassan Kitchen Hub — Shelf A1',
    createdAt: now.toISOString(),
  };

  const batch2: ProductionBatch = {
    id: 'batch-02',
    batchNumber: 'BATCH-2026-KOD-02',
    variantSku: 'THN-KOD-200',
    productName: 'Crisp Ring Kodubale (200g)',
    productionDate: new Date(now.getTime() - 35 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(now.getTime() + 10 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 45,
    quantityProduced: 80,
    quantityRemaining: 12,
    status: 'near_expiry', // Warning state!
    storageLocation: 'Hassan Kitchen Hub — Shelf B2',
    createdAt: now.toISOString(),
  };

  const batch3: ProductionBatch = {
    id: 'batch-03',
    batchNumber: 'BATCH-2026-MNG-01',
    variantSku: 'THN-MNG-250',
    productName: 'Mavinkayi Mango Pickle (250g Jar)',
    productionDate: new Date(now.getTime() - 20 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(now.getTime() + 160 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 180,
    quantityProduced: 50,
    quantityRemaining: 34,
    status: 'active',
    storageLocation: 'Hassan Curing Pantry — Jar Rack 4',
    createdAt: now.toISOString(),
  };

  productionBatchesMap.set(batch1.id, batch1);
  productionBatchesMap.set(batch2.id, batch2);
  productionBatchesMap.set(batch3.id, batch3);

  // 4. Initial Audit Log
  auditLogs.push({
    id: crypto.randomUUID(),
    action: 'SYSTEM_BOOTSTRAP',
    actorEmail: 'superadmin@thindi.in',
    actorRole: 'SUPER_ADMIN',
    targetResource: 'system',
    targetId: 'thindi-core',
    details: 'Initial administrative inventory and product stores initialized.',
    timestamp: now.toISOString(),
  });
}

initializeAdminStore();

// ==============================================================================
// 1. AUDIT LOGGING SERVICE
// ==============================================================================
export function recordAuditLog(entry: {
  action: string;
  actorEmail: string;
  actorRole: AdminRole;
  targetResource: string;
  targetId: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}): AuditLogEntry {
  const record: AuditLogEntry = {
    id: crypto.randomUUID(),
    action: entry.action,
    actorEmail: entry.actorEmail,
    actorRole: entry.actorRole,
    targetResource: entry.targetResource,
    targetId: entry.targetId,
    details: entry.details,
    metadata: entry.metadata,
    ipAddress: entry.ipAddress,
    timestamp: new Date().toISOString(),
  };

  auditLogs.unshift(record); // Prepend so newest is first
  return record;
}

export function getAuditLogs(limit = 100): AuditLogEntry[] {
  return auditLogs.slice(0, limit);
}

// ==============================================================================
// 2. PRODUCT MANAGEMENT SERVICE
// ==============================================================================
export function getAllAdminProducts(): Product[] {
  return Array.from(productsMap.values());
}

export function getAdminProductById(id: string): Product | null {
  return productsMap.get(id) || null;
}

export function validateProductForPublishing(product: Partial<Product>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length < 2) {
    errors.push('Product name is required.');
  }
  if (!product.category) {
    errors.push('Product category must be assigned.');
  }
  if (!product.imageSrc) {
    errors.push('Primary product image is required.');
  }
  if (!product.variants || product.variants.length === 0) {
    errors.push('Product must have at least one active variant.');
  } else {
    product.variants.forEach((v, idx) => {
      if (!v.sku || v.sku.trim().length === 0) {
        errors.push(`Variant #${idx + 1} is missing a unique SKU identifier.`);
      }
      if (!v.weight || v.weight.trim().length === 0) {
        errors.push(`Variant #${idx + 1} is missing pack weight.`);
      }
      if (!v.price || v.price <= 0) {
        errors.push(`Variant #${idx + 1} price must be greater than zero.`);
      }
    });
  }

  // Food information & compliance checks (FSSAI packaging rules)
  if (!product.ingredients || product.ingredients.length === 0) {
    errors.push('Mandatory declaration: Ingredients list must be provided.');
  }
  if (!product.storageInstructions || product.storageInstructions.trim().length === 0) {
    errors.push('Mandatory declaration: Storage instructions are required.');
  }
  if (!product.shelfLife || product.shelfLife.trim().length === 0) {
    errors.push('Mandatory declaration: Shelf life statement is required.');
  }
  if (!product.foodDeclaration || product.foodDeclaration.trim().length === 0) {
    errors.push('Mandatory declaration: Vegetarian / artisan food declaration is required.');
  }

  return { valid: errors.length === 0, errors };
}

export function saveAdminProduct(
  productData: Product,
  actorEmail: string,
  actorRole: AdminRole
): { success: boolean; product?: Product; error?: string } {
  // Check for duplicate SKUs across other products
  for (const v of productData.variants) {
    for (const otherP of productsMap.values()) {
      if (otherP.id !== productData.id) {
        const dup = otherP.variants.find((ov) => ov.sku.toUpperCase() === v.sku.toUpperCase());
        if (dup) {
          return {
            success: false,
            error: `SKU "${v.sku}" is already in use by product "${otherP.name}".`,
          };
        }
      }
    }
  }

  const isNew = !productsMap.has(productData.id);
  productsMap.set(productData.id, productData);

  // Sync inventory records for new variants
  productData.variants.forEach((v) => {
    if (!inventoryMap.has(v.sku)) {
      inventoryMap.set(v.sku, {
        variantSku: v.sku,
        productId: productData.id,
        productName: productData.name,
        variantWeight: v.weight,
        category: productData.category,
        stockAvailable: 25,
        stockReserved: 0,
        stockAllocated: 0,
        stockDamaged: 0,
        stockExpired: 0,
        minThreshold: 10,
        unitPricePaise: Math.round(v.price * 100),
        lastAuditedAt: new Date().toISOString(),
      });
    }
  });

  recordAuditLog({
    action: isNew ? 'PRODUCT_CREATED' : 'PRODUCT_UPDATED',
    actorEmail,
    actorRole,
    targetResource: 'products',
    targetId: productData.id,
    details: `${isNew ? 'Created' : 'Updated'} product "${productData.name}" (${productData.id})`,
  });

  return { success: true, product: productData };
}

// ==============================================================================
// 3. CATEGORY MANAGEMENT SERVICE
// ==============================================================================
export function getAllAdminCategories(): CravingCategory[] {
  return Array.from(categoriesMap.values());
}

export function saveAdminCategory(
  catData: CravingCategory,
  actorEmail: string,
  actorRole: AdminRole
): CravingCategory {
  const isNew = !categoriesMap.has(catData.id);
  categoriesMap.set(catData.id, catData);

  recordAuditLog({
    action: isNew ? 'CATEGORY_CREATED' : 'CATEGORY_UPDATED',
    actorEmail,
    actorRole,
    targetResource: 'categories',
    targetId: catData.id,
    details: `${isNew ? 'Created' : 'Updated'} category "${catData.title}" (${catData.id})`,
  });

  return catData;
}

export function deleteAdminCategory(
  catId: string,
  actorEmail: string,
  actorRole: AdminRole
): { success: boolean; error?: string } {
  // Check if active products depend on this category
  const dependentProducts = Array.from(productsMap.values()).filter((p) => p.category === catId);
  if (dependentProducts.length > 0) {
    return {
      success: false,
      error: `Cannot delete category "${catId}" because ${dependentProducts.length} active products are assigned to it.`,
    };
  }

  categoriesMap.delete(catId);
  recordAuditLog({
    action: 'CATEGORY_DELETED',
    actorEmail,
    actorRole,
    targetResource: 'categories',
    targetId: catId,
    details: `Deleted category (${catId})`,
  });

  return { success: true };
}

// ==============================================================================
// 4. INVENTORY & STOCK MOVEMENTS LEDGER
// ==============================================================================
export function getAllInventoryItems(): InventoryItemRecord[] {
  return Array.from(inventoryMap.values());
}

export function getInventoryBySku(sku: string): InventoryItemRecord | null {
  return inventoryMap.get(sku.trim().toUpperCase()) || null;
}

export function recordStockMovement(params: {
  variantSku: string;
  quantityChange: number;
  reason: StockMovementReason;
  orderReference?: string;
  batchId?: string;
  actorEmail: string;
  notes?: string;
}): { success: boolean; item?: InventoryItemRecord; error?: string } {
  const sku = params.variantSku.trim().toUpperCase();
  const item = inventoryMap.get(sku);
  if (!item) {
    return { success: false, error: `Inventory item for SKU "${sku}" was not found.` };
  }

  const newAvailable = item.stockAvailable + params.quantityChange;
  if (newAvailable < 0) {
    return {
      success: false,
      error: `Insufficient stock for SKU "${sku}". Available: ${item.stockAvailable}, Requested Change: ${params.quantityChange}`,
    };
  }

  item.stockAvailable = newAvailable;
  item.lastAuditedAt = new Date().toISOString();
  inventoryMap.set(sku, item);

  const movementRecord: StockMovement = {
    id: crypto.randomUUID(),
    movementReference: `MOV-${Date.now().toString(36).toUpperCase()}`,
    variantSku: sku,
    productName: item.productName,
    quantityChange: params.quantityChange,
    newBalance: newAvailable,
    reason: params.reason,
    orderReference: params.orderReference,
    batchId: params.batchId,
    actorEmail: params.actorEmail,
    notes: params.notes,
    timestamp: new Date().toISOString(),
  };

  stockMovements.unshift(movementRecord);

  return { success: true, item };
}

export function getStockMovements(limit = 100): StockMovement[] {
  return stockMovements.slice(0, limit);
}

// ==============================================================================
// 5. PRODUCTION BATCHES & EXPIRY
// ==============================================================================
export function getAllProductionBatches(): ProductionBatch[] {
  const now = new Date();
  return Array.from(productionBatchesMap.values()).map((b) => {
    // Dynamic recalculation of near_expiry vs expired
    const exp = new Date(b.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / 86400000);

    let status = b.status;
    if (status !== 'quarantined' && status !== 'depleted') {
      if (diffDays <= 0) {
        status = 'expired';
      } else if (diffDays <= 15) {
        status = 'near_expiry';
      }
    }
    return { ...b, status };
  });
}

export function saveProductionBatch(
  batchData: Omit<ProductionBatch, 'id' | 'createdAt'>,
  actorEmail: string,
  actorRole: AdminRole
): ProductionBatch {
  const id = `batch-${Date.now().toString(36)}`;
  const batch: ProductionBatch = {
    ...batchData,
    id,
    createdAt: new Date().toISOString(),
  };

  productionBatchesMap.set(id, batch);

  // Automatically record stock movement for batch production receipt
  recordStockMovement({
    variantSku: batch.variantSku,
    quantityChange: batch.quantityProduced,
    reason: 'production_receipt',
    batchId: batch.batchNumber,
    actorEmail,
    notes: `Production batch ${batch.batchNumber} received at ${batch.storageLocation}.`,
  });

  recordAuditLog({
    action: 'BATCH_CREATED',
    actorEmail,
    actorRole,
    targetResource: 'batches',
    targetId: batch.batchNumber,
    details: `Created batch ${batch.batchNumber} with ${batch.quantityProduced} units of ${batch.variantSku}`,
  });

  return batch;
}

// ==============================================================================
// 6. REFUND MANAGEMENT SERVICE
// ==============================================================================
export function getAllRefunds(): RefundRecord[] {
  return Array.from(refundRecordsMap.values());
}

export function requestOrderRefund(params: {
  orderReference: string;
  paymentId?: string;
  amountPaise: number;
  reason: string;
  requestedBy: string;
}): RefundRecord {
  const id = crypto.randomUUID();
  const refundReference = `REF-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const now = new Date().toISOString();

  const record: RefundRecord = {
    id,
    refundReference,
    orderReference: params.orderReference.trim().toUpperCase(),
    razorpayPaymentId: params.paymentId,
    amountPaise: params.amountPaise,
    reason: params.reason,
    status: 'requested',
    requestedBy: params.requestedBy,
    createdAt: now,
    updatedAt: now,
  };

  refundRecordsMap.set(refundReference, record);

  recordAuditLog({
    action: 'REFUND_REQUESTED',
    actorEmail: params.requestedBy,
    actorRole: 'FINANCE',
    targetResource: 'refunds',
    targetId: refundReference,
    details: `Refund of ₹${params.amountPaise / 100} requested for order ${params.orderReference}. Reason: ${params.reason}`,
  });

  return record;
}

export function approveOrderRefund(
  refundReference: string,
  approvedBy: string,
  actorRole: AdminRole
): { success: boolean; refund?: RefundRecord; error?: string } {
  const record = refundRecordsMap.get(refundReference.trim().toUpperCase());
  if (!record) {
    return { success: false, error: 'Refund record not found.' };
  }

  if (record.status !== 'requested') {
    return { success: false, error: `Refund is already in status "${record.status}".` };
  }

  record.status = 'processed';
  record.approvedBy = approvedBy;
  record.providerRefundId = `rfnd_demo_${Date.now().toString(36)}`;
  record.updatedAt = new Date().toISOString();
  refundRecordsMap.set(refundReference, record);

  recordAuditLog({
    action: 'REFUND_PROCESSED',
    actorEmail: approvedBy,
    actorRole,
    targetResource: 'refunds',
    targetId: refundReference,
    details: `Refund of ₹${record.amountPaise / 100} approved and processed for order ${record.orderReference}.`,
  });

  return { success: true, refund: record };
}

// ==============================================================================
// 8. CAMPAIGNS MANAGEMENT SERVICE
// ==============================================================================
const campaignsMap = new Map<string, any>();
FESTIVAL_CAMPAIGNS.forEach((c) => campaignsMap.set(c.id, { ...c }));

export function getAllAdminCampaigns() {
  return Array.from(campaignsMap.values());
}

export function updateAdminCampaign(
  id: string,
  updates: any,
  actorEmail: string,
  actorRole: AdminRole
) {
  const existing = campaignsMap.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates };
  campaignsMap.set(id, updated);

  recordAuditLog({
    action: 'CAMPAIGN_UPDATED',
    actorEmail,
    actorRole,
    targetResource: 'campaigns',
    targetId: id,
    details: `Updated campaign "${updated.name}" (${id})`,
  });

  return updated;
}
export function getBusinessSettings(): BusinessSettings {
  return { ...businessSettings };
}

export function updateBusinessSettings(
  updates: Partial<BusinessSettings>,
  actorEmail: string,
  actorRole: AdminRole
): BusinessSettings {
  businessSettings = {
    ...businessSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  recordAuditLog({
    action: 'SETTINGS_UPDATED',
    actorEmail,
    actorRole,
    targetResource: 'settings',
    targetId: 'business_settings',
    details: 'Business and commerce operational settings updated.',
  });

  return { ...businessSettings };
}
