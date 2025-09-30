"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Image as ImageIcon,
    Save,
    Eye,
    ArrowLeft,
    Upload,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-context";
import { eventsService } from "@/lib/services/events";
import { EventCategory } from "@/lib/supabase/types";

const eventSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    location: z.string().min(1, "Location is required"),
    maxAttendees: z.number().min(1, "Maximum attendees must be at least 1").max(10000, "Maximum attendees cannot exceed 10,000"),
    price: z.number().min(0, "Price cannot be negative"),
    tags: z.array(z.string()).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const categories: { value: EventCategory; label: string }[] = [
    { value: "conference", label: "Conference" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "networking", label: "Networking" },
    { value: "summit", label: "Summit" },
    { value: "launch", label: "Product Launch" },
    { value: "training", label: "Training" },
    { value: "webinar", label: "Webinar" },
];

export default function CreateEventPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const form = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            date: "",
            time: "",
            location: "",
            maxAttendees: 50,
            price: 0,
            tags: [],
        },
    });

    const onSubmit = async (data: EventFormData) => {
        if (!user) {
            toast.error("You must be logged in to create an event.");
            return;
        }

        setIsLoading(true);
        try {
            // Combine date and time into a single datetime string
            const dateTime = new Date(`${data.date}T${data.time}`).toISOString();

            const eventData = {
                title: data.title,
                description: data.description,
                category: data.category as EventCategory,
                date_time: dateTime,
                location: data.location,
                max_attendees: data.maxAttendees,
                price: data.price,
                tags: tags,
                image_url: uploadedImage,
                created_by: user.id,
                status: 'draft' as const, // Start as draft
            };

            const createdEvent = await eventsService.createEvent(eventData);

            toast.success("Event created successfully!");

            // Reset form
            form.reset();
            setTags([]);
            setUploadedImage(null);

            // Navigate to events page or the created event
            router.push('/events');
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error("Failed to create event. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const addTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Redirect if not authenticated
    if (!user) {
        router.push('/auth/login');
        return null;
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
                        <p className="text-muted-foreground">
                            Fill in the details below to create your event.
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <Card className="animate-slide-up">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5" />
                                            <span>Basic Information</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Enter the basic details about your event.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Event Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter event title..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe your event..."
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Provide a detailed description of your event.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories.map((category) => (
                                                                <SelectItem key={category.value} value={category.value}>
                                                                    {category.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Date & Time */}
                                <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Clock className="h-5 w-5" />
                                            <span>Date & Time</span>
                                        </CardTitle>
                                        <CardDescription>
                                            When will your event take place?
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="date"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Date</FormLabel>
                                                        <FormControl>
                                                            <Input type="date" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="time"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Time</FormLabel>
                                                        <FormControl>
                                                            <Input type="time" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Location & Capacity */}
                                <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <MapPin className="h-5 w-5" />
                                            <span>Location & Capacity</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Where will your event be held and how many people can attend?
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter event location..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="maxAttendees"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Maximum Attendees</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max="10000"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Price ($)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Set to 0 for free events
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tags */}
                                <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                                    <CardHeader>
                                        <CardTitle>Tags</CardTitle>
                                        <CardDescription>
                                            Add tags to help people discover your event.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex space-x-2">
                                            <Input
                                                placeholder="Add a tag..."
                                                value={currentTag}
                                                onChange={(e) => setCurrentTag(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                            />
                                            <Button type="button" variant="outline" onClick={addTag}>
                                                Add
                                            </Button>
                                        </div>
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                                                        <span>{tag}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(tag)}
                                                            className="ml-1 hover:text-destructive"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Image Upload */}
                                <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <ImageIcon className="h-5 w-5" />
                                            <span>Event Image</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Upload an image for your event.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {uploadedImage ? (
                                                <div className="relative">
                                                    <img
                                                        src={uploadedImage}
                                                        alt="Event preview"
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => setUploadedImage(null)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Click to upload an image
                                                    </p>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                        id="image-upload"
                                                    />
                                                    <Label htmlFor="image-upload" className="cursor-pointer">
                                                        <Button type="button" variant="outline" size="sm">
                                                            Choose File
                                                        </Button>
                                                    </Label>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save as Draft
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            disabled={isLoading}
                                            onClick={async () => {
                                                if (!user) {
                                                    toast.error("You must be logged in to publish an event.");
                                                    return;
                                                }

                                                // Validate form before publishing
                                                const isValid = await form.trigger();
                                                if (!isValid) {
                                                    toast.error("Please fill in all required fields correctly.");
                                                    return;
                                                }

                                                const formData = form.getValues();
                                                setIsLoading(true);
                                                try {
                                                    const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
                                                    const eventData = {
                                                        title: formData.title,
                                                        description: formData.description,
                                                        category: formData.category as EventCategory,
                                                        date_time: dateTime,
                                                        location: formData.location,
                                                        max_attendees: formData.maxAttendees,
                                                        price: formData.price,
                                                        tags: tags,
                                                        image_url: uploadedImage,
                                                        created_by: user.id,
                                                        status: 'published' as const,
                                                    };

                                                    await eventsService.createEvent(eventData);
                                                    toast.success("Event published successfully!");
                                                    form.reset();
                                                    setTags([]);
                                                    setUploadedImage(null);
                                                    router.push('/events');
                                                } catch (error) {
                                                    console.error("Error publishing event:", error);
                                                    toast.error("Failed to publish event. Please try again.");
                                                } finally {
                                                    setIsLoading(false);
                                                }
                                            }}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Publish Event
                                        </Button>
                                        <Separator />
                                        <Button type="button" variant="ghost" className="w-full">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Preview
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </DashboardLayout>
    );
}
