"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, Eye, EyeOff, TreeDeciduous } from "lucide-react";
import { Input, Button } from "@/components/ui";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#0a4019] text-[#d3d3d3] mb-4 shadow-xl">
                        <TreeDeciduous size={32} />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-[#0a4019] tracking-widest uppercase">Luminelle</h1>
                    <p className="text-[#B8A68A] font-medium tracking-[0.2em] uppercase text-xs mt-2">Administrative Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#F5F3F0] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d3d3d3] to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            icon={Mail}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                icon={Lock}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-[42px] text-neutral-400 hover:text-[#0a4019] transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold text-center animate-shake uppercase tracking-widest">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-5 rounded-2xl shadow-xl shadow-[#0a4019]/20 mt-4"
                        >
                            Sign Into Dashboard
                        </Button>
                    </form>


                </div>

                <div className="text-center mt-8">
                    <p className="text-xs text-neutral-400">© 2026 Luminelle. Secure Environment.</p>
                </div>
            </div>
        </div>
    );
}
