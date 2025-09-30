"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    MapPin,
    Clock,
    Download,
    Filter,
    Eye,
} from "lucide-react";

// Mock data for analytics
const overviewStats = [
    {
        title: "Total Events",
        value: "24",
        change: "+12%",
        changeType: "positive" as const,
        icon: Calendar,
        description: "Events created this month",
    },
    {
        title: "Total Attendees",
        value: "1,234",
        change: "+8%",
        changeType: "positive" as const,
        icon: Users,
        description: "Registered attendees",
    },
    {
        title: "Avg. Attendance Rate",
        value: "87%",
        change: "+5%",
        changeType: "positive" as const,
        icon: TrendingUp,
        description: "Show-up rate",
    },
    {
        title: "Revenue",
        value: "$12,450",
        change: "-3%",
        changeType: "negative" as const,
        icon: BarChart3,
        description: "Total revenue generated",
    },
];

const topEvents = [
    {
        id: 1,
        title: "Tech Conference 2024",
        attendees: 150,
        revenue: "$4,500",
        rating: 4.8,
        status: "completed",
    },
    {
        id: 2,
        title: "Marketing Summit",
        attendees: 200,
        revenue: "$6,000",
        rating: 4.6,
        status: "completed",
    },
    {
        id: 3,
        title: "Design Workshop",
        attendees: 75,
        revenue: "$1,500",
        rating: 4.9,
        status: "upcoming",
    },
    {
        id: 4,
        title: "Startup Pitch Night",
        attendees: 100,
        revenue: "$0",
        rating: 4.7,
        status: "upcoming",
    },
];

const monthlyData = [
    { month: "Jan", events: 8, attendees: 320, revenue: 4200 },
    { month: "Feb", events: 12, attendees: 480, revenue: 6800 },
    { month: "Mar", events: 15, attendees: 600, revenue: 8500 },
    { month: "Apr", events: 10, attendees: 400, revenue: 5200 },
    { month: "May", events: 18, attendees: 720, revenue: 9600 },
    { month: "Jun", events: 14, attendees: 560, revenue: 7400 },
];

const locationStats = [
    { location: "San Francisco, CA", events: 8, attendees: 320 },
    { location: "New York, NY", events: 6, attendees: 240 },
    { location: "Los Angeles, CA", events: 4, attendees: 160 },
    { location: "Austin, TX", events: 3, attendees: 120 },
    { location: "Seattle, WA", events: 3, attendees: 90 },
];

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                        <p className="text-muted-foreground">
                            Insights and performance metrics for your events.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Select defaultValue="30">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Time period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 days</SelectItem>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="90">Last 3 months</SelectItem>
                                <SelectItem value="365">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {overviewStats.map((stat, index) => (
                        <Card key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="flex items-center space-x-2 text-xs">
                                    <span className={`flex items-center ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {stat.changeType === "positive" ? (
                                            <TrendingUp className="mr-1 h-3 w-3" />
                                        ) : (
                                            <TrendingDown className="mr-1 h-3 w-3" />
                                        )}
                                        {stat.change}
                                    </span>
                                    <span className="text-muted-foreground">from last month</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Monthly Trends */}
                        <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                            <CardHeader>
                                <CardTitle>Monthly Trends</CardTitle>
                                <CardDescription>
                                    Event performance over the last 6 months
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="events" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="events">Events</TabsTrigger>
                                        <TabsTrigger value="attendees">Attendees</TabsTrigger>
                                        <TabsTrigger value="revenue">Revenue</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="events" className="space-y-4">
                                        <div className="h-[300px] flex items-end justify-between space-x-2 p-4 bg-muted/30 rounded-lg">
                                            {monthlyData.map((data, index) => (
                                                <div key={data.month} className="flex flex-col items-center space-y-2">
                                                    <div
                                                        className="bg-primary rounded-t-sm transition-all hover:bg-primary/80"
                                                        style={{
                                                            height: `${(data.events / Math.max(...monthlyData.map(d => d.events))) * 200}px`,
                                                            width: "40px",
                                                        }}
                                                    />
                                                    <span className="text-xs text-muted-foreground">{data.month}</span>
                                                    <span className="text-xs font-medium">{data.events}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="attendees" className="space-y-4">
                                        <div className="h-[300px] flex items-end justify-between space-x-2 p-4 bg-muted/30 rounded-lg">
                                            {monthlyData.map((data, index) => (
                                                <div key={data.month} className="flex flex-col items-center space-y-2">
                                                    <div
                                                        className="bg-blue-500 rounded-t-sm transition-all hover:bg-blue-400"
                                                        style={{
                                                            height: `${(data.attendees / Math.max(...monthlyData.map(d => d.attendees))) * 200}px`,
                                                            width: "40px",
                                                        }}
                                                    />
                                                    <span className="text-xs text-muted-foreground">{data.month}</span>
                                                    <span className="text-xs font-medium">{data.attendees}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="revenue" className="space-y-4">
                                        <div className="h-[300px] flex items-end justify-between space-x-2 p-4 bg-muted/30 rounded-lg">
                                            {monthlyData.map((data, index) => (
                                                <div key={data.month} className="flex flex-col items-center space-y-2">
                                                    <div
                                                        className="bg-green-500 rounded-t-sm transition-all hover:bg-green-400"
                                                        style={{
                                                            height: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 200}px`,
                                                            width: "40px",
                                                        }}
                                                    />
                                                    <span className="text-xs text-muted-foreground">{data.month}</span>
                                                    <span className="text-xs font-medium">${data.revenue}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Top Locations */}
                        <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>Top Locations</span>
                                </CardTitle>
                                <CardDescription>
                                    Most popular event locations
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {locationStats.map((location, index) => (
                                    <div key={location.location} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{location.location}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {location.events} events
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{location.attendees}</p>
                                            <p className="text-sm text-muted-foreground">attendees</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Top Performing Events */}
                        <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
                            <CardHeader>
                                <CardTitle>Top Events</CardTitle>
                                <CardDescription>
                                    Best performing events this month
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topEvents.map((event, index) => (
                                    <div key={event.id} className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm leading-none">
                                                    {event.title}
                                                </p>
                                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    <span>{event.attendees} attendees</span>
                                                </div>
                                            </div>
                                            <Badge variant={event.status === "completed" ? "secondary" : "default"}>
                                                {event.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Revenue: {event.revenue}</span>
                                            <span className="text-muted-foreground">★ {event.rating}</span>
                                        </div>
                                        {index < topEvents.length - 1 && <div className="border-b border-border/50" />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="animate-slide-up" style={{ animationDelay: "700ms" }}>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Detailed Report
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Analytics
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Custom Filters
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Performance Insights */}
                        <Card className="animate-slide-up" style={{ animationDelay: "800ms" }}>
                            <CardHeader>
                                <CardTitle>Insights</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                            Great Performance
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                        Your events have 87% attendance rate, which is above average.
                                    </p>
                                </div>

                                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Peak Time
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                        Most successful events are scheduled between 2-4 PM.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
