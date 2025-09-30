"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Redirect to dashboard after a brief welcome screen
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Calendar className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">EventHub</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The modern event management platform for creating, organizing, and managing events with ease.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <Card className="animate-slide-up border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mx-auto" />
              <CardTitle>Create Events</CardTitle>
              <CardDescription>
                Design beautiful events with our intuitive creation tools
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="animate-slide-up border-2 hover:border-primary/50 transition-colors" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mx-auto" />
              <CardTitle>Manage Attendees</CardTitle>
              <CardDescription>
                Track registrations and manage your event attendees effortlessly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="animate-slide-up border-2 hover:border-primary/50 transition-colors" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mx-auto" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Get insights into your events with detailed analytics and reports
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => router.push("/dashboard")}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
