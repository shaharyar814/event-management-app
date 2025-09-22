# EventHub - Event Management Platform

A modern, full-stack Event Management application built with **NextJS 14**, **Supabase**, and **Tailwind CSS**. Create, manage, and discover amazing events with a beautiful, responsive interface.

![EventHub](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔐 Authentication
- User registration and login
- Password reset functionality
- Protected routes with middleware
- Automatic profile creation
- Session management

### 📅 Event Management
- Create, edit, and delete events
- Real-time attendee tracking
- Event status management (active, cancelled, completed)
- Category and location support
- Image upload support
- Event capacity management

### 📊 Dashboard & Analytics
- Personal dashboard with event statistics
- Event performance metrics
- Recent activity tracking
- Quick action buttons

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/light mode support
- Smooth animations and transitions
- Card-based layouts with hover effects
- Professional color scheme
- Accessible components

### 🔒 Security
- Row Level Security (RLS) policies
- User-specific data access
- Secure API endpoints
- Input validation and sanitization

## 🚀 Tech Stack

### Frontend
- **NextJS 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** for component library
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Zod** for validation

### Backend & Database
- **Supabase** (PostgreSQL database)
- **Supabase Auth** for authentication
- **Supabase Storage** for file uploads
- **Row Level Security (RLS)** for data protection

### Deployment
- **Vercel** for hosting
- **GitHub** for version control

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/shaharyar814/event-management-app.git
cd event-management-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from the dashboard
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Set Up Database
1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Run the `setup-database.sql` script to create tables and policies

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
event-management-app/
├── src/
│   ├── app/                    # NextJS App Router
│   │   ├── (auth)/            # Auth route group
│   │   ├── dashboard/
│   │   ├── events/
│   │   └── globals.css
│   ├── components/            # Reusable components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── events/           # Event-specific components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities and configurations
│   │   └── supabase/         # Supabase client setup
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript type definitions
├── supabase/                 # Supabase configuration
│   └── migrations/
├── public/                   # Static assets
└── setup-database.sql        # Database setup script
```

## 🗄️ Database Schema

### Tables
- **profiles**: User profile information
- **events**: Event details and metadata
- **event_attendees**: Event registration tracking

### Key Features
- Automatic timestamp updates
- Real-time attendee counting
- Row Level Security policies
- User profile auto-creation

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to GitHub**:
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure Environment Variables**:
   - Add your Supabase credentials in Vercel dashboard
   - Set the same environment variables as in `.env.local`

3. **Deploy**:
   - Vercel will automatically deploy on every push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 🧪 Testing

The application includes:
- Form validation with Zod schemas
- Error handling and user feedback
- Loading states and skeleton screens
- Responsive design testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Built with ❤️ using NextJS, Supabase, and Tailwind CSS**