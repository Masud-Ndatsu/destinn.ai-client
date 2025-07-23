"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Grid,
  List,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { OpportunityCard } from "@/components/OpportunityCard";
import { OpportunityDetailModal } from "@/components/OpportunityDetailModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { getOpportunities } from "@/lib/actions/opportunity";
import { getCategories } from "@/lib/actions/category";
import { Skeleton } from "@/components/ui/skeleton";

// Type definitions based on your data structure
interface Category {
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
  created_at: string;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  application_url: string;
  category_id: string;
  deadline: string;
  location: string;
  source_type: string;
  source_url: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  created_by_id: string | null;
}

interface OpportunityWithCategory extends Opportunity {
  category?: Category;
  type?: string;
  amount?: string;
  tags?: string[];
  featured?: boolean;
}

interface ApiResponse {
  data: Opportunity[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9); // Matches API's default perPage
  const [totalPages, setTotalPages] = useState(0);

  // Data fetching with pagination
  const {
    data: opportunitiesResponse,
    isLoading: oppsLoading,
    isError: oppsError,
    refetch: refetchOpportunities,
  } = useQuery({
    queryKey: ["opportunities", currentPage],
    queryFn: () => getOpportunities(currentPage, pageSize),
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => getCategories(),
  });

  // Update total pages when data loads
  useEffect(() => {
    if (opportunitiesResponse?.data!.meta) {
      setTotalPages(opportunitiesResponse?.data.meta.totalPages);
    }
  }, [opportunitiesResponse]);

  // Transform and normalize the data
  const opportunities: OpportunityWithCategory[] = useMemo(() => {
    if (!opportunitiesResponse?.data.data || !categoriesData?.data) return [];

    const categoriesMap = new Map(
      categoriesData.data?.data.map((cat: Category) => [cat.id, cat])
    );

    return opportunitiesResponse.data.data.map((opp: Opportunity | any) => ({
      ...opp,
      category: categoriesMap.get(opp.category_id),
      type: "Opportunity",
      amount: "N/A",
      tags: [],
      featured: false,
    }));
  }, [opportunitiesResponse, categoriesData]);

  const categories = categoriesData?.data?.data || [];

  // Extract unique locations for filtering
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    opportunities.forEach((opp) => locations.add(opp.location));
    return Array.from(locations);
  }, [opportunities]);

  // Initialize filters with all categories
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    types: [] as string[],
    locations: [] as string[],
    deadlines: [] as string[],
  });

  // Set initial categories when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedFilters((prev) => ({
        ...prev,
        categories: categories.map((cat: Category) => cat.name),
      }));
    }
  }, [categories]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityWithCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  const filteredOpportunities = useMemo(() => {
    let filtered = [...opportunities];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          (opp.category?.name.toLowerCase().includes(query) ?? false) ||
          opp.location.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(
        (opp) =>
          opp.category && selectedFilters.categories.includes(opp.category.name)
      );
    }

    // Location filter
    if (selectedFilters.locations.length > 0) {
      filtered = filtered.filter((opp) =>
        selectedFilters.locations.includes(opp.location)
      );
    }

    // Deadline filter with rolling deadline support
    if (selectedFilters.deadlines.length > 0) {
      const now = new Date();
      filtered = filtered.filter((opp) => {
        // Handle rolling deadlines
        if (opp.deadline === "Rolling" || opp.deadline === "Ongoing") {
          return selectedFilters.deadlines.includes("Rolling");
        }

        try {
          const deadline = new Date(opp.deadline);
          const daysUntilDeadline = Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          return selectedFilters.deadlines.some((filter) => {
            switch (filter) {
              case "This week":
                return daysUntilDeadline <= 7;
              case "This month":
                return daysUntilDeadline <= 30;
              case "Next 3 months":
                return daysUntilDeadline <= 90;
              case "Rolling":
                return true;
              default:
                return true;
            }
          });
        } catch (e) {
          return false;
        }
      });
    }

    // Sort logic
    switch (sortBy) {
      case "deadline":
        filtered.sort((a, b) => {
          // Handle rolling deadlines
          if (a.deadline === "Rolling" && b.deadline === "Rolling") return 0;
          if (a.deadline === "Rolling") return 1;
          if (b.deadline === "Rolling") return -1;

          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        });
        break;
      case "popular":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      default: // newest first
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return filtered;
  }, [searchQuery, selectedFilters, sortBy, opportunities]);

  // Get related opportunities for modal
  const getRelatedOpportunities = (opportunity: OpportunityWithCategory) => {
    return opportunities
      .filter(
        (opp) =>
          opp.id !== opportunity.id &&
          opp.category_id === opportunity.category_id
      )
      .slice(0, 3);
  };

  // Transform opportunity for components
  const transformOpportunityForCard = (opp: OpportunityWithCategory) => ({
    ...opp,
    category: opp.category?.name || "Unknown",
    applyUrl: opp.application_url,
    applicationInstructions: `Visit the application link to apply for this opportunity.`,
  });

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're at the start or end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <Button
          variant="ghost"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || oppsLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
      </PaginationItem>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <Button
            variant={currentPage === i ? "default" : "ghost"}
            onClick={() => handlePageChange(i)}
            disabled={oppsLoading}
          >
            {i}
          </Button>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <Button
          variant="ghost"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || oppsLoading}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </PaginationItem>
    );

    return items;
  }, [currentPage, totalPages, oppsLoading]);

  // Loading state
  if (oppsLoading || categoriesLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
            {/* Search Header Skeleton */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Skeleton className="h-10 w-full max-w-lg" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-8 mt-8">
              {/* Sidebar Skeleton */}
              <div className="hidden lg:block w-80 space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Main Content Skeleton */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (oppsError || categoriesError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <div className="mb-6 bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Failed to load data</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {oppsError || categoriesError || "Please try again later"}
              </p>
              <div className="flex gap-3">
                <Button onClick={() => refetchOpportunities()}>
                  Retry Opportunities
                </Button>
                <Button variant="outline" onClick={() => refetchCategories()}>
                  Retry Categories
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Get current page data
  const currentPageData = opportunitiesResponse?.data?.data || [];
  const totalItems = opportunitiesResponse?.data?.meta?.total || 0;
  const currentPageMeta = opportunitiesResponse?.data?.meta || {
    currentPage: 1,
    perPage: 20,
    total: 0,
    totalPages: 1,
  };

  // Calculate showing range
  const startItem =
    (currentPageMeta.currentPage - 1) * currentPageMeta.perPage + 1;
  const endItem = Math.min(
    currentPageMeta.currentPage * currentPageMeta.perPage,
    currentPageMeta.total
  );

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title, category, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* View Toggle & Filters */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none !dark:text-gray-300"
                  >
                    <List className="h-4 w-4 data-[]:" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block w-full lg:w-80 space-y-10`}
            >
              <FilterSidebar
                selectedFilters={selectedFilters}
                onFiltersChange={setSelectedFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                categories={categories}
                locations={uniqueLocations}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {startItem} - {endItem} of {totalItems} opportunities
                </p>
              </div>

              {/* Opportunity Cards */}
              {oppsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-60 sm:h-80 rounded-xl" />
                  ))}
                </div>
              ) : (
                <>
                  <div
                    className={`${
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                        : "space-y-4"
                    }`}
                  >
                    {opportunities.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={transformOpportunityForCard(opportunity)}
                        viewMode={viewMode}
                        onClick={() => setSelectedOpportunity(opportunity)}
                      />
                    ))}
                  </div>

                  {/* Empty State */}
                  {currentPageData.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-lg text-muted-foreground mb-2">
                        No opportunities found
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Try adjusting your search or filters
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedFilters({
                            categories: categories.map(
                              (cat: Category) => cat.name
                            ),
                            types: [],
                            locations: [],
                            deadlines: [],
                          });
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  {/* Mobile pagination */}
                  <div className="lg:hidden flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || oppsLoading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                      </Button>
                      <span className="text-sm text-muted-foreground px-3 py-1 border rounded-md">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || oppsLoading}
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Desktop pagination */}
                  <div className="hidden lg:flex justify-center items-center">
                    <Pagination>
                      <PaginationContent>{paginationItems}</PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Opportunity Detail Modal */}
        {selectedOpportunity && (
          <OpportunityDetailModal
            opportunity={transformOpportunityForCard(selectedOpportunity)}
            isOpen={!!selectedOpportunity}
            onClose={() => setSelectedOpportunity(null)}
            relatedOpportunities={getRelatedOpportunities(
              selectedOpportunity
            ).map(transformOpportunityForCard)}
          />
        )}
      </div>
    </>
  );
}
