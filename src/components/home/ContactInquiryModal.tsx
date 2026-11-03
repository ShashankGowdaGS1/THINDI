'use client';

import React, { useEffect, useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, MapPin } from 'lucide-react';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

interface ContactInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactInquiryModal: React.FC<ContactInquiryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    subject: 'General Question',
    message: '',
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
    }, 2800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-inquiry-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-jaggery/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-cream rounded-2xl shadow-2xl border border-jaggery/15 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close contact dialog"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-jaggery/5 hover:bg-jaggery/10 flex items-center justify-center text-jaggery transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-leaf/10 text-leaf mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-jaggery">
              Message Received
            </h3>
            <p className="text-jaggery/80 text-sm max-w-sm mx-auto leading-relaxed">
              Thank you for writing to us. Our team in Hassan reviews inquiries during operating hours and will respond to your contact details directly.
            </p>
            <p className="text-xs text-jaggery/50 font-kannada">
              ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಸಂದೇಶ ನಮಗೆ ತಲುಪಿದೆ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-leaf uppercase mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Direct Communication
              </div>
              <h2
                id="contact-inquiry-title"
                className="font-serif text-2xl sm:text-3xl font-bold text-jaggery leading-snug"
              >
                Contact THINDI
              </h2>
              <p className="text-sm text-jaggery/70 mt-1.5">
                Have a question about recipes, delivery areas, or special batch orders? Send our Hassan team a message.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-jaggery mb-1.5">
                  Your Name <span className="text-chilli">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Kumar"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-jaggery/20 bg-warm-white text-jaggery placeholder-jaggery/40 focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-jaggery mb-1.5">
                  Email or Phone Number <span className="text-chilli">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rohini@example.com or 98450 XXXXX"
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-jaggery/20 bg-warm-white text-jaggery placeholder-jaggery/40 focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-jaggery mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-jaggery/20 bg-warm-white text-jaggery focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf text-sm transition-all"
                >
                  <option value="General Question">General Question</option>
                  <option value="Delivery & Pincode Coverage">Delivery & Pincode Coverage</option>
                  <option value="Ingredients & Allergen Info">Ingredients & Allergen Info</option>
                  <option value="Custom / Festive Gifting">Custom / Festive Gifting</option>
                  <option value="Retail & Distribution">Retail & Distribution Partnerships</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-jaggery mb-1.5">
                  Your Message <span className="text-chilli">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write your note or question here..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-jaggery/20 bg-warm-white text-jaggery placeholder-jaggery/40 focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf text-sm resize-none transition-all"
                />
              </div>
            </div>

            <div className="p-3 bg-leaf/5 border border-leaf/15 rounded-lg text-xs text-jaggery/80 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
              <span>
                <strong>Hassan Operations:</strong> Our kitchens and operations team are centered in Hassan, Karnataka. Genuine customer inquiries receive thoughtful, human replies.
              </span>
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto justify-center"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Inquiry
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
