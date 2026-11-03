'use client';

import React, { useEffect, useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  RefreshCw,
  Loader2,
  Calendar,
} from 'lucide-react';
import { AuditLogEntry } from '@/types/admin';

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/audit-log?limit=150', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Failed to load audit logs', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchTerm.toLowerCase();
    return (
      searchTerm === '' ||
      log.action.toLowerCase().includes(q) ||
      log.actorEmail.toLowerCase().includes(q) ||
      log.actorRole.toLowerCase().includes(q) ||
      log.targetResource.toLowerCase().includes(q) ||
      log.targetId.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Immutable Audit Trail
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ಲೆಕ್ಕಪರಿಶೋಧನಾ ದಾಖಲೆ)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Cryptographic ledger tracking all staff mutations, stock adjustments, status overrides, and refund authorizations.
          </p>
        </div>

        <button
          onClick={() => fetchLogs(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[#E6D9C8] bg-[#FFFCF7] text-[#2D241E] hover:bg-[#FAF5EC] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Search logs by staff email, action, resource, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] placeholder-[#B5A493] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
          />
        </div>
        <span className="text-[11px] text-[#8C7A6B] ml-auto">
          Showing {filteredLogs.length} events
        </span>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">Resource</th>
              <th className="py-3 px-4 font-semibold">Target ID</th>
              <th className="py-3 px-4 font-semibold">Actor / Staff</th>
              <th className="py-3 px-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6D9C8]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-[#78695C]">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
                  <span>Loading audit log ledger...</span>
                </td>
              </tr>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                  <td className="py-3 px-4 text-[#78695C] font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#2D241E] text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-semibold text-[#8C7A6B]">
                    {log.targetResource}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#A43D2E] font-medium">
                    {log.targetId}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-[#2D241E]">{log.actorEmail}</p>
                    <p className="text-[10px] text-[#8C7A6B] font-mono capitalize">
                      {log.actorRole.replace('_', ' ').toLowerCase()}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-[#78695C] max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#78695C]">
                  No audit log events match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

