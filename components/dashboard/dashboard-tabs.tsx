import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OpportunityTable } from "../tables/opportunity-table";
import { Opportunity } from "@/types/opportunity";

export function DashboardTabs() {
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
      <TabsList className="rounded-none h-[50px]">
        <TabsTrigger value="overview" className="rounded-none px-4">
          Opportunities
        </TabsTrigger>
        <TabsTrigger value="users" className="rounded-none px-4">
          Users
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OpportunityTable data={mockOpportunities} />
      </TabsContent>
      <TabsContent value="users">
        <OpportunityTable data={mockOpportunities} />
      </TabsContent>
    </Tabs>
  );
}
