import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";

export default function DashboardHome() {
  return (
    <main>
      <header className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Revenue"
          value="$1,250.00"
          description="Trending up this month"
          subtext="Visitors for the last 6 months"
          trend="up"
          percentage="+12.5%"
        />
        <DashboardCard
          title="New Customers"
          value="1,234"
          description="Down 20% this period"
          subtext="Acquisition needs attention"
          trend="down"
          percentage="-20%"
        />
        <DashboardCard
          title="Active Accounts"
          value="45,678"
          description="Strong user retention"
          subtext="Engagement exceed targets"
          trend="up"
          percentage="+12.5%"
        />
        <DashboardCard
          title="Growth Rate"
          value="4.5%"
          description="Steady performance increase"
          subtext="Meets growth projections"
          trend="up"
          percentage="+4.5%"
        />
      </header>
      <section className="my-6">
        <DashboardChart />
      </section>

      <section>
        <DashboardTabs />
      </section>
    </main>
  );
}
