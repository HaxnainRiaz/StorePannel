"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { RefreshCw, ShieldCheck, Key, Play, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MetaCapiManagement({ config, refresh }) {
    const { adminRequest } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [manualToken, setManualToken] = useState("");
    const [showToken, setShowToken] = useState(false);

    const handleSaveToken = async () => {
        if (!manualToken) return toast.error("Token is required");
        
        setLoading(true);
        const res = await adminRequest("/meta/capi-token", "POST", { capiAccessToken: manualToken });
        
        if (res?.success) {
            toast.success("CAPI Token saved and encrypted");
            setManualToken("");
            refresh();
        } else {
            toast.error(res?.message || "Failed to save token");
        }
        setLoading(false);
    };

    const handleTestEvent = async () => {
        setTestLoading(true);
        const res = await adminRequest("/meta/test-event", "POST");
        if (res?.success) {
            toast.success("Test event sent! Check Meta Events Manager in a few minutes.");
        } else {
            toast.error(res?.message || "Test event failed");
        }
        setTestLoading(false);
    };

    const hasToken = !!config?.hasCapiToken;

    return (
        <div className="max-w-4xl space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                        <RefreshCw size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#0a4019]">Conversions API</h2>
                        <p className="text-sm text-neutral-500">Securely send events directly from our server to Meta.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Status Banner */}
                    <div className={`p-6 rounded-3xl border flex items-center justify-between ${hasToken ? 'bg-green-50 border-green-100' : 'bg-neutral-50 border-neutral-100'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasToken ? 'bg-green-500 text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#0a4019]">CAPI Access Token</p>
                                <p className="text-xs text-neutral-500">{hasToken ? 'Token is stored and encrypted' : 'No token provided yet'}</p>
                            </div>
                        </div>
                        {hasToken && (
                            <button 
                                onClick={handleTestEvent}
                                disabled={testLoading}
                                className="bg-white text-[#0a4019] border border-neutral-200 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2"
                            >
                                {testLoading ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                                Send Test Event
                            </button>
                        )}
                    </div>

                    {/* Manual Input */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-[#0a4019] uppercase tracking-widest">Manual Token Setup</h3>
                            <button 
                                onClick={() => setShowToken(!showToken)}
                                className="text-[10px] font-bold text-neutral-400 hover:text-[#0a4019] transition-colors uppercase tracking-widest"
                            >
                                {showToken ? 'Hide' : 'Show'} Input
                            </button>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                <Key size={18} />
                            </div>
                            <input 
                                type={showToken ? "text" : "password"}
                                value={manualToken}
                                onChange={(e) => setManualToken(e.target.value)}
                                placeholder={hasToken ? "Enter new token to overwrite..." : "Paste your CAPI Access Token here"}
                                className="w-full bg-neutral-50 border border-neutral-100 pl-12 pr-4 py-4 rounded-2xl text-sm focus:border-[#0a4019] outline-none transition-all font-mono"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-[10px] text-neutral-400 font-medium"> Tokens are stored in a secure, encrypted vault on our servers.</p>
                            <button 
                                onClick={handleSaveToken}
                                disabled={loading || !manualToken}
                                className="bg-[#0a4019] text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#051712] transition-all shadow-lg shadow-[#0a4019]/20 disabled:opacity-50"
                            >
                                <Save size={16} /> Save Token
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-neutral-900 p-8 rounded-[2rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck size={80} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">How to get a token?</h3>
                    <ol className="space-y-3 text-xs text-white/60 list-decimal ml-4">
                        <li>Go to <strong>Meta Events Manager</strong></li>
                        <li>Select your Pixel / Data Source</li>
                        <li>Click the <strong>Settings</strong> tab</li>
                        <li>Scroll down to <strong>Conversions API</strong></li>
                        <li>Click <strong>Generate Access Token</strong></li>
                    </ol>
                </div>

                <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
                    <div className="flex items-start gap-3 text-blue-800">
                        <AlertTriangle size={20} className="shrink-0" />
                        <div>
                            <p className="text-sm font-bold mb-1">Deduplication is Active</p>
                            <p className="text-[11px] text-blue-600/80 leading-relaxed">
                                Our system automatically generates unique Event IDs for both Browser and Server events. This ensures Meta counts each customer action only once.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
