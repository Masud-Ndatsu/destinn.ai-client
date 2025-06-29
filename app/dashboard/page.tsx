"use client";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { CreateOpportunityForm } from "@/components/form/create-opportunity";
import { Modal } from "@/components/ui/modal";
import { getCategories } from "@/lib/actions/api";
import useModalStore from "@/stores/modal";
import { useQuery } from "@tanstack/react-query";

export default function DashboardHome() {
  const isOpen = useModalStore((state) => state.isOpportunityModalOpen);
  const openModal = useModalStore((state) => state.setOpportunityModalOpen);

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

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
        <Modal
          trigger={null}
          openModal={isOpen}
          closeModal={() => openModal(!isOpen)}
        >
          <CreateOpportunityForm categories={categories} />
        </Modal>
      </section>
    </main>
  );
}
