import React from "react";
import { Layout as RaLayout, LayoutProps } from "react-admin";
import { DashboardLayout } from "@/components/shadcn/ui/dashboard-layout";
import { SiteHeader } from "@/components/shadcn/ui/site-header";

export const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <DashboardLayout >
      <RaLayout {...props} appBar={SiteHeader} />
    </DashboardLayout>
  );
};
