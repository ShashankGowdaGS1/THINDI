import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ChakkaliMotif } from '@/components/brand/ChakkaliMotif';
import { ArrowLeft, ShoppingBag, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col selection:bg-chilli/15">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center space-y-6">
          {/* Visual Motif */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-turmeric/20 rounded-full blur-xl pointer-events-none" />
            <div className="relative text-chilli opacity-80">
              <ChakkaliMotif className="w-24 h-24 animate-spin-slow" />
            </div>
            <span className="absolute font-mono font-black text-2xl text-jaggery">
              404
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="font-kannada text-lg font-bold text-chilli">
              ಈ ತಿಂಡಿ ಸಿಗಲಿಲ್ಲ ಅನಿಸುತ್ತೆ!
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-jaggery tracking-tight">
              Looks like this thindi went missing.
            </h1>
          </div>

          {/* Supporting Copy */}
          <p className="font-sans text-base sm:text-lg text-jaggery/75 max-w-md mx-auto leading-relaxed">
            Let's get you back to something delicious. The page you are looking for might have been moved or doesn't exist.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-chilli text-cream text-xs font-bold hover:bg-[#8B3326] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-jaggery/20 bg-cream-dark text-jaggery text-xs font-semibold hover:bg-[#EFE5D5] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-chilli" />
              <span>Explore Shop</span>
            </Link>
          </div>

          {/* Quick Category Suggestions */}
          <div className="pt-8 border-t border-jaggery/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-jaggery/50 mb-3 font-sans">
              Popular Collections
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <Link
                href="/collections/kuruk-thindi"
                className="px-3 py-1 rounded bg-[#FAF5EC] border border-jaggery/10 text-jaggery hover:text-chilli"
              >
                Kuruk Thindi (Crisp Savouries)
              </Link>
              <Link
                href="/collections/sihi-thindi"
                className="px-3 py-1 rounded bg-[#FAF5EC] border border-jaggery/10 text-jaggery hover:text-chilli"
              >
                Sihi Thindi (Sweets)
              </Link>
              <Link
                href="/combos"
                className="px-3 py-1 rounded bg-[#FAF5EC] border border-jaggery/10 text-jaggery hover:text-chilli"
              >
                THINDI Boxes
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

