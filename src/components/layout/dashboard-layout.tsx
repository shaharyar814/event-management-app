"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { AuthLoading } from "@/components/auth/auth-loading";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { loading, user } = useAuth();
    const router = useRouter();

    if (loading) {
        return <AuthLoading />;
    }

    // If not loading but no user, redirect to login
    if (!user) {
        router.push('/auth/login');
        return <AuthLoading />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 overflow-hidden">
                    <div className="container mx-auto p-6 max-w-screen-2xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
