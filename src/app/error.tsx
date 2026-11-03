'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#FFFCF7] border border-jaggery/15 shadow-sm text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-serif text-2xl font-bold text-jaggery">
              Something went unexpected
            </h1>
            <p className="font-sans text-xs sm:text-sm text-jaggery/70 leading-relaxed">
              We encountered a temporary issue while loading this page. Please try refreshing or return home.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-chilli text-cream text-xs font-bold hover:bg-[#8B3326] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-jaggery/20 bg-cream text-jaggery text-xs font-semibold hover:bg-[#EFE5D5] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

