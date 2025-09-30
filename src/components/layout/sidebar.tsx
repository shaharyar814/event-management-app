"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    LayoutDashboard,
    Plus,
    Settings,
    Users,
    BarChart3,
    Clock,
    MapPin,
    Star,
    Archive,
    X,
} from "lucide-react";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Events",
        href: "/events",
        icon: Calendar,
        badge: "12",
    },
    {
        name: "Create Event",
        href: "/events/create",
        icon: Plus,
    },
    {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
    },
    {
        name: "Attendees",
        href: "/attendees",
        icon: Users,
    },
];

const quickActions = [
    {
        name: "Upcoming Events",
        href: "/events?filter=upcoming",
        icon: Clock,
        count: 5,
    },
    {
        name: "My Events",
        href: "/events?filter=my-events",
        icon: Star,
        count: 8,
    },
    {
        name: "Venues",
        href: "/venues",
        icon: MapPin,
        count: 3,
    },
    {
        name: "Archived",
        href: "/events?filter=archived",
        icon: Archive,
        count: 15,
    },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-full w-64 transform border-r border-border bg-card transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Mobile close button */}
                    <div className="flex h-16 items-center justify-between px-6 md:hidden">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <span className="font-bold">EventHub</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                            isActive
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground"
                                        )}
                                        onClick={onClose}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <Badge variant="secondary" className="ml-auto">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <Separator className="my-4" />

                        {/* Quick Actions */}
                        <div className="space-y-1">
                            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Quick Access
                            </h3>
                            {quickActions.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                    onClick={onClose}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </div>
                                    <Badge variant="outline" className="ml-auto">
                                        {item.count}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Bottom section */}
                    <div className="border-t border-border p-3">
                        <Link
                            href="/settings"
                            className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            onClick={onClose}
                        >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
