import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// For client components (browser)
export const createClientSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables:', {
            url: !!supabaseUrl,
            key: !!supabaseKey
        });
        throw new Error('Missing Supabase environment variables');
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}

// For direct client usage
export const supabase = (() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables:', {
            url: !!supabaseUrl,
            key: !!supabaseKey
        });
        throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseKey);
})()
