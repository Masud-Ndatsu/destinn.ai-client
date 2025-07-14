"use client";
import { useState, useMemo } from "react";
import { Search, Grid, List, Filter } from "lucide-react";
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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for opportunities
const opportunities = [
  {
    id: 1,
    title: "Google Summer of Code 2024",
    type: "Internship",
    category: "Technology",
    deadline: "2024-03-15",
    location: "Remote",
    amount: "$6,000",
    description:
      "Contribute to open source projects while getting mentored by industry experts. This is a 12-week program where students work on meaningful projects.",
    tags: ["Programming", "Open Source", "Mentorship"],
    applicationInstructions:
      "Submit your proposal through the official GSoC website. Include your background, project proposal, and timeline.",
    applyUrl: "https://summerofcode.withgoogle.com",
    featured: true,
  },
  {
    id: 2,
    title: "Rhodes Scholarship",
    type: "Scholarship",
    category: "Education",
    deadline: "2024-10-01",
    location: "Oxford, UK",
    amount: "Full Funding",
    description:
      "Prestigious scholarship for outstanding students to study at the University of Oxford. Covers all expenses including tuition, accommodation, and living costs.",
    tags: ["Graduate Study", "Leadership", "International"],
    applicationInstructions:
      "Complete the online application including personal statement, academic transcripts, and recommendation letters.",
    applyUrl: "https://www.rhodeshouse.ox.ac.uk",
    featured: true,
  },
  {
    id: 3,
    title: "NASA Space Grant",
    type: "Grant",
    category: "STEM",
    deadline: "2024-02-28",
    location: "USA",
    amount: "$15,000",
    description:
      "Support for students pursuing space-related research and career paths. Open to undergraduate and graduate students in STEM fields.",
    tags: ["Space", "Research", "STEM"],
    applicationInstructions:
      "Submit research proposal, budget, and advisor recommendation through the NASA grants portal.",
    applyUrl:
      "https://www.nasa.gov/audience/forstudents/postsecondary/features/F_Space_Grant.html",
    featured: false,
  },
  {
    id: 4,
    title: "Y Combinator Startup School",
    type: "Program",
    category: "Entrepreneurship",
    deadline: "Rolling",
    location: "Remote",
    amount: "Free",
    description:
      "Free online course for entrepreneurs looking to start a company. Learn from successful founders and get access to startup resources.",
    tags: ["Startup", "Business", "Entrepreneurship"],
    applicationInstructions:
      "Sign up on the Startup School website and complete the online application form.",
    applyUrl: "https://www.startupschool.org",
    featured: false,
  },
  {
    id: 5,
    title: "Fulbright Scholarship",
    type: "Scholarship",
    category: "Education",
    deadline: "2024-09-15",
    location: "Various Countries",
    amount: "Full Funding",
    description:
      "International educational exchange program providing opportunities for students to study abroad.",
    tags: ["International", "Study Abroad", "Cultural Exchange"],
    applicationInstructions:
      "Apply through your home country's Fulbright commission with complete application package.",
    applyUrl: "https://fulbrightscholars.org",
    featured: false,
  },
];

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    types: [] as string[],
    locations: [] as string[],
    deadlines: [] as string[],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOpportunity, setSelectedOpportunity] = useState<
    (typeof opportunities)[0] | null
  >(null);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 6;

  // Filter and search logic
  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter((opp) =>
        selectedFilters.categories.includes(opp.category)
      );
    }

    // Type filter
    if (selectedFilters.types.length > 0) {
      filtered = filtered.filter((opp) =>
        selectedFilters.types.includes(opp.type)
      );
    }

    // Sort
    switch (sortBy) {
      case "deadline":
        filtered.sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        break;
      case "popular":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        // newest first
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [searchQuery, selectedFilters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* <h1 className="text-3xl font-bold text-foreground mb-4">
            Browse Opportunities
          </h1> */}

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by title, category, country..."
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
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
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
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {paginatedOpportunities.length} of{" "}
                {filteredOpportunities.length} opportunities
              </p>
            </div>

            {/* Opportunity Cards */}
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }`}
            >
              {paginatedOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  viewMode={viewMode}
                  onClick={() => setSelectedOpportunity(opportunity)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-2">
                  No opportunities found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(currentPage - 1)}
                        />
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(currentPage + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          isOpen={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          relatedOpportunities={opportunities
            .filter(
              (opp) =>
                opp.id !== selectedOpportunity.id &&
                opp.category === selectedOpportunity.category
            )
            .slice(0, 3)}
        />
      )}
    </div>
  );
}
