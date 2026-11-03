'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { ThindiWordmark } from '../brand/ThindiWordmark';
import { Button } from '../brand/Button';
import { SearchModal } from './SearchModal';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const { totalCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global shortcut to open search with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur-md border-b border-jaggery/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Left: THINDI Wordmark with Kannada identity */}
            <div className="flex-shrink-0 flex items-center">
              <ThindiWordmark size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center space-x-7 lg:space-x-9"
              aria-label="Main Navigation"
            >
              <Link
                href="/"
                className="text-sm lg:text-base font-sans font-medium text-jaggery hover:text-chilli transition-colors relative py-1 focus:outline-none focus-visible:text-chilli"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="text-sm lg:text-base font-sans font-medium text-jaggery/80 hover:text-chilli transition-colors py-1 focus:outline-none focus-visible:text-chilli"
              >
                Shop
              </Link>

              <Link
                href="/combos"
                className="text-sm lg:text-base font-sans font-medium text-jaggery/80 hover:text-chilli transition-colors py-1 focus:outline-none focus-visible:text-chilli"
              >
                THINDI Boxes
              </Link>

              <Link
                href="/our-story"
                className="text-sm lg:text-base font-sans font-medium text-jaggery/80 hover:text-chilli transition-colors py-1 focus:outline-none focus-visible:text-chilli"
              >
                Our Story
              </Link>

              <Link
                href="/track-order"
                className="text-sm lg:text-base font-sans font-medium text-jaggery/80 hover:text-chilli transition-colors py-1 focus:outline-none focus-visible:text-chilli"
              >
                Track Order
              </Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:p-2.5 text-jaggery/75 hover:text-chilli hover:bg-cream-dark/50 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli cursor-pointer"
                aria-label="Search snacks (Cmd+K)"
                title="Search snacks (Cmd+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Icon with live badge count & drawer trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 sm:p-2.5 text-jaggery/75 hover:text-chilli hover:bg-cream-dark/50 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli cursor-pointer"
                aria-label={`View shopping basket (${totalCount} ${totalCount === 1 ? 'item' : 'items'})`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 bg-chilli text-cream text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none transition-transform">
                  {totalCount}
                </span>
              </button>

              {/* Shop Now Primary CTA button for desktop */}
              <div className="hidden lg:block pl-2">
                <Button
                  variant="primary"
                  size="sm"
                  href="/shop"
                >
                  Shop Now
                </Button>
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-jaggery hover:text-chilli focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded-sm"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-jaggery/10 bg-cream-light px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-sans font-semibold text-jaggery py-2 border-b border-jaggery/5"
              >
                <span>Home</span>
                <span className="text-xs text-chilli font-kannada">ಮುಖಪುಟ</span>
              </Link>

              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-sans font-medium text-jaggery/80 hover:text-chilli py-2 border-b border-jaggery/5 text-left"
              >
                <span>Shop All Thindi</span>
                <span className="text-xs text-chilli font-kannada font-semibold">ತಿಂಡಿಗಳು</span>
              </Link>

              <Link
                href="/combos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-sans font-medium text-jaggery/80 hover:text-chilli py-2 border-b border-jaggery/5 text-left"
              >
                <span>THINDI Boxes</span>
                <span className="text-xs text-chilli font-kannada font-semibold">ವಿಶೇಷ ಬಾಕ್ಸ್‌ಗಳು</span>
              </Link>

              <Link
                href="/our-story"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-sans font-medium text-jaggery/80 hover:text-chilli py-2 border-b border-jaggery/5 text-left"
              >
                <span>Our Story</span>
                <span className="text-xs text-jaggery-muted font-kannada">ನಮ್ಮ ಕಥೆ</span>
              </Link>

              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-sans font-medium text-jaggery/80 hover:text-chilli py-2 border-b border-jaggery/5 text-left"
              >
                <span>Track Order</span>
                <span className="text-xs text-chilli font-kannada font-semibold">ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್</span>
              </Link>

              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-sans font-medium text-jaggery/80 hover:text-chilli py-2 border-b border-jaggery/5 text-left"
              >
                <span>Customer FAQs</span>
                <span className="text-xs text-jaggery-muted font-kannada">ಪ್ರಶ್ನೋತ್ತರ</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex items-center justify-between text-base font-sans font-medium text-jaggery/80 hover:text-chilli py-2 border-b border-jaggery/5 text-left w-full cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-chilli" />
                  <span>Search Pantry</span>
                </span>
                <span className="text-xs text-jaggery-muted font-kannada">ಹುಡುಕಿ</span>
              </button>
            </nav>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-between"
                icon={<ArrowRight className="w-4 h-4" />}
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore All Thindi
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Accessible Working Search Dialog */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};
