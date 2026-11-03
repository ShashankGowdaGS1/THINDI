'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Package,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/brand/Button';
import { ChakkaliMotif } from '@/components/brand/ChakkaliMotif';

export const ContactPageView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketResult, setTicketResult] = useState<{
    ticketReference: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setTicketResult({
        ticketReference: data.ticketReference,
        message: data.message,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-warm-white border border-jaggery/15 flex items-center justify-center mx-auto text-jaggery shadow-sm mb-3">
            <ChakkaliMotif size={36} color="#2D241E" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-chilli font-sans block">
            HASSAN KITCHEN CARE
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-jaggery">
            Let&apos;s talk Thindi.
          </h1>

          <p className="font-kannada text-xl text-jaggery/60 font-medium">
            ಮಾತನಾಡೋಣ ಬನ್ನಿ.
          </p>

          <p className="font-sans text-sm sm:text-base text-jaggery/75 leading-relaxed">
            Questions about your order or our products? Get in touch with our team in Hassan.
          </p>
        </div>

        {/* 2-Column Grid: Form Left, Origin & Direct Care Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-warm-white border border-jaggery/15 shadow-sm space-y-5">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-jaggery pb-2 border-b border-jaggery/10">
              Send us a message
            </h2>

            {error && (
              <div className="p-3.5 rounded-lg bg-chilli/10 border border-chilli/25 text-xs text-chilli-dark flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-chilli shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {ticketResult ? (
              <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-leaf/10 text-leaf flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-jaggery">
                  Message Received
                </h3>
                <p className="font-mono text-sm font-bold text-chilli">
                  Ticket Ref: {ticketResult.ticketReference}
                </p>
                <p className="text-xs text-jaggery/75 max-w-sm mx-auto leading-relaxed font-sans">
                  {ticketResult.message} Our Hassan kitchen customer support desk will follow up directly at {formData.email}.
                </p>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setTicketResult(null);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase font-bold text-jaggery mb-1">
                      Full Name <span className="text-chilli">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Hegde"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-jaggery mb-1">
                      Email Address <span className="text-chilli">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase font-bold text-jaggery mb-1">
                      Mobile Number (Optional)
                    </label>
                    <div className="flex">
                      <span className="px-3 py-2.5 bg-jaggery/5 border border-r-0 border-jaggery/20 rounded-l text-xs font-mono text-jaggery flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98450 XXXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
                        }
                        className="w-full px-3.5 py-2.5 rounded-r border border-jaggery/20 bg-cream text-jaggery text-sm font-mono focus:outline-none focus:border-chilli"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-jaggery mb-1">
                      Subject <span className="text-chilli">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Festive bulk enquiry / Ingredient question"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase font-bold text-jaggery mb-1">
                    Your Message <span className="text-chilli">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what you need help with..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-jaggery/55">
                    Hassan Kitchen Support Response: 10:00 AM – 6:00 PM IST
                  </span>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    icon={<Send className="w-4 h-4" />}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Origin & Quick Shortcuts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hassan Kitchen Origin Snapshot */}
            <div className="p-6 sm:p-7 rounded-2xl bg-warm-white border border-jaggery/15 space-y-4 text-xs font-sans">
              <h3 className="font-serif text-lg font-bold text-jaggery pb-2 border-b border-jaggery/10 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-chilli" />
                Rooted in Hassan, Karnataka
              </h3>

              <div className="space-y-2 text-jaggery/80 leading-relaxed">
                <p className="font-bold text-jaggery text-sm">
                  THINDI Artisan Food Kitchen
                </p>
                <p>Industrial Area, B. Katihalli</p>
                <p>Hassan, Karnataka — 573201</p>
                <p className="text-jaggery/60 pt-1 font-mono">
                  State of Origin: Karnataka, India
                </p>
              </div>

              <div className="pt-2 border-t border-jaggery/10 space-y-2">
                <div className="flex items-center gap-2 text-jaggery/70">
                  <Clock className="w-4 h-4 text-leaf" />
                  <span>Mon – Sat: 10:00 AM – 6:00 PM IST</span>
                </div>
                <div className="flex items-center gap-2 text-leaf font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Artisan Small-Batch Kitchen Facility</span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="p-6 rounded-2xl bg-cream border border-jaggery/15 space-y-3">
              <h4 className="font-serif text-base font-bold text-jaggery">
                Looking for something specific?
              </h4>

              <div className="space-y-2 text-xs font-sans">
                <Link
                  href="/track-order"
                  className="flex items-center justify-between p-3 rounded-lg bg-warm-white border border-jaggery/10 text-jaggery hover:border-chilli transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Package className="w-4 h-4 text-chilli" />
                    Where is my order? Track shipment
                  </span>
                  <span className="font-bold text-chilli">→</span>
                </Link>

                <Link
                  href="/#faqs"
                  className="flex items-center justify-between p-3 rounded-lg bg-warm-white border border-jaggery/10 text-jaggery hover:border-chilli transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <HelpCircle className="w-4 h-4 text-leaf" />
                    Frequently Asked Questions
                  </span>
                  <span className="font-bold text-chilli">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

