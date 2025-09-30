import { createClientSupabase } from '@/lib/supabase/client';
import { Profile, UpdateProfile } from '@/lib/supabase/types';

export class ProfilesService {
    private supabase = createClientSupabase();

    // Get user profile by ID
    async getProfile(userId: string): Promise<Profile | null> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Profile not found
            }
            throw new Error(`Failed to fetch profile: ${error.message}`);
        }

        return data;
    }

    // Update user profile
    async updateProfile(userId: string, updates: UpdateProfile): Promise<Profile> {
        const { data, error } = await this.supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }

        return data;
    }

    // Upload avatar image
    async uploadAvatar(userId: string, file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await this.supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            throw new Error(`Failed to upload avatar: ${uploadError.message}`);
        }

        const { data } = this.supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Update profile with new avatar URL
        await this.updateProfile(userId, { avatar_url: data.publicUrl });

        return data.publicUrl;
    }

    // Delete avatar
    async deleteAvatar(userId: string): Promise<void> {
        // Remove from storage
        const { error: deleteError } = await this.supabase.storage
            .from('avatars')
            .remove([`avatars/${userId}`]);

        if (deleteError) {
            console.error('Failed to delete avatar from storage:', deleteError);
        }

        // Update profile to remove avatar URL
        await this.updateProfile(userId, { avatar_url: null });
    }

    // Get user's event statistics
    async getUserStats(userId: string) {
        const { data, error } = await this.supabase
            .rpc('get_user_event_stats', { user_id: userId });

        if (error) {
            throw new Error(`Failed to fetch user stats: ${error.message}`);
        }

        return data[0] || {
            total_events: 0,
            published_events: 0,
            draft_events: 0,
            total_registrations: 0,
            total_attendees: 0,
            total_revenue: 0,
            this_month_events: 0,
        };
    }

    // Get user's upcoming events
    async getUserUpcomingEvents(userId: string) {
        const { data, error } = await this.supabase
            .rpc('get_user_upcoming_events', { user_id: userId });

        if (error) {
            throw new Error(`Failed to fetch upcoming events: ${error.message}`);
        }

        return data || [];
    }
}

// Export a singleton instance
export const profilesService = new ProfilesService();
