"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    Users,
    TrendingUp,
    Clock,
    Plus,
    MapPin,
    Eye,
    Edit,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for demonstration
const stats = [
    {
        title: "Total Events",
        value: "24",
        change: "+12%",
        changeType: "positive" as const,
        icon: Calendar,
    },
    {
        title: "Total Attendees",
        value: "1,234",
        change: "+8%",
        changeType: "positive" as const,
        icon: Users,
    },
    {
        title: "This Month",
        value: "8",
        change: "+4%",
        changeType: "positive" as const,
        icon: TrendingUp,
    },
    {
        title: "Upcoming",
        value: "5",
        change: "-2%",
        changeType: "negative" as const,
        icon: Clock,
    },
];

const recentEvents = [
    {
        id: 1,
        title: "Tech Conference 2024",
        date: "2024-01-15",
        time: "09:00 AM",
        location: "San Francisco, CA",
        attendees: 150,
        status: "upcoming",
        image: "/api/placeholder/400/200",
    },
    {
        id: 2,
        title: "Design Workshop",
        date: "2024-01-20",
        time: "02:00 PM",
        location: "New York, NY",
        attendees: 75,
        status: "upcoming",
        image: "/api/placeholder/400/200",
    },
    {
        id: 3,
        title: "Marketing Summit",
        date: "2024-01-10",
        time: "10:00 AM",
        location: "Los Angeles, CA",
        attendees: 200,
        status: "completed",
        image: "/api/placeholder/400/200",
    },
    {
        id: 4,
        title: "Startup Pitch Night",
        date: "2024-01-25",
        time: "06:00 PM",
        location: "Austin, TX",
        attendees: 100,
        status: "upcoming",
        image: "/api/placeholder/400/200",
    },
];

const upcomingEvents = [
    {
        id: 1,
        title: "Weekly Team Standup",
        time: "10:00 AM",
        attendees: 12,
    },
    {
        id: 2,
        title: "Client Presentation",
        time: "02:30 PM",
        attendees: 8,
    },
    {
        id: 3,
        title: "Product Demo",
        time: "04:00 PM",
        attendees: 25,
    },
];

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back! Here's what's happening with your events.
                        </p>
                    </div>
                    <Button className="animate-scale-in">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                                    }`}>
                                    {stat.change} from last month
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Events */}
                    <div className="lg:col-span-2">
                        <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                            <CardHeader>
                                <CardTitle>Recent Events</CardTitle>
                                <CardDescription>
                                    Your latest events and their current status
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center space-x-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                                    >
                                        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                            <Calendar className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold">{event.title}</h3>
                                                <Badge
                                                    variant={event.status === "upcoming" ? "default" : "secondary"}
                                                >
                                                    {event.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{event.date} at {event.time}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{event.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users className="h-3 w-3" />
                                                    <span>{event.attendees} attendees</span>
                                                </div>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Event
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Today's Schedule */}
                    <div className="space-y-6">
                        <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
                            <CardHeader>
                                <CardTitle>Today's Schedule</CardTitle>
                                <CardDescription>Your events for today</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {upcomingEvents.map((event, index) => (
                                    <div key={event.id} className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {event.title}
                                            </p>
                                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                <span>{event.time}</span>
                                                <span>•</span>
                                                <span>{event.attendees} attendees</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New Event
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="mr-2 h-4 w-4" />
                                    Manage Attendees
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    View Analytics
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
