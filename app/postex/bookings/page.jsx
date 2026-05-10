"use client";
import { useAdmin } from '@/context/AdminContext';
import AdminTable from '@/components/admin/AdminTable';
import { useMemo } from 'react';
import { Truck, Printer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function PostExBookingsPage() {
    const { orders, loading, adminRequest, refreshData } = useAdmin();

    const bookedOrders = useMemo(() => orders?.filter(o => o.isPostExBooked) || [], [orders]);

    const handleSyncAll = async () => {
        try {
            const res = await adminRequest('/postex/sync-tracking', 'POST');
            if (res?.success) {
                toast.success(`Synced ${res.updatesCount} updates`);
                refreshData();
            }
        } catch (error) {
            toast.error('Sync failed');
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'orderNumber',
            header: 'Order',
            cell: ({ row }) => <span className="font-bold text-[#0a4019]">{row.original.orderNumber}</span>
        },
        {
            accessorKey: 'postex.trackingNumber',
            header: 'Tracking',
            cell: ({ row }) => <span className="font-mono font-bold text-neutral-600">{row.original.postex?.trackingNumber}</span>
        },
        {
            accessorKey: 'deliveryStatus',
            header: 'Status',
            cell: ({ row }) => (
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    {row.original.deliveryStatus}
                </span>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Print Bill"><Printer size={14}/></Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Sync Tracking"><RefreshCw size={14}/></Button>
                </div>
            )
        }
    ], []);

    return (
        <div className="space-y-6 pb-20 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-heading font-bold text-[#0a4019] uppercase tracking-widest">PostEx Bookings</h1>
                <Button onClick={handleSyncAll} className="bg-[#0a4019] text-white gap-2">
                    <RefreshCw size={16} /> Sync All Tracking
                </Button>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#F5F3F0] shadow-sm overflow-hidden">
                <AdminTable 
                    columns={columns} 
                    data={bookedOrders} 
                    loading={loading}
                />
            </div>
        </div>
    );
}

