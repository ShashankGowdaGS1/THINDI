'use client';

import React, { useEffect, useState } from 'react';
import { X, Gift, Check, Send, MapPin } from 'lucide-react';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

interface BulkEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkEnquiryModal: React.FC<BulkEnquiryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    occasion: 'Festival / Family Gathering',
    estimatedBoxes: '15-25 boxes',
    note: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-enquiry-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-jaggery/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-cream-light border border-jaggery/20 rounded-md p-6 sm:p-8 shadow-2xl text-jaggery"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-jaggery-muted hover:text-jaggery transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli"
          aria-label="Close bulk enquiry dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-cream rounded border border-jaggery/15 text-chilli">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-sans tracking-[0.2em] font-bold text-chilli">
              FESTIVE & CELEBRATION GIFTING
            </span>
            <h3
              id="bulk-enquiry-title"
              className="font-display font-bold text-xl sm:text-2xl text-jaggery leading-tight"
            >
              Bulk & Celebration Enquiry
            </h3>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-leaf/15 text-leaf rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-xl text-jaggery">
              ಧನ್ಯವಾದಗಳು · Thank you!
            </h4>
            <p className="font-sans text-xs sm:text-sm text-jaggery-muted max-w-xs mx-auto">
              We have received your celebration enquiry. The THINDI team from Hassan will reach out with batch options and dispatch schedules.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="font-sans text-xs sm:text-sm text-jaggery-muted leading-relaxed">
              Planning snacks for a wedding, family gathering, or festival? Share a few details and we will coordinate small-batch kitchen scheduling from Hassan.
            </p>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-jaggery-muted mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Hegde"
                className="w-full px-3.5 py-2.5 rounded bg-cream border border-jaggery/20 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-chilli text-jaggery"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-jaggery-muted mb-1">
                  Phone or Email *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phoneOrEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneOrEmail: e.target.value })
                  }
                  placeholder="+91 98xxx xxxxx"
                  className="w-full px-3.5 py-2.5 rounded bg-cream border border-jaggery/20 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-chilli text-jaggery"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-jaggery-muted mb-1">
                  Estimated Quantity
                </label>
                <select
                  value={formData.estimatedBoxes}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedBoxes: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded bg-cream border border-jaggery/20 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-chilli text-jaggery"
                >
                  <option>10-25 boxes</option>
                  <option>25-50 boxes</option>
                  <option>50-100 boxes</option>
                  <option>100+ boxes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-jaggery-muted mb-1">
                Occasion / Preferred Date
              </label>
              <input
                type="text"
                value={formData.occasion}
                onChange={(e) =>
                  setFormData({ ...formData, occasion: e.target.value })
                }
                placeholder="e.g. Deepavali / Family Wedding"
                className="w-full px-3.5 py-2.5 rounded bg-cream border border-jaggery/20 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-chilli text-jaggery"
              />
            </div>

            <div className="p-3 bg-cream rounded border border-jaggery/10 flex items-center gap-2 text-xs text-jaggery-muted">
              <MapPin className="w-3.5 h-3.5 text-leaf shrink-0" />
              <span>Prepared fresh in Hassan · Statewide dispatch coordination</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Send Enquiry
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

