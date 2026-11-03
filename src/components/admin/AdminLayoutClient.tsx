'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { StaffUser } from '@/types/admin';
import { Loader2 } from 'lucide-react';

export const AdminLayoutClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      if (isLoginPage) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/auth/me', {
          cache: 'no-store',
        });

        if (!mounted) return;

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          } else {
            router.replace('/admin/login');
          }
        } else {
          router.replace('/admin/login');
        }
      } catch (err) {
        if (mounted) {
          router.replace('/admin/login');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      setCurrentUser(null);
      router.replace('/admin/login');
    }
  };

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#F7F0E3]">{children}</main>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F0E3] flex flex-col items-center justify-center p-6 text-[#2D241E]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#A43D2E]" />
          <span className="font-serif text-lg font-semibold tracking-wide">
            Authenticating THINDI Admin...
          </span>
        </div>
        <p className="text-xs text-[#78695C] mt-2 font-mono">
          Verifying secure session token
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F0E3] text-[#2D241E] flex flex-col md:flex-row antialiased selection:bg-[#A43D2E]/20">
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-[#E6D9C8] min-h-screen bg-[#FFFCF7]">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <AdminSidebar
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#FFFCF7] h-full shadow-2xl z-10 flex flex-col">
            <AdminSidebar
              currentUser={currentUser}
              onLogout={handleLogout}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          currentUser={currentUser}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

