"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/context/AdminContext';
import toast from 'react-hot-toast';
import {
    Truck, Search, RefreshCw, X, Download, FileText,
    Loader2, ChevronDown, Eye, AlertTriangle
} from 'lucide-react';

const STATUS_COLORS = {
    'Booked':             'bg-blue-50 text-blue-700 border-blue-100',
    'Picked Up':          'bg-indigo-50 text-indigo-700 border-indigo-100',
    'At PostEx Warehouse':'bg-purple-50 text-purple-700 border-purple-100',
    'In Transit':         'bg-violet-50 text-violet-700 border-violet-100',
    'Out for Delivery':   'bg-amber-50 text-amber-700 border-amber-100',
    'Delivered':          'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Returned':           'bg-red-50 text-red-700 border-red-100',
    'Returning':          'bg-orange-50 text-orange-700 border-orange-100',
    'Delivery Attempted': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'Under Review':       'bg-rose-50 text-rose-700 border-rose-100',
    'Cancelled':          'bg-neutral-100 text-neutral-500 border-neutral-200',
    'Pending':            'bg-slate-50 text-slate-600 border-slate-100',
};

export default function PostExShipmentsPage() {
    const { adminRequest } = useAdmin();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [selected, setSelected] = useState(new Set());
    const [filters, setFilters] = useState({ trackingNumber: '', status: '', from: '', to: '' });
    const [trackingDetail, setTrackingDetail] = useState(null);
    const [trackingLoading, setTrackingLoading] = useState(null);
    const [paymentDetail, setPaymentDetail] = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);

    const fetchShipments = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
        const res = await adminRequest(`/postex/shipments?${params.toString()}`);
        if (res?.success) setShipments(res.data || []);
        else toast.error(res?.message || 'Failed to load shipments');
        setLoading(false);
    }, [adminRequest, filters]);

    useEffect(() => { fetchShipments(); }, []);

    const handleSyncAll = async () => {
        setSyncing(true);
        const res = await adminRequest('/postex/sync-tracking', 'POST');
        if (res?.success) { toast.success(`${res.updatesCount} shipments updated`); fetchShipments(); }
        else toast.error(res?.message || 'Sync failed');
        setSyncing(false);
    };

    const handleTrack = async (trackingNumber) => {
        setTrackingLoading(trackingNumber);
        const res = await adminRequest(`/postex/track/${trackingNumber}`);
        if (res?.success) { setTrackingDetail(res); fetchShipments(); }
        else toast.error(res?.message || 'Tracking failed');
        setTrackingLoading(null);
    };

    const handlePaymentStatus = async (trackingNumber) => {
        const res = await adminRequest(`/postex/payment-status/${trackingNumber}`);
        if (res?.success) setPaymentDetail(res);
        else toast.error(res?.message || 'Failed to fetch payment status');
    };

    const handleCancel = async () => {
        if (!cancelTarget) return;
        const res = await adminRequest(`/postex/cancel/${cancelTarget}`, 'PUT');
        if (res?.success) { toast.success('Shipment cancelled'); setCancelTarget(null); fetchShipments(); }
        else toast.error(res?.message || 'Cancel failed');
    };

    const handleBulkInvoice = async () => {
        if (selected.size === 0) return toast.error('Select at least one shipment');
        const nums = Array.from(selected).slice(0, 10).join(',');
        const res = await adminRequest(`/postex/invoice?trackingNumbers=${nums}`);
        if (res?.success && res.data?.dist?.invoiceUrl) {
            window.open(res.data.dist.invoiceUrl, '_blank');
        } else toast.error(res?.message || 'Invoice generation failed');
    };

    const toggleSelect = (tn) => setSelected(prev => {
        const n = new Set(prev);
        n.has(tn) ? n.delete(tn) : n.add(tn);
        return n;
    });

    return (
        <div className="space-y-6 pb-20 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#0a4019] uppercase tracking-widest flex items-center gap-3">
                        <Truck size={26}/> PostEx Shipments
                    </h1>
                    <p className="text-xs text-neutral-400 mt-1 font-bold uppercase tracking-[0.15em]">{shipments.length} total shipments</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {selected.size > 0 && (
                        <button onClick={handleBulkInvoice} className="flex items-center gap-2 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50">
                            <FileText size={15}/> Invoice ({Math.min(selected.size, 10)})
                        </button>
                    )}
                    <button onClick={handleSyncAll} disabled={syncing} className="flex items-center gap-2 bg-[#0a4019] text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-[#0a4019]/90 disabled:opacity-50">
                        {syncing ? <Loader2 size={15} className="animate-spin"/> : <RefreshCw size={15}/>} Sync All
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#F5F3F0] shadow-sm p-4 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"/>
                    <input placeholder="Tracking number…" value={filters.trackingNumber}
                        onChange={e => setFilters(p => ({ ...p, trackingNumber: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#0a4019]"/>
                </div>
                <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
                    className="border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0a4019] min-w-40">
                    <option value="">All Statuses</option>
                    {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                </select>
                <input type="date" value={filters.from} onChange={e => setFilters(p => ({ ...p, from: e.target.value }))}
                    className="border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0a4019]"/>
                <input type="date" value={filters.to} onChange={e => setFilters(p => ({ ...p, to: e.target.value }))}
                    className="border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0a4019]"/>
                <button onClick={fetchShipments} className="bg-[#0a4019] text-white rounded-xl px-4 py-2 text-sm font-bold">Apply</button>
                <button onClick={() => { setFilters({ trackingNumber: '', status: '', from: '', to: '' }); }} className="border border-neutral-200 rounded-xl px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-50">Clear</button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#F5F3F0] shadow-sm overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-[#0a4019]" size={28}/></div>
                ) : shipments.length === 0 ? (
                    <div className="text-center py-16 text-neutral-400">
                        <Truck size={40} className="mx-auto mb-3 opacity-20"/>
                        <p className="font-bold text-sm">No shipments found</p>
                        <p className="text-xs mt-1">Book a shipment from the Orders page</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 border-b border-[#F5F3F0]">
                            <tr>
                                <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded" onChange={e => setSelected(e.target.checked ? new Set(shipments.map(s => s.postexTrackingNumber)) : new Set())}/></th>
                                {['Tracking #','Order','Customer','COD','City','Status','Last Sync','Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F3F0]">
                            {shipments.map(s => (
                                <tr key={s._id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" className="rounded" checked={selected.has(s.postexTrackingNumber)}
                                            onChange={() => toggleSelect(s.postexTrackingNumber)}/>
                                    </td>
                                    <td className="px-4 py-3 font-mono font-bold text-neutral-700 text-xs">{s.postexTrackingNumber}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-[#0a4019]">{s.localOrderId?.orderNumber || '—'}</td>
                                    <td className="px-4 py-3 text-xs">{s.customerName}<div className="text-neutral-400">{s.customerPhone}</div></td>
                                    <td className="px-4 py-3 text-xs font-bold">Rs. {s.invoicePayment?.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs">{s.cityName}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${STATUS_COLORS[s.orderStatus] || STATUS_COLORS['Pending']}`}>
                                            {s.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-neutral-400">
                                        {s.lastSyncedAt ? new Date(s.lastSyncedAt).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleTrack(s.postexTrackingNumber)} title="Track"
                                                disabled={trackingLoading === s.postexTrackingNumber}
                                                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-[#0a4019] hover:text-white hover:border-[#0a4019] transition-all text-neutral-500">
                                                {trackingLoading === s.postexTrackingNumber ? <Loader2 size={12} className="animate-spin"/> : <Eye size={12}/>}
                                            </button>
                                            <button onClick={() => handlePaymentStatus(s.postexTrackingNumber)} title="Payment Status"
                                                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all text-neutral-500">
                                                <Download size={12}/>
                                            </button>
                                            {!s.isCancelled && !['Delivered','Returned','Cancelled'].includes(s.orderStatus) && (
                                                <button onClick={() => setCancelTarget(s.postexTrackingNumber)} title="Cancel"
                                                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-neutral-500">
                                                    <X size={12}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Tracking detail modal */}
            {trackingDetail && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setTrackingDetail(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-[#0a4019] uppercase tracking-widest text-sm">Tracking Details</h3>
                            <button onClick={() => setTrackingDetail(null)}><X size={18}/></button>
                        </div>
                        {trackingDetail.data?.dist && (
                            <>
                                <div className="flex items-center gap-3 mb-4 p-3 bg-neutral-50 rounded-xl">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border ${STATUS_COLORS[trackingDetail.shipment?.orderStatus] || STATUS_COLORS['Pending']}`}>
                                        {trackingDetail.data.dist.transactionStatus}
                                    </span>
                                    <span className="font-mono text-sm text-neutral-600">{trackingDetail.data.dist.trackingNumber}</span>
                                </div>
                                {Array.isArray(trackingDetail.data.dist.transactionHistory) && trackingDetail.data.dist.transactionHistory.length > 0 && (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {trackingDetail.data.dist.transactionHistory.map((h, i) => (
                                            <div key={i} className="flex gap-3 items-start">
                                                <div className="w-2 h-2 rounded-full bg-[#0a4019] mt-1.5 flex-shrink-0"/>
                                                <div>
                                                    <p className="text-xs font-bold text-neutral-800">{h.status || h.transactionStatus}</p>
                                                    <p className="text-xs text-neutral-400">{h.date || h.updatedAt}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Payment status modal */}
            {paymentDetail && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPaymentDetail(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-[#0a4019] uppercase tracking-widest text-sm">Payment Status</h3>
                            <button onClick={() => setPaymentDetail(null)}><X size={18}/></button>
                        </div>
                        {paymentDetail.data?.dist ? (
                            <div className="space-y-3">
                                {[
                                    ['Settled', paymentDetail.data.dist.settle ? '✅ Yes' : '❌ No'],
                                    ['Settlement Date', paymentDetail.data.dist.settlementDate || '—'],
                                    ['Upfront Payment', paymentDetail.data.dist.upfrontPaymentDate || '—'],
                                    ['Reserve Payment', paymentDetail.data.dist.reservePaymentDate || '—'],
                                    ['Tracking #', paymentDetail.data.dist.trackingNumber],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-sm border-b border-neutral-100 pb-2">
                                        <span className="text-neutral-500 font-medium">{k}</span>
                                        <span className="font-bold">{v}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-neutral-500">No payment data available yet.</p>}
                    </div>
                </div>
            )}

            {/* Cancel confirm modal */}
            {cancelTarget && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertTriangle size={22}/>
                            <h3 className="font-bold uppercase tracking-widest text-sm">Cancel Shipment</h3>
                        </div>
                        <p className="text-sm text-neutral-600">Are you sure you want to cancel <span className="font-mono font-bold">{cancelTarget}</span>? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={handleCancel} className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-600">Yes, Cancel</button>
                            <button onClick={() => setCancelTarget(null)} className="flex-1 border border-neutral-200 rounded-xl py-2.5 text-sm font-bold hover:bg-neutral-50">Go Back</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
