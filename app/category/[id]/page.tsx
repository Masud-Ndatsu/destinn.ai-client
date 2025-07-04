"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useCategoryById } from "@/lib/queries/useCategories";
import { useOpportunitiesByCategoryId } from "@/lib/queries/useOpportunities";
import Navbar from "@/components/navbar";
import { MobileNavMenu, MobileNavSearch } from "@/components/mobile-nav";

const DEFAULT_CATEGORY = {
  name: "Technology",
  description: "Explore the latest technology opportunities across Africa.",
  banner:
    "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
};

const DEFAULT_OPPORTUNITIES = [
  {
    id: "1",
    title: "AI Internship",
    company: "Google",
    location: "Remote",
    deadline: "2025-08-01",
    source_url: "https://source.unsplash.com/featured/?ai",
  },
  {
    id: "2",
    title: "Frontend Fellowship",
    company: "Andela",
    location: "Nigeria",
    deadline: "2025-08-15",
    source_url: "https://source.unsplash.com/featured/?frontend",
  },
];

export default function CategoryPage() {
  const { id } = useParams();
  const { data: category, isLoading: loadingCategory } = useCategoryById(
    id as string
  );
  const { data: opportunities, isLoading: loadingOpps } =
    useOpportunitiesByCategoryId(id as string);

  const categoryData = category?.data || DEFAULT_CATEGORY;
  const opportunityList = opportunities?.data?.length
    ? opportunities.data
    : DEFAULT_OPPORTUNITIES;

  return (
    <>
      <Navbar />
      <MobileNavSearch />
      <MobileNavMenu />
      {/* Category Banner */}
      <section className="max-w-6xl mx-auto text-center mt-8 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          {categoryData.name}
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          {categoryData.description}
        </p>
        <div className="relative w-full h-[300px] rounded overflow-hidden">
          <Image
            src={
              "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg"
            }
            alt={categoryData.name}
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Opportunities */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Available Opportunities</h2>
        {loadingOpps ? (
          <p>Loading opportunities...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {opportunityList.map((opportunity: any) => (
              <Card
                key={opportunity.id}
                className="overflow-hidden rounded-none"
              >
                <div className="relative w-full h-[180px]">
                  <Image
                    src={opportunity.source_url}
                    alt={opportunity.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription className="text-sm mt-2 text-gray-700">
                    <p>
                      {opportunity.company} • {opportunity.location}
                    </p>
                    <p className="text-gray-500 mt-1">
                      Deadline: <strong>{opportunity.deadline}</strong>
                    </p>
                  </CardDescription>
                  <Button className="mt-4 w-full rounded-none text-sm">
                    View Opportunity
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
