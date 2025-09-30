import { Calendar } from "lucide-react";

export function AuthLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground animate-pulse">
                        <Calendar className="h-8 w-8" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded mx-auto" />
                    <div className="h-3 w-24 bg-muted/60 animate-pulse rounded mx-auto" />
                </div>
            </div>
        </div>
    );
}
