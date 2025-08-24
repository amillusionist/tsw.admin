import { AppSidebar } from "@/components/shadcn/ui/app-sidebar"
import { ChartAreaInteractive } from "@/components/shadcn/ui/chart-area-interactive"
import { DataTable } from "@/components/shadcn/ui/data-table"
import { SectionCards } from "@/components/shadcn/ui/section-cards"
import { SiteHeader } from "@/components/shadcn/ui/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/shadcn/ui/sidebar"
import { Routes, Route, useLocation } from "react-router-dom"
import AddonsPage from "./addons/page"
import AddAddonPage from "./addons/addAddon"
import UpdateAddonPage from "./addons/updateAddpn"
import CategoriesPage from "./categories/page"
import AddCategoryPage from "./categories/addCategory"
import UpdateCategoryPage from "./categories/updateCategory"
import ServicesPage from "./services/page"
import AddServicePage from "./services/addService"
import UpdateServicePage from "./services/updateService"
import UsersPage from "./users/page"
import AddUserPage from "./users/addUser"
import UpdateUserPage from "./users/updateUser"
import { LoginPage } from "./login/page"
import data from "./data.json"

// Main Dashboard Content Component
function DashboardContent() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  )
}

// Content Router Component
function ContentRouter() {
  const location = useLocation()
  
  // If we're on the main dashboard route, show dashboard content
  if (location.pathname === "/dashboard" || location.pathname === "/") {
    return <DashboardContent />
  }
  
  // For other routes, render the specific page component
  return (
    <Routes>
      <Route path="/addons" element={<AddonsPage />} />
      <Route path="/add-addon" element={<AddAddonPage />} />
      <Route path="/update-addon/:id" element={<UpdateAddonPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/add-category" element={<AddCategoryPage />} />
      <Route path="/update-category/:id" element={<UpdateCategoryPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/add-service" element={<AddServicePage />} />
      <Route path="/update-service/:id" element={<UpdateServicePage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/add-user" element={<AddUserPage />} />
      <Route path="/update-user/:id" element={<UpdateUserPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* Add more routes here as needed */}
      <Route path="*" element={<DashboardContent />} />
    </Routes>
  )
}

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col w-[1120px] mx-auto">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <ContentRouter />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
