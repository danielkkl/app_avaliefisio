import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we are on login page, don't show layout
  if (location === "/login" || !user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
