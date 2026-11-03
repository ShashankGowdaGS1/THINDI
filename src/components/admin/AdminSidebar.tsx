'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Boxes,
  CalendarClock,
  Truck,
  CreditCard,
  HelpCircle,
  Sparkles,
  Users,
  Settings,
  History,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { AdminRole, StaffUser } from '@/types/admin';

interface AdminSidebarProps {
  currentUser: StaffUser | null;
  onLogout: () => void;
  onCloseMobile?: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    kannadaLabel?: string;
    href: string;
    icon: React.ReactNode;
    roles?: AdminRole[];
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentUser,
  onLogout,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const userRole = currentUser?.role || 'SUPER_ADMIN';

  const sections: NavSection[] = [
    {
      title: 'Commerce & Orders',
      items: [
        {
          label: 'Overview',
          kannadaLabel: 'ಅವಲೋಕನ',
          href: '/admin',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          label: 'Orders',
          kannadaLabel: 'ಆರ್ಡರ್‌ಗಳು',
          href: '/admin/orders',
          icon: <ShoppingBag className="w-4 h-4" />,
        },
        {
          label: 'Products',
          kannadaLabel: 'ಉತ್ಪನ್ನಗಳು',
          href: '/admin/products',
          icon: <Package className="w-4 h-4" />,
        },
        {
          label: 'Categories',
          kannadaLabel: 'ವಿಭಾಗಗಳು',
          href: '/admin/categories',
          icon: <Layers className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Kitchen & Fulfilment',
      items: [
        {
          label: 'Inventory Ledger',
          kannadaLabel: 'ದಾಸ್ತಾನು',
          href: '/admin/inventory',
          icon: <Boxes className="w-4 h-4" />,
        },
        {
          label: 'Production Batches',
          kannadaLabel: 'ತಯಾರಿ ಬ್ಯಾಚ್',
          href: '/admin/inventory/batches',
          icon: <CalendarClock className="w-4 h-4" />,
        },
        {
          label: 'Shipping & Dispatch',
          kannadaLabel: 'ರವಾನೆ',
          href: '/admin/shipping',
          icon: <Truck className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Finance & Care',
      items: [
        {
          label: 'Payments & Refunds',
          kannadaLabel: 'ಪಾವತಿಗಳು',
          href: '/admin/payments',
          icon: <CreditCard className="w-4 h-4" />,
        },
        {
          label: 'Support Tickets',
          kannadaLabel: 'ಗ್ರಾಹಕ ಸೇವೆ',
          href: '/admin/support',
          icon: <HelpCircle className="w-4 h-4" />,
        },
        {
          label: 'Festival Campaigns',
          kannadaLabel: 'ಹಬ್ಬದ ಆಂದೋಲನ',
          href: '/admin/campaigns',
          icon: <Sparkles className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          label: 'Staff Management',
          kannadaLabel: 'ಸಿಬ್ಬಂದಿ',
          href: '/admin/staff',
          icon: <Users className="w-4 h-4" />,
          roles: ['SUPER_ADMIN'],
        },
        {
          label: 'Business Settings',
          kannadaLabel: 'ಸಂಯೋಜನೆಗಳು',
          href: '/admin/settings',
          icon: <Settings className="w-4 h-4" />,
        },
        {
          label: 'Audit Log',
          kannadaLabel: 'ಲೆಕ್ಕಪರಿಶೋಧನೆ',
          href: '/admin/audit-log',
          icon: <History className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#FFFCF7] border-r border-[#E6D9C8] flex flex-col h-full select-none">
      {/* Brand & Workspace Header */}
      <div className="p-5 border-b border-[#E6D9C8] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl text-[#2D241E] tracking-tight">
              THINDI
            </span>
            <span className="font-kannada text-xs font-semibold text-[#A43D2E]">ತಿಂಡಿ</span>
            <span className="text-[10px] font-mono uppercase bg-[#2D241E]/10 text-[#2D241E] px-1.5 py-0.5 rounded font-bold">
              HQ
            </span>
          </div>
          <span className="text-[11px] text-[#2D241E]/60 block font-sans mt-0.5">
            Hassan Operations Portal
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {sections.map((sec) => {
          // Filter items by role if specified
          const visibleItems = sec.items.filter(
            (item) => !item.roles || item.roles.includes(userRole)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={sec.title} className="space-y-1">
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-[#2D241E]/50 px-3 block">
                {sec.title}
              </span>

              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-sans font-medium transition-colors ${
                        isActive
                          ? 'bg-[#A43D2E] text-[#F7F0E3] font-semibold shadow-xs'
                          : 'text-[#2D241E]/80 hover:bg-[#F7F0E3] hover:text-[#2D241E]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-[#F7F0E3]' : 'text-[#2D241E]/60'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.kannadaLabel && (
                        <span
                          className={`font-kannada text-[11px] ${
                            isActive ? 'text-[#F7F0E3]/80' : 'text-[#2D241E]/40'
                          }`}
                        >
                          {item.kannadaLabel}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Account & Logout Footer */}
      <div className="p-4 border-t border-[#E6D9C8] bg-[#F7F0E3]/50 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2D241E] text-[#F7F0E3] flex items-center justify-center font-bold text-xs uppercase">
            {currentUser?.fullName?.substring(0, 2) || 'OP'}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[#2D241E] block truncate">
              {currentUser?.fullName || 'Staff Member'}
            </span>
            <span className="text-[10px] font-mono text-[#A43D2E] font-semibold uppercase block truncate">
              {userRole.replace('_', ' ')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded border border-[#E6D9C8] hover:bg-[#A43D2E] hover:text-[#F7F0E3] hover:border-[#A43D2E] text-xs font-semibold text-[#2D241E] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

