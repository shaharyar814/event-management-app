# Supabase Setup Guide

This guide will help you set up Supabase for your EventHub application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: EventHub
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Project API Keys** → **anon public** (starts with `eyJ...`)
   - **Project API Keys** → **service_role** (starts with `eyJ...`)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. Replace the placeholder values with your actual Supabase credentials

## 4. Set Up the Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `src/lib/supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

This will create:

- **profiles** table (user profiles)
- **events** table (event data)
- **event_attendees** table (event registrations)
- **event_analytics** table (event metrics)
- Row Level Security (RLS) policies
- Automatic triggers for profile creation and timestamps

## 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your **Site URL**:
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)

## 6. Enable Email Authentication

1. In **Authentication** → **Settings**
2. Make sure **Enable email confirmations** is turned on
3. Configure email templates if desired
4. For development, you can disable email confirmation temporarily

## 7. Optional: Set Up Social Authentication

To enable social logins (Google, GitHub, etc.):

1. Go to **Authentication** → **Providers**
2. Enable desired providers
3. Configure OAuth credentials for each provider
4. Update redirect URLs accordingly

## 8. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Try creating an account at `/auth/register`
4. Check your Supabase dashboard to see if the user was created
5. Try logging in at `/auth/login`

## 9. Database Policies (Already Configured)

The schema includes these security policies:

### Profiles

- Users can only view/edit their own profile
- Profiles are automatically created when users sign up

### Events

- Anyone can view published events
- Users can only create/edit/delete their own events
- Draft events are only visible to their creators

### Event Attendees

- Users can register for events
- Event creators can see their event attendees
- Users can manage their own registrations

### Analytics

- Only event creators can view their event analytics
- Analytics records are automatically created for new events

## 10. Production Deployment

When deploying to production:

1. Update environment variables in your hosting platform
2. Update Site URL and Redirect URLs in Supabase
3. Consider enabling additional security features
4. Set up proper email templates
5. Configure custom SMTP if needed

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Check your environment variables
2. **"Row Level Security policy violation"**: Check RLS policies
3. **"Email not confirmed"**: Check email confirmation settings
4. **"Redirect URL mismatch"**: Update redirect URLs in Supabase

### Useful SQL Queries

```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- View RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check user profiles
SELECT * FROM profiles;

-- Check events
SELECT * FROM events;
```

## Next Steps

Once Supabase is set up:

1. Test user registration and login
2. Create some test events
3. Test event registration
4. Explore the analytics dashboard
5. Customize the application as needed

Your EventHub application is now fully integrated with Supabase for authentication and database functionality!
