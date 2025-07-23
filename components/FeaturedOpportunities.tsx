"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  DollarSign,
  GraduationCap,
  Briefcase,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useFeaturedOpportunities } from "@/lib/queries/useOpportunities";

// Helper function to get icon based on category or type
const getOpportunityIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "technology":
    case "tech":
    case "programming":
      return Briefcase;
    case "education":
    case "scholarship":
      return GraduationCap;
    case "stem":
    case "science":
    case "research":
      return Award;
    case "entrepreneurship":
    case "business":
      return Briefcase;
    default:
      return Briefcase;
  }
};

// Helper function to format deadline
const formatDeadline = (deadline: string) => {
  try {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return deadline;
  }
};

export const FeaturedOpportunities = () => {
  const {
    data: featuredResponse,
    isLoading,
    error,
    isError,
  } = useFeaturedOpportunities();

  console.log("🎯 FeaturedOpportunities data:", {
    isLoading,
    error,
    hasData: !!featuredResponse,
    dataLength: featuredResponse?.data?.length,
  });

  // Get featured opportunities from the dedicated endpoint
  const featuredOpportunities = featuredResponse?.data || [];

  return (
    <section id="opportunities" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Opportunities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover hand-picked opportunities that could change your career
            trajectory
          </p>
        </div>

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Opportunities
              </h3>
              <p className="text-red-600 mb-4">
                {error?.message ||
                  "Failed to load opportunities. Please try again later."}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {featuredOpportunities.length > 0 ? (
                featuredOpportunities.map((opportunity: any, index) => {
                  const IconComponent = getOpportunityIcon(
                    opportunity.category?.name || opportunity.category_id
                  );
                  return (
                    <Card
                      key={opportunity.id}
                      className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-blue-600 transition-colors">
                          {opportunity.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {opportunity.description ||
                            "No description available"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {opportunity.company && (
                            <Badge variant="outline" className="text-xs">
                              {opportunity.company}
                            </Badge>
                          )}
                          {opportunity.category && (
                            <Badge variant="outline" className="text-xs">
                              {opportunity.category.name}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center dark:text-gray-300">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            Deadline: {formatDeadline(opportunity.deadline)}
                          </div>
                          <div className="flex items-center dark:text-gray-300">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            {opportunity.location}
                          </div>
                          {opportunity.application_url && (
                            <div className="flex items-center dark:text-gray-300">
                              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                              Apply Online
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700 text-white"
                          asChild
                        >
                          <Link
                            href={
                              opportunity.application_url ||
                              opportunity.source_url ||
                              "/opportunities"
                            }
                            target={
                              opportunity.application_url ||
                              opportunity.source_url
                                ? "_blank"
                                : "_self"
                            }
                            rel={
                              opportunity.application_url ||
                              opportunity.source_url
                                ? "noopener noreferrer"
                                : ""
                            }
                          >
                            Learn More
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No opportunities available at the moment. Check back later!
                  </p>
                </div>
              )}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                asChild
              >
                <Link href="/opportunities">View All Opportunities</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
