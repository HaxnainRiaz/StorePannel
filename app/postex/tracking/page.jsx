"use client";
import { useAdmin } from '@/context/AdminContext';
import { Truck, Clock, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { useMemo } from 'react';

export default function TrackingMonitorPage() {
    const { orders, loading } = useAdmin();

    const kanbanData = useMemo(() => {
        const columns = {
            'Booked': [],
            'In Transit': [],
            'Out for Delivery': [],
            'Delivered': [],
            'Issues': []
        };

        if (!orders) return columns;

        orders.filter(o => o.isPostExBooked).forEach(order => {
            const status = order.deliveryStatus;
            if (status === 'Booked') columns['Booked'].push(order);
            else if (['Picked Up', 'At PostEx Warehouse', 'In Transit'].includes(status)) columns['In Transit'].push(order);
            else if (status === 'Out for Delivery') columns['Out for Delivery'].push(order);
            else if (status === 'Delivered') columns['Delivered'].push(order);
            else if (['Returned', 'Returning', 'Delivery Attempted', 'Under Review'].includes(status)) columns['Issues'].push(order);
        });

        return columns;
    }, [orders]);

    return (
        <div className="space-y-6 pb-20 animate-fadeIn">
            <h1 className="text-3xl font-heading font-bold text-[#0a4019] uppercase tracking-widest">Tracking Monitor</h1>
            
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar min-h-[600px]">
                {Object.entries(kanbanData).map(([colName, items]) => (
                    <div key={colName} className="flex-shrink-0 w-80 bg-neutral-50/50 rounded-2xl border border-[#F5F3F0] flex flex-col p-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-[10px] uppercase tracking-widest text-neutral-400">{colName}</h3>
                            <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-[#0a4019] border border-[#F5F3F0]">{items.length}</span>
                        </div>
                        
                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                            {items.map(order => (
                                <div key={order._id} className="bg-white p-4 rounded-xl border border-[#F5F3F0] shadow-sm hover:border-[#0a4019]/20 transition-all group cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono font-bold text-[#0a4019] text-xs">{order.orderNumber}</span>
                                        <span className="text-[10px] text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm font-bold text-neutral-800 mb-3">{order.customerName || order.shippingAddress?.fullName}</p>
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400 border-t border-[#F5F3F0] pt-3">
                                        <div className="flex items-center gap-1"><Truck size={12}/> {order.shippingAddress?.city}</div>
                                        <div className="text-[#0a4019]">Rs. {order.totalAmount}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

