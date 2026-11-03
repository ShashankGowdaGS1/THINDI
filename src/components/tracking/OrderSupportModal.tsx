'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/brand/Button';
import { SupportCategory } from '@/types/tracking';

interface OrderSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderReference: string;
  customerEmail: string;
}

export const OrderSupportModal: React.FC<OrderSupportModalProps> = ({
  isOpen,
  onClose,
  orderReference,
  customerEmail,
}) => {
  const [category, setCategory] = useState<SupportCategory>('delivery_issue');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    ticketReference: string;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderReference)}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subject: subject.trim(),
          message: message.trim(),
          preferredContact,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSuccessResult({
        ticketReference: data.ticketReference,
        message: data.message,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to register support enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-support-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jaggery/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-cream rounded-2xl border border-jaggery/20 p-6 sm:p-8 shadow-2xl text-left space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close support dialog"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-jaggery/5 hover:bg-jaggery/15 flex items-center justify-center text-jaggery transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {successResult ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-leaf/10 text-leaf flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-jaggery">
              Support Ticket Registered
            </h3>
            <p className="font-mono text-sm font-bold text-chilli">
              Ref: {successResult.ticketReference}
            </p>
            <p className="text-xs text-jaggery/75 max-w-sm mx-auto leading-relaxed font-sans">
              {successResult.message} A copy has been associated with order <strong>{orderReference}</strong> and forwarded to our Hassan kitchen support desk.
            </p>
            <div className="pt-2">
              <Button type="button" variant="primary" size="md" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-chilli">
                Order Care & Assistance
              </span>
              <h2 id="order-support-title" className="font-serif text-2xl font-bold text-jaggery">
                Need help with your order?
              </h2>
              <p className="text-xs text-jaggery/70 font-sans">
                Associated with: <strong className="font-mono text-jaggery">{orderReference}</strong> ({customerEmail})
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-chilli/10 border border-chilli/25 text-xs text-chilli-dark flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-chilli shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="block uppercase font-bold text-jaggery mb-1">
                  Enquiry Category <span className="text-chilli">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SupportCategory)}
                  className="w-full px-3 py-2.5 rounded border border-jaggery/20 bg-warm-white text-jaggery text-xs font-medium focus:outline-none focus:border-chilli"
                >
                  <option value="delivery_issue">Delivery delay / Courier tracking issue</option>
                  <option value="damaged_product">Damaged or broken contents reported</option>
                  <option value="missing_item">Item missing from snack box</option>
                  <option value="incorrect_item">Incorrect pack variant received</option>
                  <option value="payment_issue">Payment or invoice query</option>
                  <option value="general_order_enquiry">General order inquiry</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-bold text-jaggery mb-1">
                  Subject <span className="text-chilli">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Courier scan not updating"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-warm-white text-jaggery text-xs focus:outline-none focus:border-chilli"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-jaggery mb-1">
                  Describe what happened <span className="text-chilli">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe the issue in detail so our kitchen team can help quickly..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-warm-white text-jaggery text-xs focus:outline-none focus:border-chilli resize-none"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-jaggery mb-1">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={preferredContact === 'email'}
                      onChange={() => setPreferredContact('email')}
                      className="text-chilli focus:ring-chilli"
                    />
                    <span>Email ({customerEmail})</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={preferredContact === 'phone'}
                      onChange={() => setPreferredContact('phone')}
                      className="text-chilli focus:ring-chilli"
                    />
                    <span>Phone Call / SMS</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-turmeric/15 border border-turmeric/25 text-[11px] text-jaggery/80 leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 text-leaf inline mr-1" />
              <strong>Policy Note:</strong> Damage and return enquiries are personally assessed by our Hassan packaging staff. Order status changes require operational review.
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                {loading ? 'Submitting...' : 'Send to Hassan Care'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

