import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/shadcn/ui/button"
import { ScrollArea } from "@/components/shadcn/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/ui/sheet"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/shadcn/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/ui/tooltip"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Package, 
  Tag, 
  Settings, 
  Users, 
  BarChart3, 
  FileText,
  ChevronDown,
  ChevronRight,
  Bell,
  UserCheck,
  Shield
} from "lucide-react"

interface SidebarItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface SidebarGroup {
  title: string
  items: SidebarItem[]
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Services",
        url: "/services",
        icon: Package,
      },
      {
        title: "Categories",
        url: "/categories",
        icon: Tag,
      },
      {
        title: "Addons",
        url: "/addons",
        icon: FileText,
      },
      {
        title: "Bookings",
        url: "/bookings",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const [openMenus, setOpenMenus] = React.useState<Set<string>>(new Set())

  const toggleMenu = (title: string) => {
    const newOpenMenus = new Set(openMenus)
    if (newOpenMenus.has(title)) {
      newOpenMenus.delete(title)
    } else {
      newOpenMenus.add(title)
    }
    setOpenMenus(newOpenMenus)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="font-semibold">Admin Panel</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <SidebarMenu>
            {sidebarGroups.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.url || 
                      (item.url !== "/dashboard" && location.pathname.startsWith(item.url))
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link to={item.url}>
                              <SidebarMenuButton
                                className={cn(
                                  "w-full justify-start",
                                  isActive && "bg-accent text-accent-foreground"
                                )}
                              >
                                <item.icon className="h-4 w-4" />
                                <span className="ml-2">{item.title}</span>
                                {item.badge && (
                                  <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                                    {item.badge}
                                  </span>
                                )}
                              </SidebarMenuButton>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="flex items-center gap-2">
                            <span>{item.title}</span>
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2">
          <div className="text-xs text-muted-foreground">
            © 2025 Admin Panel By Weblexia 
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function SidebarTriggerButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="-ml-1 h-9 w-9 p-0">
          <Package className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </SheetContent>
    </Sheet>
  )
}
