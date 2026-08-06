"use client";
import BottomBar from "@/components/BottomBar";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAppSelector((s) => s.auth.user);
    const hydrating = useAppSelector((s) => s.auth.hydrating);

    useEffect(() => {
        if (hydrating) return; // Don't redirect during hydration
        if (!user) {
            router.replace("/login");
        }
    }, [user, router, hydrating]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Show loading while hydrating
    if (hydrating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pm-ink via-pm-char to-pm-brown-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="min-h-screen bg-[#07111f] text-slate-100">
                <main className="container mx-auto px-4 pt-24 pb-28 lg:px-6">
                    {children}
                </main>
                <BottomBar />
            </div>
        </>
    );
}