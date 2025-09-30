"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    Users,
    MapPin,
    Clock,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Copy,
    Share,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-context";
import { eventsService } from "@/lib/services/events";
import { EventWithCreator, EventStatus, EventCategory } from "@/lib/supabase/types";

const categories: (EventCategory | "all")[] = ["all", "conference", "workshop", "summit", "networking", "launch", "seminar", "training", "webinar"];
const statuses: (EventStatus | "all")[] = ["all", "draft", "published", "cancelled", "completed"];

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
    const [selectedStatus, setSelectedStatus] = useState<EventStatus | "all">("published");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [events, setEvents] = useState<EventWithCreator[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await eventsService.getEvents({
                    status: selectedStatus === "all" ? undefined : selectedStatus,
                    category: selectedCategory === "all" ? undefined : selectedCategory,
                    search: searchQuery || undefined,
                });
                setEvents(result.events);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Failed to load events. Please try again.");
                toast.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [selectedCategory, selectedStatus, searchQuery]);

    const filteredEvents = events.filter((event) => {
        const matchesSearch = searchQuery === "" ||
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    const getStatusColor = (status: EventStatus) => {
        switch (status) {
            case "published":
                return "default";
            case "draft":
                return "secondary";
            case "completed":
                return "outline";
            case "cancelled":
                return "destructive";
            default:
                return "outline";
        }
    };

    const formatEventDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const EventCard = ({ event }: { event: EventWithCreator }) => {
        const { date, time } = formatEventDateTime(event.date_time);
        const attendeeCount = event.event_analytics?.[0]?.registrations || 0;

        return (
            <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    {event.image_url ? (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Calendar className="h-12 w-12 text-primary" />
                    )}
                </div>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {event.description || "No description available"}
                            </CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                {user && user.id === event.created_by && (
                                    <>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Event
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuItem>
                                    <Share className="mr-2 h-4 w-4" />
                                    Share
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Badge variant={getStatusColor(event.status)} className="w-fit">
                        {event.status}
                    </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{date} at {time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{attendeeCount}/{event.max_attendees} attendees</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">
                            by {event.profiles?.full_name || 'Unknown'}
                        </span>
                        <Button size="sm" variant="outline">
                            View Details
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                        <p className="text-muted-foreground">
                            Manage and organize all your events in one place.
                        </p>
                    </div>
                    <Button
                        className="animate-scale-in"
                        onClick={() => router.push('/events/create')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                </div>

                {/* Filters */}
                <Card className="animate-slide-up">
                    <CardContent className="pt-6">
                        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Events Grid */}
                <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                    {loading ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                                <p className="text-muted-foreground">Loading events...</p>
                            </CardContent>
                        </Card>
                    ) : error ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Error loading events</h3>
                                <p className="text-muted-foreground text-center mb-4">{error}</p>
                                <Button onClick={() => window.location.reload()}>
                                    Try Again
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Tabs defaultValue="all" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="all">All Events ({filteredEvents.length})</TabsTrigger>
                                <TabsTrigger value="published">
                                    Published ({filteredEvents.filter(e => e.status === "published").length})
                                </TabsTrigger>
                                <TabsTrigger value="draft">
                                    Draft ({filteredEvents.filter(e => e.status === "draft").length})
                                </TabsTrigger>
                                <TabsTrigger value="completed">
                                    Completed ({filteredEvents.filter(e => e.status === "completed").length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="space-y-4">
                                {filteredEvents.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12">
                                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No events found</h3>
                                            <p className="text-muted-foreground text-center mb-4">
                                                Try adjusting your search criteria or create a new event.
                                            </p>
                                            <Button onClick={() => router.push('/events/create')}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Your First Event
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {filteredEvents.map((event, index) => (
                                            <div
                                                key={event.id}
                                                className="animate-slide-up"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <EventCard event={event} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="published" className="space-y-4">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredEvents
                                        .filter(event => event.status === "published")
                                        .map((event, index) => (
                                            <div
                                                key={event.id}
                                                className="animate-slide-up"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <EventCard event={event} />
                                            </div>
                                        ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="draft" className="space-y-4">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredEvents
                                        .filter(event => event.status === "draft")
                                        .map((event, index) => (
                                            <div
                                                key={event.id}
                                                className="animate-slide-up"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <EventCard event={event} />
                                            </div>
                                        ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="completed" className="space-y-4">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredEvents
                                        .filter(event => event.status === "completed")
                                        .map((event, index) => (
                                            <div
                                                key={event.id}
                                                className="animate-slide-up"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <EventCard event={event} />
                                            </div>
                                        ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
