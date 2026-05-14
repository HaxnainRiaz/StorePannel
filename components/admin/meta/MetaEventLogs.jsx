"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { History, Search, Filter, RefreshCw, CheckCircle2, XCircle, Globe, Server, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { format } from "date-fns";

export default function MetaEventLogs() {
    const { adminRequest } = useAdmin();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ eventName: "", status: "", source: "" });

    const fetchLogs = async () => {
        setLoading(true);
        const query = new URLSearchParams({ page, limit: 15, ...filters }).toString();
        const res = await adminRequest(`/meta/event-logs?${query}`);
        if (res?.success) {
            setLogs(res.data);
            setTotal(res.pagination.total);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, [page, filters]);

    const totalPages = Math.ceil(total / 15);

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                            <History size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#0a4019]">Event Logs</h2>
                            <p className="text-sm text-neutral-500">History of events sent to Meta.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                            <input 
                                type="text"
                                placeholder="Event name..."
                                value={filters.eventName}
                                onChange={(e) => setFilters({ ...filters, eventName: e.target.value })}
                                className="pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs outline-none focus:border-[#0a4019]"
                            />
                        </div>
                        <select 
                            value={filters.source}
                            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                            className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs outline-none focus:border-[#0a4019]"
                        >
                            <option value="">All Sources</option>
                            <option value="browser">Browser</option>
                            <option value="server">Server</option>
                        </select>
                        <select 
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs outline-none focus:border-[#0a4019]"
                        >
                            <option value="">All Statuses</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                        </select>
                        <button 
                            onClick={fetchLogs}
                            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin text-[#0a4019]" : "text-neutral-400"} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar border border-neutral-100 rounded-3xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Event</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Source</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Order</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-400 italic text-sm">
                                        Loading logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-400 italic text-sm">
                                        No event logs found matching filters.
                                    </td>
                                </tr>
                            ) : logs.map((log) => (
                                <tr key={log._id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#0a4019] text-xs">{log.eventName}</span>
                                            <span className="text-[10px] text-neutral-400 font-mono">{log.eventId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${log.source === 'server' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {log.source === 'server' ? <Server size={10} /> : <Globe size={10} />}
                                            {log.source}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase ${log.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                            {log.status === 'success' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {log.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-neutral-500 font-mono">
                                            {log.orderId?.orderNumber || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                                            {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-300 hover:text-[#0a4019]">
                                            <Eye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-neutral-100">
                        <p className="text-xs text-neutral-400">
                            Showing <span className="text-[#0a4019] font-bold">{(page-1)*15 + 1}</span> to <span className="text-[#0a4019] font-bold">{Math.min(page*15, total)}</span> of <span className="text-[#0a4019] font-bold">{total}</span> events
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-neutral-100 rounded-xl disabled:opacity-30 hover:bg-neutral-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs font-bold text-[#0a4019] px-4">Page {page} of {totalPages}</span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 border border-neutral-100 rounded-xl disabled:opacity-30 hover:bg-neutral-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
