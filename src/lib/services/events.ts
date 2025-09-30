import { createClientSupabase } from '@/lib/supabase/client';
import { Event, InsertEvent, UpdateEvent, EventWithCreator, EventWithAnalytics } from '@/lib/supabase/types';

export class EventsService {
    private supabase = createClientSupabase();

    // Get all published events with pagination and filtering
    async getEvents(options: {
        page?: number;
        limit?: number;
        category?: string;
        status?: string;
        search?: string;
        userId?: string;
    } = {}) {
        const {
            page = 1,
            limit = 12,
            category,
            status = 'published',
            search,
            userId
        } = options;

        let query = this.supabase
            .from('events')
            .select(`
        *,
        event_analytics (
          views,
          registrations,
          attendees,
          rating
        )
      `)
            .order('created_at', { ascending: false });

        // Apply filters
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        if (userId) {
            query = query.eq('created_by', userId);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            throw new Error(`Failed to fetch events: ${error.message}`);
        }

        if (!data || data.length === 0) {
            return {
                events: [],
                totalCount: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
                currentPage: page,
            };
        }

        // Get unique creator IDs
        const creatorIds = [...new Set(data.map(event => event.created_by))];

        // Fetch profiles for all creators
        const { data: profiles, error: profilesError } = await this.supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', creatorIds);

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
        }

        // Create a map of profiles for quick lookup
        const profilesMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);

        // Merge events with their creator profiles
        const eventsWithCreators = data.map(event => ({
            ...event,
            profiles: profilesMap.get(event.created_by) || null
        }));

        return {
            events: eventsWithCreators as EventWithCreator[],
            totalCount: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
            currentPage: page,
        };
    }

    // Get a single event by ID
    async getEventById(id: string) {
        const { data: event, error } = await this.supabase
            .from('events')
            .select(`
        *,
        event_analytics (
          views,
          registrations,
          attendees,
          revenue,
          rating,
          feedback_count
        ),
        event_attendees (
          id,
          user_id,
          registered_at,
          attended
        )
      `)
            .eq('id', id)
            .single();

        if (error) {
            throw new Error(`Failed to fetch event: ${error.message}`);
        }

        if (!event) {
            throw new Error('Event not found');
        }

        // Fetch creator profile
        const { data: creatorProfile } = await this.supabase
            .from('profiles')
            .select('id, full_name, avatar_url, email')
            .eq('id', event.created_by)
            .single();

        // Fetch attendee profiles if there are attendees
        let attendeesWithProfiles = event.event_attendees;
        if (event.event_attendees && event.event_attendees.length > 0) {
            const attendeeIds = event.event_attendees.map(a => a.user_id);
            const { data: attendeeProfiles } = await this.supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', attendeeIds);

            const profilesMap = new Map(attendeeProfiles?.map(profile => [profile.id, profile]) || []);

            attendeesWithProfiles = event.event_attendees.map(attendee => ({
                ...attendee,
                profiles: profilesMap.get(attendee.user_id) || null
            }));
        }

        return {
            ...event,
            profiles: creatorProfile,
            event_attendees: attendeesWithProfiles
        };
    }

    // Create a new event
    async createEvent(eventData: InsertEvent) {
        const { data, error } = await this.supabase
            .from('events')
            .insert(eventData)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create event: ${error.message}`);
        }

        return data as Event;
    }

    // Update an event
    async updateEvent(id: string, updates: UpdateEvent) {
        const { data, error } = await this.supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update event: ${error.message}`);
        }

        return data as Event;
    }

    // Delete an event
    async deleteEvent(id: string) {
        const { error } = await this.supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete event: ${error.message}`);
        }

        return true;
    }

    // Register for an event
    async registerForEvent(eventId: string, userId: string) {
        const { data, error } = await this.supabase
            .from('event_attendees')
            .insert({
                event_id: eventId,
                user_id: userId,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to register for event: ${error.message}`);
        }

        // Update analytics
        await this.updateEventAnalytics(eventId, { registrations: 1 });

        return data;
    }

    // Unregister from an event
    async unregisterFromEvent(eventId: string, userId: string) {
        const { error } = await this.supabase
            .from('event_attendees')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', userId);

        if (error) {
            throw new Error(`Failed to unregister from event: ${error.message}`);
        }

        // Update analytics
        await this.updateEventAnalytics(eventId, { registrations: -1 });

        return true;
    }

    // Check if user is registered for an event
    async isUserRegistered(eventId: string, userId: string) {
        const { data, error } = await this.supabase
            .from('event_attendees')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to check registration: ${error.message}`);
        }

        return !!data;
    }

    // Get user's registered events
    async getUserRegisteredEvents(userId: string) {
        const { data, error } = await this.supabase
            .from('event_attendees')
            .select(`
        *,
        events (*)
      `)
            .eq('user_id', userId)
            .order('registered_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch registered events: ${error.message}`);
        }

        if (!data || data.length === 0) {
            return [];
        }

        // Get unique creator IDs from the events
        const creatorIds = [...new Set(data.map(item => item.events?.created_by).filter(Boolean))];

        // Fetch profiles for all creators
        const { data: profiles } = await this.supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', creatorIds);

        // Create a map of profiles for quick lookup
        const profilesMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);

        // Merge events with their creator profiles
        const registrationsWithProfiles = data.map(registration => ({
            ...registration,
            events: registration.events ? {
                ...registration.events,
                profiles: profilesMap.get(registration.events.created_by) || null
            } : null
        }));

        return registrationsWithProfiles;
    }

    // Get events created by user
    async getUserCreatedEvents(userId: string) {
        const { data, error } = await this.supabase
            .from('events')
            .select(`
        *,
        event_analytics (
          views,
          registrations,
          attendees,
          revenue,
          rating
        )
      `)
            .eq('created_by', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch created events: ${error.message}`);
        }

        return data as EventWithAnalytics[];
    }

    // Update event analytics
    private async updateEventAnalytics(eventId: string, updates: {
        views?: number;
        registrations?: number;
        attendees?: number;
        revenue?: number;
    }) {
        const { error } = await this.supabase.rpc('update_event_analytics', {
            event_id: eventId,
            view_increment: updates.views || 0,
            registration_increment: updates.registrations || 0,
            attendee_increment: updates.attendees || 0,
            revenue_increment: updates.revenue || 0,
        });

        if (error) {
            console.error('Failed to update analytics:', error);
        }
    }

    // Increment event views
    async incrementEventViews(eventId: string) {
        await this.updateEventAnalytics(eventId, { views: 1 });
    }

    // Get event statistics for dashboard
    async getEventStatistics(userId: string) {
        const { data, error } = await this.supabase
            .from('events')
            .select(`
        id,
        status,
        created_at,
        event_analytics (
          registrations,
          attendees,
          revenue
        )
      `)
            .eq('created_by', userId);

        if (error) {
            throw new Error(`Failed to fetch event statistics: ${error.message}`);
        }

        const stats = {
            totalEvents: data.length,
            publishedEvents: data.filter(e => e.status === 'published').length,
            draftEvents: data.filter(e => e.status === 'draft').length,
            totalRegistrations: data.reduce((sum, e) => sum + (e.event_analytics?.registrations || 0), 0),
            totalAttendees: data.reduce((sum, e) => sum + (e.event_analytics?.attendees || 0), 0),
            totalRevenue: data.reduce((sum, e) => sum + (e.event_analytics?.revenue || 0), 0),
            thisMonthEvents: data.filter(e => {
                const eventDate = new Date(e.created_at);
                const now = new Date();
                return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
            }).length,
        };

        return stats;
    }
}

// Export a singleton instance
export const eventsService = new EventsService();
