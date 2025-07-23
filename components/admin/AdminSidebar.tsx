"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Bot,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { id: "opportunities", label: "Opportunities", icon: Briefcase, href: "/admin/opportunities" },
  { id: "ai-drafts", label: "AI Drafts", icon: Bot, href: "/admin/ai-drafts" },
  { id: "crawling", label: "AI Crawling", icon: Globe, href: "/admin/crawling" },
  { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar({
  isCollapsed,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  
  const toggleSidebar = () => {
    onToggle(!isCollapsed);
  };

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname === href;
  };

  return (
    <Sidebar
      className={`border-r bg-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <SidebarHeader className="p-6 relative">
        <div className="flex items-center space-x-2">
          <Link href={"/"} className="flex item-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex-shrink-0"></div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold whitespace-nowrap">
                  AmbifulAI
                </h1>
              </div>
            )}
          </Link>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      className={`w-full ${
                        isCollapsed ? "justify-center px-2" : "justify-start"
                      } ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={`w-4 h-4 ${
                          isCollapsed ? "" : "mr-3"
                        } flex-shrink-0`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="overflow-hidden whitespace-nowrap">
                            {item.label}
                          </span>
                          {item.id === "ai-drafts" && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                              5
                            </span>
                          )}
                        </>
                      )}
                      {isCollapsed && item.id === "ai-drafts" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenuButton
          className={`w-full ${
            isCollapsed ? "justify-center px-2" : "justify-start"
          } text-red-600 hover:bg-red-50`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut
            className={`w-4 h-4 ${isCollapsed ? "" : "mr-3"} flex-shrink-0`}
          />
          {!isCollapsed && (
            <span className="overflow-hidden whitespace-nowrap">Logout</span>
          )}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
