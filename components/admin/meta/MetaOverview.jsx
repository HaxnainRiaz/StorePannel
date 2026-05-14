"use client";

import { useState } from "react";
import { 
    Facebook, 
    ShieldCheck, 
    Database, 
    Briefcase, 
    Activity, 
    RefreshCw, 
    AlertCircle, 
    CheckCircle2, 
    ExternalLink,
    Settings,
    LogOut,
    ChevronRight,
    Zap
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function MetaOverview({ config, setActiveTab, refresh, adminRequest }) {
    const [loading, setLoading] = useState(false);
    const isConnected = config?.connectionStatus === 'connected';
    const isSetupComplete = config?.setupCompleted;

    const stats = [
        { label: "Browser Pixel", status: config?.isPixelEnabled ? "Active" : "Disabled", icon: <Database size={16} />, color: config?.isPixelEnabled ? "text-green-600" : "text-neutral-400" },
        { label: "Conversions API", status: config?.isCapiEnabled ? "Active" : "Disabled", icon: <Zap size={16} />, color: config?.isCapiEnabled ? "text-green-600" : "text-neutral-400" },
        { label: "Deduplication", status: config?.deduplicationEnabled ? "Enabled" : "Disabled", icon: <ShieldCheck size={16} />, color: config?.deduplicationEnabled ? "text-green-600" : "text-neutral-400" },
    ];

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to disconnect Meta? This will stop all tracking and clear your settings.")) return;
        
        setLoading(true);
        const res = await adminRequest("/meta/disconnect", "POST");
        if (res?.success) {
            toast.success("Meta integration disconnected");
            refresh();
        } else {
            toast.error(res?.message || "Failed to disconnect");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Connection Status Banner */}
            <div className="bg-white p-8 rounded-[3rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-[#1877F2] rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 overflow-hidden">
                        {config?.metaProfilePicture ? (
                            <img src={config.metaProfilePicture} alt="Meta Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Facebook size={40} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold text-[#0a4019]">{config?.metaUserName || "Meta Business"}</h2>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isConnected ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {isConnected ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} 
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                        <p className="text-neutral-500 font-medium">Your store is synchronized with Meta's marketing platform.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => setActiveTab("settings")}
                        className="flex-1 md:flex-none bg-neutral-100 text-[#0a4019] px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all"
                    >
                        <Settings size={18} /> Manage
                    </button>
                    <button 
                        onClick={handleDisconnect}
                        disabled={loading}
                        className="flex-1 md:flex-none border border-red-100 text-red-500 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <LogOut size={18} />}
                        Disconnect
                    </button>
                </div>
            </div>

            {/* Tracking Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-[#0a4019]">
                                {stat.icon}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color}`}>{stat.status}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-bold text-[#0a4019]">Healthy Status</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Assets & Quick Config */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Active Assets Card */}
                <div className="bg-[#0a4019] p-10 rounded-[3rem] text-white shadow-xl shadow-[#0a4019]/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Facebook size={180} />
                    </div>
                    <div className="relative space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Syncing Assets</h3>
                            <p className="text-white/60 text-sm max-w-sm">These assets are currently receiving data from your store.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <AssetItem icon={<Briefcase size={16} />} label="Business" value={config?.businessName || "Not set"} />
                            <AssetItem icon={<Settings size={16} />} label="Ad Account" value={config?.adAccountName || "Not set"} />
                            <AssetItem icon={<Database size={16} />} label="Pixel / Dataset" value={config?.pixelName || "Not set"} />
                            {config?.pageName && <AssetItem icon={<Facebook size={16} />} label="Facebook Page" value={config.pageName} />}
                        </div>

                        <button 
                            onClick={() => setActiveTab("setup")}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-bold text-sm w-full flex items-center justify-center gap-2 backdrop-blur-md transition-all border border-white/10"
                        >
                            Change Assets <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Setup Checklist / Next Steps */}
                <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-[#0a4019] mb-6">Setup Progress</h3>
                        <div className="space-y-6">
                            <CheckItem label="Connect Meta Account" complete={isConnected} />
                            <CheckItem label="Select Tracking Assets" complete={!!config?.pixelId} />
                            <CheckItem label="Enable Conversions API" complete={config?.isCapiEnabled} />
                            <CheckItem label="Verify Event Deduplication" complete={config?.deduplicationEnabled} />
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="text-green-500" size={16} />
                            <p className="text-xs font-bold text-[#0a4019]">Last event: <span className="text-neutral-400">Just now</span></p>
                        </div>
                        <button 
                            onClick={() => setActiveTab("logs")}
                            className="text-xs font-bold text-[#0a4019] hover:underline underline-offset-4 flex items-center gap-1"
                        >
                            View Logs <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Quick Tips */}
            <div className="bg-[#B8A68A]/5 p-8 rounded-[3rem] border border-[#B8A68A]/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B8A68A] shadow-sm">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-[#0a4019]">Optimize with Conversions API</p>
                        <p className="text-xs text-neutral-500">Enable maximum data sharing to help Meta find more customers for your store.</p>
                    </div>
                </div>
                <a href="https://www.facebook.com/business/help/2041148702652965" target="_blank" className="bg-[#0a4019] text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 whitespace-nowrap">
                    Learn More <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}

function AssetItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-white/40">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
            </div>
        </div>
    );
}

function CheckItem({ label, complete }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${complete ? 'bg-green-100 text-green-600' : 'bg-neutral-50 text-neutral-300'}`}>
                {complete ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
            </div>
            <p className={`text-sm font-bold ${complete ? 'text-[#0a4019]' : 'text-neutral-400'}`}>{label}</p>
        </div>
    );
}
