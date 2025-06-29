"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OpportunityTable } from "../tables/opportunity-table";
import { Opportunity } from "@/types/opportunity";
import { Button } from "../ui/button";
import useModalStore from "@/stores/modal";
import { useCallback } from "react";

export function DashboardTabs() {
  const openModal = useModalStore((state) => state.setOpportunityModalOpen);

  const handleOpportunityClick = useCallback(() => {
    openModal(true);
  }, [openModal]);
  const mockOpportunities: Opportunity[] = [
    {
      id: "1",
      title: "Google Summer of Code",
      category: "Internship",
      location: "Remote",
      deadline: "2025-07-01",
      status: "published",
    },
    {
      id: "2",
      title: "UN Innovation Fellowship",
      category: "Fellowship",
      location: "Global",
      deadline: "2025-07-10",
      status: "draft",
    },
  ];
  return (
    <Tabs
      defaultValue="overview"
      className="w-full space-y-8 rounded-none shadow-none"
    >
      <div className="flex items-center justify-between">
        <TabsList className="rounded-none h-[50px]">
          <TabsTrigger value="overview" className="rounded-none px-4">
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-none px-4">
            Users
          </TabsTrigger>
        </TabsList>
        <Button onClick={handleOpportunityClick}>Create Opportunity</Button>
      </div>

      <TabsContent value="overview">
        <OpportunityTable data={mockOpportunities} />
      </TabsContent>
      <TabsContent value="users">
        <OpportunityTable data={mockOpportunities} />
      </TabsContent>
    </Tabs>
  );
}
