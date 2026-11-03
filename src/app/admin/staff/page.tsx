'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
  Edit,
  X,
} from 'lucide-react';
import { StaffUser, AdminRole } from '@/types/admin';

const ROLES_LIST: { role: AdminRole; label: string; desc: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Unrestricted system access, staff provisioning & settings' },
  { role: 'OPERATIONS_MANAGER', label: 'Operations Manager', desc: 'Order progression, kitchen staging & shipping dispatch' },
  { role: 'INVENTORY_MANAGER', label: 'Inventory Manager', desc: 'Stock movements, batches receipt, product catalogue' },
  { role: 'CUSTOMER_SUPPORT', label: 'Customer Support', desc: 'Order tracking, ticket triage, refund requests' },
  { role: 'FINANCE', label: 'Finance', desc: 'Payment reconciliation, refund approval & auditing' },
  { role: 'MARKETING_MANAGER', label: 'Marketing Manager', desc: 'Festival campaigns & promotional announcements' },
];

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);
  const [editRole, setEditRole] = useState<AdminRole>('OPERATIONS_MANAGER');
  const [editActive, setEditActive] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff', { cache: 'no-store' });
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setStaffList(data.staff || []);
      }
    } catch (e) {
      console.error('Failed to load staff directory', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenEdit = (s: StaffUser) => {
    setSelectedStaff(s);
    setEditRole(s.role);
    setEditActive(s.active);
    setFeedback(null);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/staff/${selectedStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: editRole,
          active: editActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update staff member');
      }

      setFeedback({
        type: 'success',
        text: `Staff member ${selectedStaff.fullName} updated successfully.`,
      });
      setSelectedStaff(null);
      fetchStaff();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error updating staff' });
    } finally {
      setSubmitting(false);
    }
  };

  if (forbidden) {
    return (
      <div className="p-8 text-center bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] max-w-lg mx-auto mt-12">
        <Lock className="w-10 h-10 text-[#A43D2E] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#2D241E]">Restricted Access</h2>
        <p className="text-xs text-[#78695C] mt-2">
          Staff provisioning and permissions management is strictly restricted to the <strong>Super Administrator</strong> role.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
          Staff Directory & Access Control
          <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
            (ಸಿಬ್ಬಂದಿ ನಿರ್ವಹಣೆ)
          </span>
        </h1>
        <p className="text-xs text-[#78695C] mt-0.5">
          Role-Based Access Control (RBAC) governance for kitchen operations, inventory, and finance.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Staff Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Staff Member</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Operational Role</th>
              <th className="py-3 px-4 font-semibold">Account Status</th>
              <th className="py-3 px-4 font-semibold">Last Active</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6D9C8]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#78695C]">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
                  <span>Loading staff directory...</span>
                </td>
              </tr>
            ) : staffList.length > 0 ? (
              staffList.map((s) => (
                <tr key={s.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#FAF5EC] border border-[#E6D9C8] text-[#A43D2E] flex items-center justify-center font-bold text-xs">
                        {s.fullName.charAt(0)}
                      </div>
                      <span className="font-semibold text-[#2D241E]">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#78695C]">
                    {s.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF5EC] text-[#2D241E] border border-[#E6D9C8]">
                      {s.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        s.active
                          ? 'bg-[#365541]/10 text-[#365541]'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {s.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#8C7A6B] text-[11px] font-mono">
                    {s.lastSignInAt ? new Date(s.lastSignInAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-[#E6D9C8] bg-white text-[#A43D2E] hover:bg-[#FAF5EC] cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Modify</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#78695C]">
                  No staff members listed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Role Definitions Card */}
      <div className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FAF5EC] shadow-xs space-y-3">
        <h3 className="font-serif text-sm font-bold text-[#2D241E] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#A43D2E]" />
          <span>RBAC Operational Roles Matrix</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {ROLES_LIST.map((r) => (
            <div key={r.role} className="p-3 bg-[#FFFCF7] rounded-lg border border-[#E6D9C8]">
              <p className="font-bold text-[#2D241E]">{r.label}</p>
              <p className="text-[11px] text-[#78695C] mt-1">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2D241E]">
                  Modify Permissions: {selectedStaff.fullName}
                </h3>
                <p className="font-mono text-xs text-[#8C7A6B]">{selectedStaff.email}</p>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-1 text-[#8C7A6B] hover:text-[#2D241E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Assigned Staff Role *
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D241E]">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    className="rounded text-[#A43D2E]"
                  />
                  <span>Account Active (Uncheck to suspend login)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6D9C8]">
                <button
                  type="button"
                  onClick={() => setSelectedStaff(null)}
                  className="px-3 py-1.5 border border-[#E6D9C8] rounded bg-white text-[#2D241E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-[#A43D2E] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Save Permissions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
