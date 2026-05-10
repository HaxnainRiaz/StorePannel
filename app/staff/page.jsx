"use client";
import { useAdmin } from '@/context/AdminContext';
import AdminTable from '@/components/admin/AdminTable';
import { useMemo } from 'react';
import { UserCog, Shield, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui';

export default function StaffAccountsPage() {
    const { customers, loading } = useAdmin();

    // Filter staff/admins if needed, for now showing all users as "accounts"
    const staff = useMemo(() => customers || [], [customers]);

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'User',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[#0a4019] font-bold text-xs border border-neutral-200">
                        {row.original.name?.[0]}
                    </div>
                    <div>
                        <p className="font-bold text-[#0a4019] text-sm">{row.original.name}</p>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{row.original.role}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'email',
            header: 'Contact',
            cell: ({ row }) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                        <Mail size={12}/> {row.original.email}
                    </div>
                    {row.original.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                            <Phone size={12}/> {row.original.phone}
                        </div>
                    )}
                </div>
            )
        },
        {
            accessorKey: 'role',
            header: 'Permissions',
            cell: ({ row }) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                    row.original.role === 'admin' 
                    ? "bg-purple-50 text-purple-700 border-purple-100" 
                    : "bg-blue-50 text-blue-700 border-blue-100"
                }`}>
                    {row.original.role}
                </span>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <Button variant="outline" size="sm" className="h-8 gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <UserCog size={12}/> Manage
                </Button>
            )
        }
    ], []);

    return (
        <div className="space-y-6 pb-20 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#0a4019] uppercase tracking-widest">Staff Accounts</h1>
                    <p className="text-xs text-neutral-400 mt-1 font-bold uppercase tracking-[0.2em]">Manage administrative access and roles</p>
                </div>
                <Button className="bg-[#0a4019] text-white gap-2">
                    <Shield size={18} /> Add Staff Member
                </Button>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#F5F3F0] shadow-sm overflow-hidden">
                <AdminTable 
                    columns={columns} 
                    data={staff} 
                    loading={loading}
                />
            </div>
        </div>
    );
}

