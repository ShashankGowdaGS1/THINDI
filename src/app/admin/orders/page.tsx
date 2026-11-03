'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ShoppingBag, Eye, Calendar, ArrowUpDown } from 'lucide-react';
import { OrderRecord, OrderStatus, PaymentStatus } from '@/types/checkout';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === '' ||
      order.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm) ||
      order.shippingAddress.pincode.includes(searchTerm);

    const matchesStatus =
      selectedStatus === 'all' || order.orderStatus === selectedStatus;

    const matchesPayment =
      selectedPayment === 'all' || order.paymentStatus === selectedPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Orders Management
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ಗ್ರಾಹಕರ ಆರ್ಡರ್‌ಗಳು)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Manage customer orders, track fulfilment stages, and update kitchen dispatch statuses.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Search by order ref, customer, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] placeholder-[#B5A493] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Order Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#8C7A6B] font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#8C7A6B] font-medium">Payment:</span>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
            >
              <option value="all">All Payments</option>
              <option value="captured">Captured</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Reference</th>
              <th className="py-3 px-4 font-semibold">Date & Time</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Destination</th>
              <th className="py-3 px-4 font-semibold">Items</th>
              <th className="py-3 px-4 font-semibold">Amount</th>
              <th className="py-3 px-4 font-semibold">Payment</th>
              <th className="py-3 px-4 font-semibold">Fulfilment</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6D9C8]">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-[#78695C]">
                  Loading orders ledger...
                </td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#2D241E]">
                    {order.orderReference}
                  </td>
                  <td className="py-3 px-4 text-[#78695C]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8C7A6B]" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <span className="text-[10px] text-[#8C7A6B]">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#2D241E]">{order.customer.fullName}</p>
                    <p className="text-[11px] text-[#78695C] font-mono">{order.customer.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-[#78695C]">
                    <p className="font-medium text-[#2D241E]">{order.shippingAddress.city}</p>
                    <p className="text-[10px] font-mono">{order.shippingAddress.pincode}</p>
                  </td>
                  <td className="py-3 px-4 text-[#78695C]">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} pkts
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#2D241E]">
                    {formatCurrency(order.pricing.finalAmountPaise)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        order.paymentStatus === 'captured'
                          ? 'bg-[#365541]/10 text-[#365541]'
                          : order.paymentStatus === 'refunded'
                          ? 'bg-purple-50 text-purple-700'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-[#E6D9C8] bg-white text-[#A43D2E] hover:bg-[#FAF5EC] transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Manage</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#78695C]">
                  No orders match your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
