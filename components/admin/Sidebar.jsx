"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Star,
    Settings,
    LogOut,
    Menu,
    X,
    Users,
    TicketPercent,
    LifeBuoy,
    ClipboardList,
    Box,
    Layers,
    FileText,
    Truck,
    PackagePlus,
    MapPin,
    AlertTriangle,
    RotateCcw,
    BarChart2,
    UserCog,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
    const pathname = usePathname() || "";
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const sections = [
        {
            title: "MAIN",
            items: [
                { label: "Dashboard", href: "/", icon: LayoutDashboard },
                { label: "Orders", href: "/orders", icon: ShoppingBag },
                { label: "Products", href: "/products", icon: Package },
                { label: "Categories", href: "/categories", icon: Layers },
                { label: "Customers", href: "/customers", icon: Users },
                { label: "Inventory", href: "/inventory", icon: Box },
            ]
        },
        {
            title: "POSTEX HUB",
            colorAccent: true,
            items: [
                { label: "PostEx Bookings", href: "/postex/bookings", icon: Truck },
                { label: "Bulk Book", href: "/postex/bulk", icon: PackagePlus },
                { label: "Tracking Monitor", href: "/postex/tracking", icon: MapPin },
                { label: "Failed Bookings", href: "/postex/failed", icon: AlertTriangle },
                { label: "Returns Queue", href: "/postex/returns", icon: RotateCcw },
            ]
        },
        {
            title: "MARKETING & ADS",
            items: [
                { label: "Facebook & Instagram", href: "/meta", icon: Box }, // Using Box for now, maybe find a better icon
                { label: "Discounts", href: "/discounts", icon: TicketPercent },
                { label: "Reviews", href: "/reviews", icon: Star },
                { label: "Blogs", href: "/blogs", icon: FileText },
            ]
        },
        {
            title: "ANALYTICS",
            items: [
                { label: "Analytics", href: "/analytics", icon: BarChart2 },
                { label: "Reports", href: "/reports", icon: FileText },
            ]
        },
        {
            title: "SETTINGS",
            items: [
                { label: "Settings", href: "/settings", icon: Settings },
                { label: "Staff Accounts", href: "/staff", icon: UserCog },
                { label: "Audit Log", href: "/audit", icon: ClipboardList },
                { label: "Support", href: "/support", icon: LifeBuoy },
            ]
        }
    ];

    const isActive = (path) => {
        if (!pathname) return false;
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 right-4 z-[70] p-3 bg-[#0a4019] text-white rounded-2xl shadow-xl border border-white/20"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <aside
                className={`
                    fixed top-0 left-0 z-[60] h-screen w-64
                    bg-[#051712] text-[#FDFCFB]
                    transition-all duration-300 ease-in-out
                    border-r border-[#0a4019]/20
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="flex flex-col h-full p-6">
                    <Link href="/" className="mb-8 block group">
                        <div className="text-center">
                            <h1 className="font-heading text-2xl tracking-[0.2em] uppercase text-white group-hover:text-[#d3d3d3] transition-colors">Luminelle</h1>
                            <div className="h-px w-12 bg-[#d3d3d3]/50 mx-auto mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            <p className="text-[10px] text-[#d3d3d3] tracking-[0.3em] uppercase mt-2 font-bold opacity-70">Admin Core</p>
                        </div>
                    </Link>

                    <div className="px-4 py-3 mb-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                            <Truck size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none mb-1">Logistics Active</p>
                            <p className="text-[9px] text-[#d3d3d3]/50 font-bold uppercase tracking-tight truncate">PostEx API Integrated</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-8">
                        {sections.map((section, idx) => (
                            <div key={idx} className="space-y-1">
                                <h3 className={`px-4 text-[9px] font-bold tracking-[0.2em] mb-3 uppercase ${section.colorAccent ? 'text-emerald-400' : 'text-[#d3d3d3]/40'}`}>
                                    {section.title}
                                </h3>
                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
                                            ${isActive(item.href)
                                                ? "bg-white/10 text-white font-bold"
                                                : "text-[#F5F3F0]/70 hover:bg-white/5 hover:text-white"
                                            }
                                        `}
                                    >
                                        <item.icon size={16} className={`${isActive(item.href) ? (section.colorAccent ? "text-emerald-400" : "text-white") : "text-[#d3d3d3]/50 group-hover:text-white"} transition-all`} />
                                        <span className="text-[13px] tracking-wide">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-white/10 mt-6 pb-2">
                        <div className="flex items-center gap-3 px-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d3d3d3] to-[#B8A68A] flex items-center justify-center text-[#0a4019] font-bold text-sm shadow-inner overflow-hidden border border-white/20">
                                <img src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name || "Admin"}</p>
                                <p className="text-[10px] font-bold text-[#d3d3d3] uppercase tracking-widest opacity-80">{user?.role || "Manager"}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[#F5F3F0]/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                        >
                            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-sm font-bold tracking-wide">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-[55] bg-[#0a4019]/60 backdrop-blur-md animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
