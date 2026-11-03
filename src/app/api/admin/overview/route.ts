import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllOrders } from '@/lib/checkout/orderStore';
import {
  getAllInventoryItems,
  getAllProductionBatches,
  getAllRefunds,
  getAuditLogs,
} from '@/lib/admin/adminStore';
import { getAllSupportTickets, getAllShipments } from '@/lib/tracking/trackingStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'overview:read');
  if (!guard.authorized) {
    return guard.response!;
  }

  const orders = getAllOrders();
  const inventory = getAllInventoryItems();
  const batches = getAllProductionBatches();
  const refunds = getAllRefunds();
  const tickets = getAllSupportTickets();
  const shipments = getAllShipments();
  const logs = getAuditLogs(10);

  // Date filtering helper: Asia/Kolkata day match
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  let todayOrdersCount = 0;
  let grossOrderValuePaise = 0;
  let capturedPaymentsPaise = 0;
  let awaitingDispatchCount = 0;

  orders.forEach((o) => {
    const orderDay = new Date(o.createdAt).toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata',
    });
    if (orderDay === todayStr) {
      todayOrdersCount += 1;
    }

    grossOrderValuePaise += o.pricing.finalAmountPaise;

    if (o.paymentStatus === 'captured') {
      capturedPaymentsPaise += o.pricing.finalAmountPaise;
    }

    if (o.orderStatus === 'confirmed' || o.orderStatus === 'preparing') {
      awaitingDispatchCount += 1;
    }
  });

  // Calculate processed refunds
  const processedRefundsPaise = refunds
    .filter((r) => r.status === 'processed')
    .reduce((sum, r) => sum + r.amountPaise, 0);

  const netCollectedSalesPaise = capturedPaymentsPaise - processedRefundsPaise;

  // Inventory warnings
  const lowStockItems = inventory.filter((i) => i.stockAvailable <= i.minThreshold);
  const nearExpiryBatches = batches.filter((b) => b.status === 'near_expiry' || b.status === 'expired');

  // Support & Shipping
  const pendingSupportCount = tickets.filter(
    (t) => t.status === 'open' || t.status === 'in_progress'
  ).length;

  const deliveryExceptions = shipments.filter(
    (s) => s.normalizedStatus === 'Delivery Exception' || s.normalizedStatus === 'Return Initiated'
  );

  return NextResponse.json({
    success: true,
    kpis: {
      todayOrdersCount,
      grossOrderValuePaise,
      capturedPaymentsPaise,
      processedRefundsPaise,
      netCollectedSalesPaise,
      awaitingDispatchCount,
      lowStockCount: lowStockItems.length,
      pendingSupportCount,
      deliveryExceptionsCount: deliveryExceptions.length,
      nearExpiryBatchesCount: nearExpiryBatches.length,
    },
    recentOrders: orders.slice(0, 8),
    lowStockWarnings: lowStockItems.slice(0, 6),
    deliveryExceptions: deliveryExceptions.slice(0, 5),
    recentAuditLogs: logs,
  });
}

