"use client";
import { Metadata } from "next";
import { ReactNode, Suspense, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          <Suspense fallback={<div className="p-4 text-sm">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
}
