'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ExternalLink, Shield, Bell } from 'lucide-react';
import { StaffUser } from '@/types/admin';

interface AdminHeaderProps {
  currentUser: StaffUser | null;
  onToggleMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentUser,
  onToggleMobileMenu,
}) => {
  const pathname = usePathname();

  // Generate readable breadcrumb from pathname
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean);
  const pageTitle = segments.length === 0 
    ? 'Dashboard Overview' 
    : segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace('-', ' ');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-[#E6D9C8] bg-[#FFFCF7]/95 backdrop-blur-sm">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-[#2D241E] hover:bg-[#EFE5D5] rounded-md md:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm font-sans">
          <Link
            href="/admin"
            className="text-[#78695C] hover:text-[#2D241E] transition-colors font-medium"
          >
            Admin
          </Link>
          {segments.map((seg, idx) => (
            <React.Fragment key={seg}>
              <span className="text-[#C8B8A6]">/</span>
              <span
                className={
                  idx === segments.length - 1
                    ? 'font-semibold text-[#2D241E] capitalize'
                    : 'text-[#78695C] capitalize'
                }
              >
                {seg.replace('-', ' ')}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Operational Badges & User Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Hassan Kitchen Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#365541]/10 text-[#365541] border border-[#365541]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#365541] animate-pulse" />
          <span>Hassan Kitchen Live</span>
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#78695C] hover:text-[#A43D2E] hover:bg-[#F2EAE0] rounded-md border border-[#E6D9C8] transition-colors"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Staff Role Badge */}
        {currentUser && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#E6D9C8]">
            <div className="w-8 h-8 rounded-full bg-[#A43D2E] text-white flex items-center justify-center font-bold text-xs tracking-wider">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <p className="font-semibold text-[#2D241E] leading-tight">{currentUser.fullName}</p>
              <p className="text-[10px] text-[#8C7A6B] font-mono capitalize">
                {currentUser.role.replace('_', ' ').toLowerCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
