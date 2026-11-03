'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  IndianRupee,
  Truck,
  AlertTriangle,
  HelpCircle,
  PackageX,
  ArrowUpRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { OrderRecord } from '@/types/checkout';
import { InventoryItemRecord, AuditLogEntry } from '@/types/admin';

interface OverviewData {
  kpis: {
    todayOrdersCount: number;
    grossOrderValuePaise: number;
    capturedPaymentsPaise: number;
    processedRefundsPaise: number;
    netCollectedSalesPaise: number;
    awaitingDispatchCount: number;
    lowStockCount: number;
    pendingSupportCount: number;
    deliveryExceptionsCount: number;
    nearExpiryBatchesCount: number;
  };
  recentOrders: OrderRecord[];
  lowStockWarnings: InventoryItemRecord[];
  deliveryExceptions: any[];
  recentAuditLogs: AuditLogEntry[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load overview data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const formatCurrency = (paise: number) => {
    return `₹${(paise / 100).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#E6D9C8]/40 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#FFFCF7] rounded-xl border border-[#E6D9C8]" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    todayOrdersCount: 0,
    grossOrderValuePaise: 0,
    capturedPaymentsPaise: 0,
    processedRefundsPaise: 0,
    netCollectedSalesPaise: 0,
    awaitingDispatchCount: 0,
    lowStockCount: 0,
    pendingSupportCount: 0,
    deliveryExceptionsCount: 0,
    nearExpiryBatchesCount: 0,
  };

  return (
    <div className="space-y-8">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Operations Command Center
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ಕಾರ್ಯಾಚರಣೆ ಕೇಂದ್ರ)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Real-time Hassan kitchen inventory, dispatch queue, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOverview(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#E6D9C8] bg-[#FFFCF7] text-[#2D241E] hover:bg-[#F2EAE0] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#A43D2E] text-white hover:bg-[#8B3326] transition-colors cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Orders */}
        <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
              Today's Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF5EC] text-[#A43D2E] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-[#2D241E] font-sans">
              {kpis.todayOrdersCount}
            </span>
            <p className="text-[11px] text-[#78695C] mt-0.5">
              Live orders received today
            </p>
          </div>
        </div>

        {/* Net Collected Sales */}
        <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
              Net Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#365541]/10 text-[#365541] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-[#2D241E] font-sans">
              {formatCurrency(kpis.netCollectedSalesPaise)}
            </span>
            <p className="text-[11px] text-[#78695C] mt-0.5">
              Gross: {formatCurrency(kpis.grossOrderValuePaise)} (Refunds: {formatCurrency(kpis.processedRefundsPaise)})
            </p>
          </div>
        </div>

        {/* Awaiting Dispatch */}
        <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
              Dispatch Queue
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#B45309]/10 text-[#B45309] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-[#2D241E] font-sans">
              {kpis.awaitingDispatchCount}
            </span>
            <p className="text-[11px] text-[#78695C] mt-0.5">
              Orders confirmed or preparing in kitchen
            </p>
          </div>
        </div>

        {/* Low Stock & Expiry Alert */}
        <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
              Stock Warnings
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              kpis.lowStockCount > 0 || kpis.nearExpiryBatchesCount > 0
                ? 'bg-red-50 text-red-600'
                : 'bg-green-50 text-green-700'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-[#2D241E] font-sans">
              {kpis.lowStockCount + kpis.nearExpiryBatchesCount}
            </span>
            <p className="text-[11px] text-[#78695C] mt-0.5">
              {kpis.lowStockCount} low stock · {kpis.nearExpiryBatchesCount} near expiry
            </p>
          </div>
        </div>
      </div>

      {/* Operational Highlights & Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#2D241E]">
              Recent Customer Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#A43D2E] hover:underline"
            >
              See all ({data?.recentOrders.length || 0}) →
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Order Ref</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D9C8]">
                {data?.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.slice(0, 6).map((order) => (
                    <tr key={order.id} className="hover:bg-[#F2EAE0]/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#2D241E]">
                        {order.orderReference}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#2D241E]">{order.customer.fullName}</p>
                        <p className="text-[11px] text-[#78695C]">
                          {order.shippingAddress.city}, {order.shippingAddress.pincode}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-[#78695C]">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#2D241E]">
                        {formatCurrency(order.pricing.finalAmountPaise)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            order.orderStatus === 'delivered'
                              ? 'bg-[#365541]/10 text-[#365541]'
                              : order.orderStatus === 'shipped'
                              ? 'bg-blue-50 text-blue-700'
                              : order.orderStatus === 'preparing'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-[#F2EAE0] text-[#78695C]'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-semibold text-[#A43D2E] hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#78695C]">
                      No orders recorded yet. Place an order on the storefront to test.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Urgent Attention Alerts */}
        <div className="space-y-6">
          {/* Low Stock Alerts Card */}
          <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-[#2D241E] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#B45309]" />
                <span>Low Inventory Watchlist</span>
              </h3>
              <Link
                href="/admin/inventory"
                className="text-[11px] font-semibold text-[#A43D2E] hover:underline"
              >
                Ledger →
              </Link>
            </div>

            {data?.lowStockWarnings && data.lowStockWarnings.length > 0 ? (
              <div className="space-y-2.5">
                {data.lowStockWarnings.map((item) => (
                  <div
                    key={item.variantSku}
                    className="p-2.5 rounded-lg border border-[#E6D9C8] bg-[#FAF5EC]/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#2D241E]">{item.productName}</p>
                      <p className="text-[11px] text-[#78695C]">
                        {item.variantWeight} · SKU: {item.variantSku}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-600 font-mono">
                        {item.stockAvailable} left
                      </span>
                      <p className="text-[10px] text-[#8C7A6B]">Min: {item.minThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#365541] flex items-center gap-1.5 py-2">
                <CheckCircle2 className="w-4 h-4 text-[#365541]" />
                <span>All variants currently above safe stock thresholds.</span>
              </p>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FAF5EC] shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#2D241E]">
              Operational Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/admin/shipping"
                className="p-2.5 rounded-lg border border-[#E6D9C8] bg-[#FFFCF7] text-[#2D241E] hover:border-[#A43D2E] transition-colors font-medium flex flex-col justify-between"
              >
                <span>Dispatch Shipments</span>
                <span className="text-[10px] text-[#78695C] mt-1">Generate AWBs</span>
              </Link>
              <Link
                href="/admin/inventory/batches"
                className="p-2.5 rounded-lg border border-[#E6D9C8] bg-[#FFFCF7] text-[#2D241E] hover:border-[#A43D2E] transition-colors font-medium flex flex-col justify-between"
              >
                <span>Receive Batch</span>
                <span className="text-[10px] text-[#78695C] mt-1">Kitchen production</span>
              </Link>
              <Link
                href="/admin/payments"
                className="p-2.5 rounded-lg border border-[#E6D9C8] bg-[#FFFCF7] text-[#2D241E] hover:border-[#A43D2E] transition-colors font-medium flex flex-col justify-between"
              >
                <span>Reconciliation</span>
                <span className="text-[10px] text-[#78695C] mt-1">Razorpay & refunds</span>
              </Link>
              <Link
                href="/admin/support"
                className="p-2.5 rounded-lg border border-[#E6D9C8] bg-[#FFFCF7] text-[#2D241E] hover:border-[#A43D2E] transition-colors font-medium flex flex-col justify-between"
              >
                <span>Support Tickets</span>
                <span className="text-[10px] text-[#78695C] mt-1">{kpis.pendingSupportCount} pending</span>
              </Link>
            </div>
          </div>

          {/* Recent Audit Trail Preview */}
          <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-[#2D241E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#365541]" />
                <span>Audit Trail Activity</span>
              </h3>
              <Link
                href="/admin/audit-log"
                className="text-[11px] font-semibold text-[#A43D2E] hover:underline"
              >
                All logs →
              </Link>
            </div>
            <div className="space-y-2">
              {data?.recentAuditLogs && data.recentAuditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="text-[11px] pb-2 border-b border-[#E6D9C8] last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[#8C7A6B]">
                    <span className="font-semibold text-[#2D241E]">{log.action}</span>
                    <span className="text-[10px] font-mono">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[#78695C] truncate mt-0.5">{log.details}</p>
                  <p className="text-[10px] text-[#8C7A6B] font-mono mt-0.5">by {log.actorEmail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
