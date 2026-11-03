'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  PackageCheck,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Send,
} from 'lucide-react';
import { OrderRecord } from '@/types/checkout';
import { ShipmentRecord } from '@/types/tracking';

const COURIER_OPTIONS = [
  'Bluedart Express',
  'Delhivery Surface',
  'DTDC Express',
  'India Post Speed Post',
  'Shadowfax Karnataka',
];

export default function AdminShippingPage() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [readyOrders, setReadyOrders] = useState<OrderRecord[]>([]);
  const [providerConfig, setProviderConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [courierName, setCourierName] = useState('Bluedart Express');
  const [customAwb, setCustomAwb] = useState('');
  const [dispatching, setDispatching] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchShippingData = async () => {
    try {
      const res = await fetch('/api/admin/shipping', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setShipments(data.shipments || []);
        setReadyOrders(data.readyForDispatch || []);
        setProviderConfig(data.providerConfig);
      }
    } catch (e) {
      console.error('Failed to load shipping data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  const handleOpenDispatch = (order: OrderRecord) => {
    setSelectedOrder(order);
    setCourierName('Bluedart Express');
    setCustomAwb('');
    setFeedback(null);
    setDispatchModalOpen(true);
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setDispatching(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/shipping/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: selectedOrder.orderReference,
          courierName,
          awb: customAwb.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch shipment');
      }

      setFeedback({
        type: 'success',
        text: `Order ${selectedOrder.orderReference} dispatched with AWB ${data.shipment.awb} via ${courierName}.`,
      });
      setDispatchModalOpen(false);
      fetchShippingData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error creating dispatch' });
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Shipping & Dispatch Operations
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ರವಾನೆ ವಿಭಾಗ)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Manifest packages from Hassan kitchen dispatch hub and generate tracking AWBs across Karnataka.
          </p>
        </div>

        {/* Courier Adapter Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E6D9C8] bg-[#FFFCF7] text-xs">
          <Truck className="w-4 h-4 text-[#A43D2E]" />
          <div>
            <p className="font-semibold text-[#2D241E]">
              {providerConfig?.provider || 'Shiprocket'} Adapter
            </p>
            <p className="text-[10px] text-[#78695C]">
              Origin: {providerConfig?.pickupLocation || 'Hassan Kitchen Hub (573201)'}
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Dispatch Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-[#2D241E] flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#A43D2E]" />
            <span>Ready for Packaging & Dispatch Queue ({readyOrders.length})</span>
          </h2>
          <span className="text-[11px] text-[#78695C]">Paid orders awaiting courier handover</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Order Ref</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Destination Pincode</th>
                <th className="py-3 px-4 font-semibold">Total Items</th>
                <th className="py-3 px-4 font-semibold">Fulfilment Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D9C8]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#78695C]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
                    <span>Loading queue...</span>
                  </td>
                </tr>
              ) : readyOrders.length > 0 ? (
                readyOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#2D241E]">
                      {ord.orderReference}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#2D241E]">{ord.customer.fullName}</p>
                      <p className="text-[11px] text-[#78695C] font-mono">{ord.customer.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#2D241E]">{ord.shippingAddress.city}</p>
                      <p className="text-[11px] text-[#78695C] font-mono">PIN: {ord.shippingAddress.pincode}</p>
                    </td>
                    <td className="py-3 px-4 text-[#78695C]">
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} packets
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize bg-amber-50 text-amber-700">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenDispatch(ord)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#A43D2E] text-white hover:bg-[#8B3326] transition-colors shadow-xs cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Dispatch / Assign AWB</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#78695C]">
                    No pending orders in dispatch queue. All paid orders have been handed over.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatched Shipments Queue */}
      <div className="space-y-3 pt-4">
        <h2 className="font-serif text-base font-bold text-[#2D241E] flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#365541]" />
          <span>Active & Historical Consignments ({shipments.length})</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">AWB Number</th>
                <th className="py-3 px-4 font-semibold">Order Ref</th>
                <th className="py-3 px-4 font-semibold">Carrier</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Dispatched At</th>
                <th className="py-3 px-4 font-semibold">Tracking Status</th>
                <th className="py-3 px-4 font-semibold text-right">Public Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D9C8]">
              {shipments.length > 0 ? (
                shipments.map((ship) => (
                  <tr key={ship.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#A43D2E]">
                      {ship.awb}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#2D241E]">
                      <Link
                        href={`/admin/orders/${ship.orderReference}`}
                        className="hover:underline font-semibold"
                      >
                        {ship.orderReference}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#2D241E] font-medium">
                      {ship.courierName}
                    </td>
                    <td className="py-3 px-4 text-[#78695C]">
                      <p className="font-medium text-[#2D241E]">{ship.destination}</p>
                      <p className="text-[10px] font-mono">{ship.destinationPincode}</p>
                    </td>
                    <td className="py-3 px-4 text-[#78695C] font-mono">
                      {new Date(ship.shippedAt || Date.now()).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ship.normalizedStatus === 'Delivered'
                            ? 'bg-[#365541]/10 text-[#365541]'
                            : ship.normalizedStatus === 'Out for Delivery'
                            ? 'bg-blue-100 text-blue-800'
                            : ship.normalizedStatus === 'Delivery Exception'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ship.normalizedStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/track-order?reference=${ship.orderReference}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A43D2E] hover:underline"
                      >
                        <span>Live View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#78695C]">
                    No shipments dispatched yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#2D241E]">
                Manifest Dispatch for {selectedOrder.orderReference}
              </h3>
              <button
                onClick={() => setDispatchModalOpen(false)}
                className="p-1 text-[#8C7A6B] hover:text-[#2D241E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF5EC] rounded-lg border border-[#E6D9C8] space-y-1">
                <p className="font-semibold text-[#2D241E]">Customer: {selectedOrder.customer.fullName}</p>
                <p className="text-[#78695C]">
                  Destination: {selectedOrder.shippingAddress.city}, PIN {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-[11px] text-[#8C7A6B]">
                  Origin: Hassan Central Kitchen Hub (573201)
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Assign Courier Partner *
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Custom AWB Tracking Code (Leave empty to auto-generate)
                </label>
                <input
                  type="text"
                  value={customAwb}
                  onChange={(e) => setCustomAwb(e.target.value.toUpperCase())}
                  placeholder="e.g. BLU-82749102"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6D9C8]">
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(false)}
                  className="px-3 py-1.5 border border-[#E6D9C8] rounded bg-white text-[#2D241E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="px-4 py-1.5 rounded bg-[#A43D2E] text-white font-semibold disabled:opacity-50"
                >
                  {dispatching ? 'Handing Over...' : 'Confirm Dispatch & AWB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
