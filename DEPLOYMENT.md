# 🚀 Deployment Guide - EventHub

This guide will help you deploy your EventHub application to Vercel with Supabase backend.

## 📋 Prerequisites

Before deploying, ensure you have:

- [x] A Vercel account
- [x] A Supabase project set up
- [x] Your Supabase database schema and functions deployed
- [x] Environment variables ready

## 🔧 Environment Variables

### Required Environment Variables

Create these environment variables in your Vercel project settings:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Analytics & Monitoring
NEXT_PUBLIC_VERCEL_URL=your-vercel-domain.vercel.app
```

### How to Get Supabase Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API keys** → `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 🗄️ Database Setup

### 1. Run Database Schema

Execute the SQL files in your Supabase SQL Editor:

```sql
-- 1. First, run the schema
-- Copy and paste contents from: src/lib/supabase/schema.sql

-- 2. Then, run the functions
-- Copy and paste contents from: src/lib/supabase/functions.sql
```

### 2. Enable Row Level Security (RLS)

The schema file automatically enables RLS and creates policies. Verify in your Supabase dashboard:

- Go to **Authentication** → **Policies**
- Ensure policies are created for: `profiles`, `events`, `event_attendees`, `event_analytics`

### 3. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure **Site URL**: `https://your-domain.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

### Option 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Choose **"Import Git Repository"**
4. Select your repository
5. Configure build settings (auto-detected)
6. Add environment variables
7. Click **"Deploy"**

## ⚙️ Build Configuration

The application is configured with:

- **Framework**: Next.js 15
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x (recommended)

## 🔒 Security Configuration

The deployment includes:

- **Security Headers**: XSS protection, content type options, frame options
- **CORS Configuration**: Proper API access control
- **Environment Validation**: Required variables checked at build time
- **Console Removal**: Console logs removed in production

## 📊 Performance Optimizations

- **Image Optimization**: WebP/AVIF formats, Supabase storage support
- **Bundle Optimization**: SWC minification, tree shaking
- **Caching**: Optimized cache headers for static assets
- **Standalone Output**: Minimal Docker-ready build

## 🧪 Testing Deployment

### Pre-deployment Checklist

- [ ] Run `npm run build` locally to test build
- [ ] Run `npm run type-check` to verify TypeScript
- [ ] Run `npm run lint` to check code quality
- [ ] Test all authentication flows
- [ ] Test event creation and fetching
- [ ] Verify environment variables are set

### Post-deployment Testing

1. **Authentication**:

   - [ ] Sign up new user
   - [ ] Sign in existing user
   - [ ] Sign out functionality
   - [ ] Profile creation

2. **Events**:

   - [ ] Create new event (draft)
   - [ ] Create new event (published)
   - [ ] View events list
   - [ ] Filter and search events
   - [ ] Event details page

3. **Navigation**:
   - [ ] All navigation links work
   - [ ] Protected routes redirect properly
   - [ ] Public routes accessible

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**:

   ```bash
   # Check for TypeScript errors
   npm run type-check

   # Check for linting errors
   npm run lint
   ```

2. **Environment Variables Not Working**:

   - Ensure variables are set in Vercel dashboard
   - Check variable names match exactly
   - Redeploy after adding variables

3. **Supabase Connection Issues**:

   - Verify Supabase URL and keys
   - Check RLS policies are enabled
   - Ensure database schema is deployed

4. **Authentication Issues**:
   - Check Site URL in Supabase settings
   - Verify redirect URLs are configured
   - Test with different browsers/incognito

### Debug Commands

```bash
# Local production build test
npm run preview

# Check bundle size
npm run build:analyze

# Clean build artifacts
npm run clean
```

## 📈 Monitoring & Analytics

### Vercel Analytics

Enable Vercel Analytics in your dashboard:

1. Go to your project in Vercel
2. Navigate to **Analytics** tab
3. Enable **Web Analytics**

### Performance Monitoring

Monitor your application:

- **Core Web Vitals**: Tracked automatically by Vercel
- **Error Tracking**: Check Vercel Functions logs
- **Database Performance**: Monitor in Supabase dashboard

## 🔄 Continuous Deployment

### Automatic Deployments

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from feature branches
- **Development**: Use `vercel dev` for local development

### Branch Protection

Recommended GitHub branch protection rules:

- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Supabase Documentation](https://supabase.com/docs)
3. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## 🎉 Success!

Your EventHub application should now be live at: `https://your-project.vercel.app`

### Next Steps

- [ ] Set up custom domain (optional)
- [ ] Configure monitoring and alerts
- [ ] Set up backup strategies
- [ ] Plan for scaling and performance optimization

---

**Happy Deploying! 🚀**
