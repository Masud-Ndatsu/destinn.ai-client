"use client";
import { useState, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  category?: Category;
}

interface FilterSidebarProps {
  selectedFilters: {
    categories: string[];
    types: string[];
    locations: string[];
    deadlines: string[];
  };
  onFiltersChange: (filters: any) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categories?: Category[];
  opportunities?: Opportunity[];
  locations?: string[];
}

// Static types and deadlines (since these aren't in your data structure yet)
const types = [
  "Scholarship",
  "Fellowship",
  "Internship",
  "Grant",
  "Program",
  "Competition",
  "Opportunity", // Default type from your data
];

const deadlines = ["This week", "This month", "Next 3 months", "Next 6 months"];

export const FilterSidebar = ({
  selectedFilters,
  onFiltersChange,
  sortBy,
  onSortChange,
  categories = [],
  opportunities = [],
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    types: true,
    locations: false,
    deadlines: false,
  });

  // Generate dynamic categories from API data
  const availableCategories = useMemo(() => {
    return categories.map((cat) => cat.name).sort();
  }, [categories]);

  // Generate dynamic locations from opportunities data
  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    opportunities.forEach((opp) => {
      if (opp.location && opp.location.trim()) {
        locations.add(opp.location.trim());
      }
    });
    return Array.from(locations).sort();
  }, [opportunities]);

  // Get count of opportunities for each filter option
  const getFilterCount = (filterType: string, value: string) => {
    switch (filterType) {
      case "categories":
        return opportunities.filter((opp) => opp.category?.name === value)
          .length;
      case "locations":
        return opportunities.filter((opp) => opp.location === value).length;
      case "types":
        // Since type isn't in your data, we'll show total count for now
        return opportunities.length;
      case "deadlines":
        const now = new Date();
        return opportunities.filter((opp) => {
          const deadline = new Date(opp.deadline);
          const daysUntilDeadline = Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          switch (value) {
            case "This week":
              return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
            case "This month":
              return daysUntilDeadline <= 30 && daysUntilDeadline > 0;
            case "Next 3 months":
              return daysUntilDeadline <= 90 && daysUntilDeadline > 0;
            case "Next 6 months":
              return daysUntilDeadline <= 180 && daysUntilDeadline > 0;
            default:
              return false;
          }
        }).length;
      default:
        return 0;
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (
    filterType: keyof typeof selectedFilters,
    value: string,
    checked: boolean
  ) => {
    const newFilters = { ...selectedFilters };
    if (checked) {
      newFilters[filterType] = [...newFilters[filterType], value];
    } else {
      newFilters[filterType] = newFilters[filterType].filter(
        (item) => item !== value
      );
    }
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: availableCategories, // Reset to all categories
      types: [],
      locations: [],
      deadlines: [],
    });
  };

  const hasActiveFilters =
    selectedFilters.categories.length < availableCategories.length ||
    selectedFilters.types.length > 0 ||
    selectedFilters.locations.length > 0 ||
    selectedFilters.deadlines.length > 0;

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="deadline">Deadline Soon</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      {availableCategories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <button
              onClick={() => toggleSection("categories")}
              className="flex items-center justify-between w-full text-left"
            >
              <CardTitle className="text-base">Category</CardTitle>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedSections.categories ? "rotate-180" : ""
                }`}
              />
            </button>
          </CardHeader>
          {expandedSections.categories && (
            <CardContent className="pt-0">
              <div className="space-y-3">
                {availableCategories.map((category) => {
                  const count = getFilterCount("categories", category);
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedFilters.categories.includes(
                            category
                          )}
                          onCheckedChange={(checked) =>
                            handleFilterChange(
                              "categories",
                              category,
                              checked as boolean
                            )
                          }
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Types */}
      <Card>
        <CardHeader className="pb-3">
          <button
            onClick={() => toggleSection("types")}
            className="flex items-center justify-between w-full text-left"
          >
            <CardTitle className="text-base">Type</CardTitle>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.types ? "rotate-180" : ""
              }`}
            />
          </button>
        </CardHeader>
        {expandedSections.types && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {types.map((type) => {
                const count = getFilterCount("types", type);
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedFilters.types.includes(type)}
                        onCheckedChange={(checked) =>
                          handleFilterChange("types", type, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({type === "Opportunity" ? count : 0})
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Locations */}
      {availableLocations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <button
              onClick={() => toggleSection("locations")}
              className="flex items-center justify-between w-full text-left"
            >
              <CardTitle className="text-base">Location</CardTitle>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedSections.locations ? "rotate-180" : ""
                }`}
              />
            </button>
          </CardHeader>
          {expandedSections.locations && (
            <CardContent className="pt-0">
              <div className="space-y-3">
                {availableLocations.map((location) => {
                  const count = getFilterCount("locations", location);
                  return (
                    <div
                      key={location}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`location-${location}`}
                          checked={selectedFilters.locations.includes(location)}
                          onCheckedChange={(checked) =>
                            handleFilterChange(
                              "locations",
                              location,
                              checked as boolean
                            )
                          }
                        />
                        <label
                          htmlFor={`location-${location}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {location}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Deadlines */}
      <Card>
        <CardHeader className="pb-3">
          <button
            onClick={() => toggleSection("deadlines")}
            className="flex items-center justify-between w-full text-left"
          >
            <CardTitle className="text-base">Deadline</CardTitle>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.deadlines ? "rotate-180" : ""
              }`}
            />
          </button>
        </CardHeader>
        {expandedSections.deadlines && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {deadlines.map((deadline) => {
                const count = getFilterCount("deadlines", deadline);
                return (
                  <div
                    key={deadline}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`deadline-${deadline}`}
                        checked={selectedFilters.deadlines.includes(deadline)}
                        onCheckedChange={(checked) =>
                          handleFilterChange(
                            "deadlines",
                            deadline,
                            checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor={`deadline-${deadline}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {deadline}
                      </label>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
