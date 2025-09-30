# 📋 Deployment Checklist - EventHub

Use this checklist to ensure a smooth deployment to Vercel.

## 🔧 Pre-Deployment Setup

### Supabase Configuration

- [ ] Supabase project created
- [ ] Database schema deployed (`src/lib/supabase/schema.sql`)
- [ ] Database functions deployed (`src/lib/supabase/functions.sql`)
- [ ] Row Level Security (RLS) enabled
- [ ] Authentication policies configured
- [ ] Site URL configured in Supabase Auth settings
- [ ] Redirect URLs added for production domain

### Environment Variables Ready

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Code Quality Checks

- [ ] `npm run build` - Build passes locally
- [ ] `npm run type-check` - No TypeScript errors
- [ ] `npm run lint` - No linting errors
- [ ] All components render without errors
- [ ] Authentication flow works locally

## 🚀 Deployment Process

### Vercel Setup

- [ ] Vercel account created/logged in
- [ ] Repository connected to Vercel
- [ ] Environment variables added to Vercel project
- [ ] Build settings configured (auto-detected)
- [ ] Domain configured (if using custom domain)

### Deploy & Test

- [ ] Initial deployment successful
- [ ] Health check endpoint working (`/api/health`)
- [ ] Application loads without errors
- [ ] All routes accessible

## ✅ Post-Deployment Testing

### Authentication Flow

- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Profile creation/update works
- [ ] Protected routes redirect properly

### Event Management

- [ ] Create event (draft) works
- [ ] Create event (published) works
- [ ] Events list displays correctly
- [ ] Event filtering works
- [ ] Event search works
- [ ] Event details page works

### Navigation & UI

- [ ] All navigation links work
- [ ] Header logout button works
- [ ] Create event button works
- [ ] Mobile responsive design works
- [ ] Dark/light theme toggle works

### Performance & Security

- [ ] Page load times acceptable
- [ ] Images load correctly
- [ ] Security headers present
- [ ] HTTPS enabled
- [ ] No console errors in production

## 🐛 Troubleshooting

### If Build Fails

1. Check TypeScript errors: `npm run type-check`
2. Check linting errors: `npm run lint`
3. Verify all imports are correct
4. Check for missing dependencies

### If Authentication Fails

1. Verify Supabase URL and keys in Vercel
2. Check Site URL in Supabase settings
3. Verify redirect URLs are configured
4. Test in incognito/private browsing

### If Database Connection Fails

1. Check environment variables in Vercel
2. Verify RLS policies are enabled
3. Test Supabase connection in dashboard
4. Check database schema is deployed

### If Pages Don't Load

1. Check Vercel function logs
2. Verify all environment variables are set
3. Check for runtime errors in Vercel dashboard
4. Test health endpoint: `/api/health`

## 📊 Monitoring Setup

### Vercel Analytics

- [ ] Web Analytics enabled in Vercel dashboard
- [ ] Core Web Vitals monitoring active
- [ ] Error tracking configured

### Supabase Monitoring

- [ ] Database performance monitoring enabled
- [ ] Auth metrics tracking enabled
- [ ] API usage monitoring active

## 🔄 Continuous Deployment

### GitHub Integration

- [ ] Main branch deploys to production
- [ ] Feature branches create preview deployments
- [ ] Pull request checks configured
- [ ] Branch protection rules enabled

### Deployment Workflow

- [ ] Automatic deployments on push to main
- [ ] Preview deployments for pull requests
- [ ] Environment-specific configurations

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Application loads at your Vercel URL
- ✅ Users can register and login
- ✅ Events can be created and viewed
- ✅ All navigation works correctly
- ✅ No console errors in production
- ✅ Health check returns healthy status
- ✅ Mobile and desktop views work properly

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

---

**Deployment URL**: `https://your-project.vercel.app`
**Health Check**: `https://your-project.vercel.app/api/health`

**Status**: 🟢 Ready for Production
