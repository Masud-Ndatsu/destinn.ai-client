"use client";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ManageOpportunities } from "@/components/admin/ManageOpportunities";
import { ReviewAIDrafts } from "@/components/admin/ReviewAIDrafts";
import { Analytics } from "@/components/admin/Analytics";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "opportunities":
        return <ManageOpportunities />;
      case "ai-drafts":
        return <ReviewAIDrafts />;
      case "analytics":
        return <Analytics />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <SystemSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div
        className="min-h-screen w-full bg-gray-50"
        style={{
          display: "grid",
          gridTemplateAreas: `
            "sidebar topbar"
            "sidebar content"
          `,
          gridTemplateColumns: `${sidebarCollapsed ? "4rem" : "16rem"} 1fr`,
          gridTemplateRows: "auto 1fr",
          transition: "grid-template-columns 0.3s ease",
        }}
      >
        <div style={{ gridArea: "sidebar" }}>
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={sidebarCollapsed}
            onToggle={setSidebarCollapsed}
          />
        </div>

        <div style={{ gridArea: "topbar" }}>
          <AdminTopBar />
        </div>

        <main
          className={`p-6 transition-all duration-300 ${
            sidebarCollapsed ? "max-w-full" : "max-w-[calc(100vw-16rem)]"
          }`}
          style={{ gridArea: "content" }}
        >
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
}
