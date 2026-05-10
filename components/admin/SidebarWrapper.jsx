"use client";

import Sidebar from "./Sidebar";

export default function SidebarWrapper({ children, isLoginPage }) {
    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#6B6B6B] font-body font-sans">
            {!isLoginPage && <Sidebar />}
            <main className={!isLoginPage ? "transition-all duration-300 md:ml-64 min-h-screen p-6 md:p-10" : ""}>
                <div className={!isLoginPage ? "max-w-7xl mx-auto animate-fadeIn" : ""}>
                    {children}
                </div>
            </main>
        </div>
    );
}
