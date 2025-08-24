import React, { useEffect } from "react";
import { SiteHeader } from "@/components/shadcn/ui/site-header";
import { AppSidebar } from "@/components/shadcn/ui/app-sidebar";
import { SectionCards } from "@/components/shadcn/ui/section-cards";


interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to your admin dashboard. Here's an overview of your data.
              </p>
            </div>
            
            <SectionCards />
            
            {children && (
              <div className="space-y-4">
                {children}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
