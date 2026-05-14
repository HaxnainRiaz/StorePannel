"use client";

import { AlertCircle, CheckCircle2, XCircle, ShieldCheck, Zap, Database, RefreshCw, ExternalLink } from "lucide-react";

export default function MetaDiagnostics({ config }) {
    const isConnected = config?.connectionStatus === 'connected';
    const hasPixel = !!config?.pixelId;
    const hasCapi = !!config?.isCapiEnabled && !!config?.capiAccessTokenEncrypted;
    const sharingLevel = config?.dataSharingLevel || 'standard';

    const checks = [
        {
            id: 'account',
            title: 'Account Connection',
            status: isConnected ? 'success' : 'error',
            message: isConnected ? 'Your Meta account is connected and tokens are valid.' : 'Please connect your Meta account in the Account tab.',
            icon: ShieldCheck
        },
        {
            id: 'pixel',
            title: 'Meta Pixel',
            status: hasPixel ? 'success' : 'error',
            message: hasPixel ? `Pixel ID ${config.pixelId} is configured for browser tracking.` : 'No Pixel ID found. Browser tracking is inactive.',
            icon: Database
        },
        {
            id: 'capi',
            title: 'Conversions API',
            status: hasCapi ? 'success' : (config?.isCapiEnabled ? 'warning' : 'neutral'),
            message: hasCapi ? 'Server-side tracking is active and sending events.' : (config?.isCapiEnabled ? 'CAPI is enabled but access token is missing.' : 'Conversions API is currently disabled.'),
            icon: Zap
        },
        {
            id: 'sharing',
            title: 'Data Sharing Level',
            status: sharingLevel === 'maximum' ? 'success' : (sharingLevel === 'enhanced' ? 'warning' : 'neutral'),
            message: `Current level: ${sharingLevel.toUpperCase()}. ${sharingLevel === 'standard' ? 'Consider upgrading to Enhanced or Maximum for better results.' : ''}`,
            icon: Zap
        }
    ];

    return (
        <div className="max-w-4xl space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#0a4019] mb-6">System Health Check</h2>
                
                <div className="space-y-6">
                    {checks.map((check) => (
                        <div key={check.id} className="flex items-start gap-5 p-6 rounded-3xl border border-neutral-50 bg-neutral-50/30">
                            <div className={`p-3 rounded-2xl ${
                                check.status === 'success' ? 'bg-green-100 text-green-600' : 
                                check.status === 'error' ? 'bg-red-100 text-red-600' : 
                                check.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                                'bg-neutral-100 text-neutral-400'
                            }`}>
                                <check.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-[#0a4019] text-sm">{check.title}</h3>
                                    <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                        check.status === 'success' ? 'bg-green-100 text-green-700' : 
                                        check.status === 'error' ? 'bg-red-100 text-red-700' : 
                                        check.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                                        'bg-neutral-100 text-neutral-500'
                                    }`}>
                                        {check.status}
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-500">{check.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-blue-600" />
                        <h3 className="text-sm font-bold text-[#0a4019] uppercase tracking-widest">Recommendations</h3>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RecommendationItem 
                        title="Deduplication" 
                        desc="Ensure both Pixel and CAPI are enabled for the same Pixel ID to improve match quality." 
                    />
                    <RecommendationItem 
                        title="Event Match Quality" 
                        desc="Increase data sharing to Maximum to send more customer signals like hashed email/phone." 
                    />
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <a 
                    href="https://business.facebook.com/events_manager2/diagnostics" 
                    target="_blank"
                    className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-[#0a4019] transition-all"
                >
                    View Meta Diagnostics <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}

function RecommendationItem({ title, desc }) {
    return (
        <div className="bg-white/60 p-5 rounded-2xl border border-white/80">
            <h4 className="text-xs font-bold text-[#0a4019] mb-1">{title}</h4>
            <p className="text-[10px] text-neutral-500 leading-relaxed">{desc}</p>
        </div>
    );
}
