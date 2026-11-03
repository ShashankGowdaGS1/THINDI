'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  AlertTriangle,
  RotateCcw,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { ShipmentRecord, ShipmentEvent, NormalizedTrackingStatus } from '@/types/tracking';

interface ShipmentTimelineProps {
  shipment: ShipmentRecord | null;
  orderStatus: string;
  isDemoMode?: boolean;
}

// Format UTC date to IST Asia/Kolkata
function formatIndianDateTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({
  shipment,
  orderStatus,
  isDemoMode,
}) => {
  if (!shipment) {
    return (
      <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-turmeric/15 text-jaggery flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-bold text-jaggery">
          Awaiting Courier Dispatch
        </h3>
        <p className="text-xs text-jaggery/70 max-w-sm mx-auto leading-relaxed">
          Your authentic batch is being prepared and packed at our Hassan kitchen. Courier tracking details and live AWB scans will appear here once dispatched.
        </p>
      </div>
    );
  }

  const { normalizedStatus, courierName, awb, events = [], estimatedDelivery } = shipment;

  // Milestone ranking: 1 (Created) -> 2 (Picked Up) -> 3 (In Transit) -> 4 (Out for Delivery) -> 5 (Delivered)
  const isCreated = true;
  const isPickedUp = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].includes(normalizedStatus);
  const isInTransit = ['In Transit', 'Out for Delivery', 'Delivered'].includes(normalizedStatus);
  const isOutForDelivery = ['Out for Delivery', 'Delivered'].includes(normalizedStatus);
  const isDelivered = normalizedStatus === 'Delivered';

  const isException = [
    'Delivery Exception',
    'Return Initiated',
    'Returned',
    'Cancelled',
    'Pending Review',
  ].includes(normalizedStatus);

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-warm-white border border-jaggery/15 space-y-6">
      {/* Header with Courier Info & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-jaggery/10">
        <div>
          <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-jaggery/60 block">
            Shipment Journey
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-jaggery">
              {courierName || 'Courier Partner'}
            </h3>
            {awb && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-cream border border-jaggery/15 text-jaggery font-semibold">
                AWB: {awb}
              </span>
            )}
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {isException ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-chilli/10 text-chilli border border-chilli/25">
              <AlertTriangle className="w-3.5 h-3.5" />
              {normalizedStatus}
            </span>
          ) : isDelivered ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-leaf/10 text-leaf border border-leaf/25">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Delivered
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-turmeric/20 text-jaggery border border-turmeric/40">
              <Truck className="w-3.5 h-3.5 text-chilli" />
              {normalizedStatus}
            </span>
          )}
        </div>
      </div>

      {estimatedDelivery && !isDelivered && !isException && (
        <div className="p-3 rounded-lg bg-cream border border-jaggery/10 flex items-center justify-between text-xs font-sans">
          <span className="text-jaggery/70">Estimated Arrival:</span>
          <span className="font-bold text-jaggery font-mono">{estimatedDelivery}</span>
        </div>
      )}

      {/* Demo Notice */}
      {isDemoMode && (
        <div className="p-2.5 rounded-lg bg-turmeric/15 border border-turmeric/30 text-[11px] text-jaggery text-center font-medium">
          Demo tracking — sample shipment information for Hassan dispatch simulation.
        </div>
      )}

      {/* Exception Banner if Active */}
      {isException && (
        <div className="p-4 rounded-xl bg-chilli/10 border border-chilli/30 text-xs text-chilli-dark space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-chilli">
            <AlertTriangle className="w-4 h-4" />
            Status Notice: {normalizedStatus}
          </div>
          <p className="text-jaggery/80 leading-relaxed">
            {normalizedStatus === 'Delivery Exception' &&
              'The courier partner reported an unexpected delivery interruption (e.g. premises closed, weather delay, or address clarification required). Re-attempt will be scheduled.'}
            {normalizedStatus === 'Return Initiated' &&
              'Return to origin has been initiated for this package back to Hassan processing facility.'}
            {normalizedStatus === 'Cancelled' &&
              'This package was cancelled before delivery dispatch.'}
            {normalizedStatus === 'Pending Review' &&
              'An unusual courier status code was received and is currently being investigated with dispatch operations.'}
          </p>
        </div>
      )}

      {/* Standard 5-Step Visual Progress Bar */}
      <div className="relative pt-2">
        <div className="grid grid-cols-5 text-center gap-1 text-[11px] font-sans">
          {/* Step 1: Created */}
          <div className="space-y-1.5">
            <div
              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isCreated ? 'bg-leaf text-cream shadow-sm' : 'bg-jaggery/10 text-jaggery/50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
            </div>
            <span className={`block font-medium ${isCreated ? 'text-jaggery' : 'text-jaggery/40'}`}>
              Packed
            </span>
          </div>

          {/* Step 2: Picked Up */}
          <div className="space-y-1.5">
            <div
              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isPickedUp ? 'bg-leaf text-cream shadow-sm' : 'bg-jaggery/10 text-jaggery/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className={`block font-medium ${isPickedUp ? 'text-jaggery' : 'text-jaggery/40'}`}>
              Picked Up
            </span>
          </div>

          {/* Step 3: In Transit */}
          <div className="space-y-1.5">
            <div
              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isInTransit ? 'bg-leaf text-cream shadow-sm' : 'bg-jaggery/10 text-jaggery/50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
            </div>
            <span className={`block font-medium ${isInTransit ? 'text-jaggery' : 'text-jaggery/40'}`}>
              In Transit
            </span>
          </div>

          {/* Step 4: Out for Delivery */}
          <div className="space-y-1.5">
            <div
              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isOutForDelivery ? 'bg-leaf text-cream shadow-sm' : 'bg-jaggery/10 text-jaggery/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className={`block font-medium ${isOutForDelivery ? 'text-jaggery' : 'text-jaggery/40'}`}>
              Out for Delivery
            </span>
          </div>

          {/* Step 5: Delivered */}
          <div className="space-y-1.5">
            <div
              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isDelivered ? 'bg-leaf text-cream shadow-sm' : 'bg-jaggery/10 text-jaggery/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className={`block font-medium ${isDelivered ? 'text-leaf font-bold' : 'text-jaggery/40'}`}>
              Delivered
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Activity Scans & Checkpoints Timeline */}
      <div className="pt-4 border-t border-jaggery/10 space-y-3">
        <h4 className="font-serif text-sm font-bold text-jaggery flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-jaggery/60" />
          Detailed Activity History
        </h4>

        {events.length === 0 ? (
          <p className="text-xs text-jaggery/60 italic">
            No external courier checkpoints registered yet. Scans update as parcel moves through transit hubs.
          </p>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-jaggery/15">
            {[...events].reverse().map((evt, idx) => (
              <div key={evt.id || idx} className="relative group">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cream border-2 border-chilli group-first:border-leaf group-first:bg-leaf" />
                <div className="space-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                    <span className="font-bold text-jaggery">
                      {evt.normalizedStatus}
                    </span>
                    <span className="font-mono text-[11px] text-jaggery/55">
                      {formatIndianDateTime(evt.eventTime)}
                    </span>
                  </div>
                  <p className="text-xs text-jaggery/80 leading-relaxed">
                    {evt.eventDescription}
                  </p>
                  {evt.eventLocation && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-jaggery/60 font-sans">
                      <MapPin className="w-3 h-3 text-leaf" />
                      {evt.eventLocation}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

