export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    bio: string | null
                    website: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    website?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    website?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            events: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    category: EventCategory
                    status: EventStatus
                    date_time: string
                    location: string
                    max_attendees: number
                    price: number
                    image_url: string | null
                    tags: string[]
                    created_by: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    category: EventCategory
                    status?: EventStatus
                    date_time: string
                    location: string
                    max_attendees?: number
                    price?: number
                    image_url?: string | null
                    tags?: string[]
                    created_by: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    category?: EventCategory
                    status?: EventStatus
                    date_time?: string
                    location?: string
                    max_attendees?: number
                    price?: number
                    image_url?: string | null
                    tags?: string[]
                    created_by?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "events_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            event_attendees: {
                Row: {
                    id: string
                    event_id: string
                    user_id: string
                    registered_at: string
                    attended: boolean
                    attended_at: string | null
                }
                Insert: {
                    id?: string
                    event_id: string
                    user_id: string
                    registered_at?: string
                    attended?: boolean
                    attended_at?: string | null
                }
                Update: {
                    id?: string
                    event_id?: string
                    user_id?: string
                    registered_at?: string
                    attended?: boolean
                    attended_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "event_attendees_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "event_attendees_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            event_analytics: {
                Row: {
                    id: string
                    event_id: string
                    views: number
                    registrations: number
                    attendees: number
                    revenue: number
                    rating: number
                    feedback_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    views?: number
                    registrations?: number
                    attendees?: number
                    revenue?: number
                    rating?: number
                    feedback_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    views?: number
                    registrations?: number
                    attendees?: number
                    revenue?: number
                    rating?: number
                    feedback_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "event_analytics_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: true
                        referencedRelation: "events"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            event_status: EventStatus
            event_category: EventCategory
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Custom types
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'
export type EventCategory = 'conference' | 'workshop' | 'seminar' | 'networking' | 'summit' | 'launch' | 'training' | 'webinar'

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type EventAttendee = Database['public']['Tables']['event_attendees']['Row']
export type EventAnalytics = Database['public']['Tables']['event_analytics']['Row']

export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type InsertEvent = Database['public']['Tables']['events']['Insert']
export type InsertEventAttendee = Database['public']['Tables']['event_attendees']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateEvent = Database['public']['Tables']['events']['Update']
export type UpdateEventAttendee = Database['public']['Tables']['event_attendees']['Update']

// Extended types with relations
export type EventWithCreator = Event & {
    profiles: Profile
}

export type EventWithAnalytics = Event & {
    event_analytics: EventAnalytics
}

export type EventWithAttendees = Event & {
    event_attendees: EventAttendee[]
}

export type FullEvent = Event & {
    profiles: Profile
    event_analytics: EventAnalytics
    event_attendees: EventAttendee[]
}
