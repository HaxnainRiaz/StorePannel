"use client";
import { useAdmin } from '@/context/AdminContext';
import AdminTable from '@/components/admin/AdminTable';
import { useMemo, useState } from 'react';
import { Truck, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function BulkBookPage() {
    const { orders, loading, adminRequest, refreshData } = useAdmin();
    const [rowSelection, setRowSelection] = useState({});

    const unbookedOrders = useMemo(() => {
        return orders?.filter(o => !o.isPostExBooked && !['cancelled', 'delivered'].includes(o.orderStatus)) || [];
    }, [orders]);

    const selectedOrderIds = Object.keys(rowSelection).map(idx => unbookedOrders[parseInt(idx)]?._id).filter(Boolean);

    const handleBulkBook = async () => {
        if (selectedOrderIds.length === 0) return;
        try {
            const res = await adminRequest('/postex/bulk-book', 'POST', { orderIds: selectedOrderIds });
            if (res?.success) {
                toast.success(`Successfully booked ${res.count} orders`);
                setRowSelection({});
                refreshData();
            }
        } catch (error) {
            toast.error('Bulk booking failed');
        }
    };

    const columns = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-neutral-300 text-[#0a4019] focus:ring-[#0a4019]"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-neutral-300 text-[#0a4019] focus:ring-[#0a4019]"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        },
        {
            accessorKey: 'orderNumber',
            header: 'Order',
            cell: ({ row }) => <span className="font-bold text-[#0a4019]">{row.original.orderNumber}</span>
        },
        {
            accessorKey: 'customerName',
            header: 'Customer',
            cell: ({ row }) => <span className="text-sm font-medium">{row.original.customerName || row.original.shippingAddress?.fullName}</span>
        },
        {
            accessorKey: 'totalAmount',
            header: 'COD Amount',
            cell: ({ row }) => <span className="font-bold">Rs. {row.original.totalAmount}</span>
        },
        {
            accessorKey: 'shippingAddress.city',
            header: 'City',
            cell: ({ row }) => <span className="text-xs uppercase tracking-widest font-bold text-neutral-500">{row.original.shippingAddress?.city}</span>
        }
    ], []);

    return (
        <div className="space-y-6 pb-20 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#0a4019] uppercase tracking-widest">Bulk Logistics</h1>
                    <p className="text-xs text-neutral-400 mt-1 font-bold uppercase tracking-[0.2em]">Select multiple orders to book on PostEx</p>
                </div>
                <Button 
                    onClick={handleBulkBook} 
                    disabled={selectedOrderIds.length === 0}
                    className="bg-[#0a4019] text-white gap-2 h-12 px-6"
                >
                    <Truck size={18} /> Book {selectedOrderIds.length} Orders
                </Button>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#F5F3F0] shadow-sm overflow-hidden">
                <AdminTable 
                    columns={columns} 
                    data={unbookedOrders} 
                    loading={loading}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                />
            </div>
        </div>
    );
}
