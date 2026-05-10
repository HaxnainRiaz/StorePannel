"use client";
import { useAdmin } from '@/context/AdminContext';
import AdminTable from '@/components/admin/AdminTable';
import { useMemo, useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import { format } from 'date-fns';

export default function FailedBookingsPage() {
    const { adminRequest } = useAdmin();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        const res = await adminRequest('/postex/logs/failed');
        if (res?.success) setLogs(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const columns = useMemo(() => [
        {
            accessorKey: 'createdAt',
            header: 'Time',
            cell: ({ row }) => <span className="text-xs text-neutral-500">{format(new Date(row.original.createdAt), 'MMM d, HH:mm')}</span>
        },
        {
            accessorKey: 'orderId.orderNumber',
            header: 'Order',
            cell: ({ row }) => <span className="font-bold text-[#0a4019]">{row.original.orderId?.orderNumber || 'N/A'}</span>
        },
        {
            accessorKey: 'errorMessage',
            header: 'Error Reason',
            cell: ({ row }) => <span className="text-red-600 text-xs font-medium">{row.original.errorMessage}</span>
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <RefreshCw size={12}/> Retry
                    </Button>
                </div>
            )
        }
    ], []);

    return (
        <div className="space-y-6 pb-20 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#0a4019] uppercase tracking-widest">Failed Bookings</h1>
                    <p className="text-xs text-neutral-400 mt-1 font-bold uppercase tracking-[0.2em]">Review and retry failed PostEx shipments</p>
                </div>
                <Button onClick={fetchLogs} variant="outline" className="gap-2">
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
                </Button>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#F5F3F0] shadow-sm overflow-hidden">
                <AdminTable 
                    columns={columns} 
                    data={logs} 
                    loading={loading}
                />
            </div>
        </div>
    );
}
