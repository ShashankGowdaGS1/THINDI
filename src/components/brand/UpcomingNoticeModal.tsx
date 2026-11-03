'use client';

import React, { useEffect } from 'react';
import { X, Sparkles, MapPin } from 'lucide-react';
import { Button } from './Button';
import { ChakkaliMotif } from './ChakkaliMotif';

interface UpcomingNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
}

export const UpcomingNoticeModal: React.FC<UpcomingNoticeModalProps> = ({
  isOpen,
  onClose,
  featureTitle = 'Online Store & Orders',
  featureDescription = 'Our Hassan kitchen is freshly crafting and batch-testing recipes for statewide dispatch across Karnataka. Online ordering, catalog browsing, and cart will go live in the upcoming rollout.',
}) => {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-jaggery/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-cream-light border border-jaggery/20 rounded-md p-6 sm:p-8 shadow-2xl text-jaggery"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-jaggery-muted hover:text-jaggery transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand emblem */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cream rounded border border-jaggery/15">
            <ChakkaliMotif size={36} color="#A43D2E" accentColor="#E8B54B" />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase font-sans font-semibold text-chilli">
              Coming Soon · ಮೊದಲ ಬ್ಯಾಚ್
            </div>
            <h3 id="modal-title" className="text-xl font-display font-bold text-jaggery">
              {featureTitle}
            </h3>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm font-sans text-jaggery-muted leading-relaxed mb-5">
          {featureDescription}
        </p>

        {/* Hassan heritage badge */}
        <div className="bg-cream p-3 rounded border border-jaggery/10 flex items-center gap-2.5 mb-6 text-xs text-jaggery">
          <MapPin className="w-4 h-4 text-leaf shrink-0" />
          <span>Crafted in Hassan, Karnataka · Statewide distribution launching soon.</span>
        </div>

        {/* Action */}
        <div className="flex justify-end gap-3">
          <Button variant="primary" size="sm" onClick={onClose}>
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
};

