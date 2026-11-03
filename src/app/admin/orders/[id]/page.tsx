'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  IndianRupee,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { OrderRecord, OrderStatus } from '@/types/checkout';
import { ShipmentRecord, SupportTicket } from '@/types/tracking';

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [shipment, setShipment] = useState<ShipmentRecord | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('confirmed');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrderDetail = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${resolvedParams.id}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setSelectedStatus(data.order.orderStatus);
        setShipment(data.shipment);
        setTickets(data.supportTickets || []);
      }
    } catch (e) {
      console.error('Failed to load order detail', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [resolvedParams.id]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    setSavingStatus(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/admin/orders/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          notes: statusNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order status');
      }

      setFeedbackMsg({ type: 'success', text: `Status updated to ${selectedStatus.toUpperCase()}` });
      setStatusNote('');
      fetchOrderDetail();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error updating order' });
    } finally {
      setSavingStatus(false);
    }
  };

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#78695C]">
        <Loader2 className="w-6 h-6 animate-spin text-[#A43D2E] mb-2" />
        <p className="text-xs">Loading order record...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center bg-[#FFFCF7] rounded-xl border border-[#E6D9C8]">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h2 className="text-base font-bold text-[#2D241E]">Order Not Found</h2>
        <p className="text-xs text-[#78695C] mt-1">Reference {resolvedParams.id} does not exist in the ledger.</p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#A43D2E] text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78695C] hover:text-[#A43D2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
        <span className="text-[11px] font-mono text-[#8C7A6B]">
          Internal ID: {order.id}
        </span>
      </div>

      {/* Header Card */}
      <div className="p-6 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#2D241E] font-mono">
              {order.orderReference}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                order.paymentStatus === 'captured'
                  ? 'bg-[#365541]/10 text-[#365541]'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              Payment: {order.paymentStatus}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                order.orderStatus === 'delivered'
                  ? 'bg-[#365541]/10 text-[#365541]'
                  : order.orderStatus === 'shipped'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-[#F2EAE0] text-[#78695C]'
              }`}
            >
              Fulfilment: {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-[#78695C] mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Placed on {new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
            {order.isDemoMode && (
              <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded ml-2">
                Demo Mode
              </span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={`/order-confirmation?orderReference=${order.orderReference}&token=${order.accessToken}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[#E6D9C8] bg-[#FAF5EC] text-[#2D241E] hover:bg-[#EFE5D5] transition-colors"
          >
            <span>Customer View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
            feedbackMsg.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-red-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Order Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Items & Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchased Items Card */}
          <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#2D241E] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#A43D2E]" />
              <span>Purchased Traditional Thindi ({order.items.length} items)</span>
            </h2>

            <div className="divide-y divide-[#E6D9C8]">
              {order.items.map((item) => (
                <div key={item.variantId} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#2D241E] text-sm">
                      {item.name}
                      {item.kannadaName && (
                        <span className="font-kannada font-normal text-xs text-[#8C7A6B] ml-2">
                          ({item.kannadaName})
                        </span>
                      )}
                    </p>
                    <p className="text-[#78695C]">
                      Weight: {item.weight} · SKU: <span className="font-mono">{item.sku}</span>
                      {item.isFragile && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded ml-2">
                          Fragile
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2D241E]">
                      {item.quantity} × {formatCurrency(item.unitPricePaise)}
                    </p>
                    <p className="font-mono font-bold text-[#A43D2E]">
                      {formatCurrency(item.lineTotalPaise)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="pt-4 border-t border-[#E6D9C8] space-y-2 text-xs">
              <div className="flex justify-between text-[#78695C]">
                <span>Items Subtotal</span>
                <span>{formatCurrency(order.pricing.itemsSubtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-[#78695C]">
                <span>Shipping ({order.pricing.shippingRuleApplied || 'Standard'})</span>
                <span>
                  {order.pricing.isShippingFree
                    ? 'FREE'
                    : formatCurrency(order.pricing.shippingChargePaise)}
                </span>
              </div>
              {order.pricing.discountAmountPaise > 0 && (
                <div className="flex justify-between text-[#365541]">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.pricing.discountAmountPaise)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E6D9C8] flex justify-between font-bold text-sm text-[#2D241E]">
                <span>Total Amount Charged</span>
                <span className="font-mono text-[#A43D2E]">
                  {formatCurrency(order.pricing.finalAmountPaise)}
                </span>
              </div>
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#2D241E] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#8C7A6B]" />
              <span>Fulfilment & Kitchen Log Notes</span>
            </h3>
            {order.notes ? (
              <div className="p-3 bg-[#FAF5EC] rounded-lg text-xs font-mono text-[#2D241E] border border-[#E6D9C8] whitespace-pre-wrap">
                {order.notes}
              </div>
            ) : (
              <p className="text-xs text-[#78695C] italic">No operational notes recorded yet.</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Customer & Fulfilment Workflow */}
        <div className="space-y-6">
          {/* Status Progression Workflow */}
          <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FAF5EC] shadow-xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#2D241E]">
              Update Fulfilment Stage
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Change Order Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing in Kitchen</option>
                  <option value="shipped">Shipped (Requires payment)</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Operational Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Fresh batch packed from morning fry; dispatched via Bluedart"
                  className="w-full p-2.5 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] placeholder-[#B5A493] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={savingStatus}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded bg-[#A43D2E] text-white hover:bg-[#8B3326] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {savingStatus ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Commit Status Change</span>
                )}
              </button>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#2D241E] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#8C7A6B]" />
              <span>Customer Information</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-[#2D241E]">{order.customer.fullName}</p>
              <p className="text-[#78695C] font-mono">{order.customer.phone}</p>
              <p className="text-[#78695C] font-mono">{order.customer.email}</p>
            </div>

            <div className="pt-3 border-t border-[#E6D9C8] space-y-1 text-xs">
              <p className="font-semibold text-[#2D241E] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#A43D2E]" />
                <span>Delivery Address:</span>
              </p>
              <p className="text-[#78695C]">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-[#78695C]">{order.shippingAddress.addressLine2}</p>
              )}
              {order.shippingAddress.landmark && (
                <p className="text-[#8C7A6B] italic">Near: {order.shippingAddress.landmark}</p>
              )}
              <p className="font-medium text-[#2D241E]">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Shipment & Tracking Details */}
          <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#2D241E] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#8C7A6B]" />
              <span>Shipment Status</span>
            </h3>

            {shipment ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#78695C]">Carrier:</span>
                  <span className="font-semibold text-[#2D241E]">{shipment.courierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78695C]">AWB Number:</span>
                  <span className="font-mono font-bold text-[#A43D2E]">{shipment.awb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78695C]">Current Status:</span>
                  <span className="font-semibold text-[#365541]">{shipment.normalizedStatus}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#78695C]">
                Not yet dispatched. Go to Shipping & Dispatch to generate an AWB.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
