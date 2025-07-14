"use client";
import { useState } from "react";
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
}

const categories = [
  "Technology",
  "Education",
  "STEM",
  "Entrepreneurship",
  "Arts",
  "Healthcare",
];
const types = [
  "Scholarship",
  "Fellowship",
  "Internship",
  "Grant",
  "Program",
  "Competition",
];
const locations = ["Remote", "USA", "UK", "Europe", "Asia", "Global"];
const deadlines = [
  "Next 7 days",
  "This month",
  "Next 3 months",
  "Next 6 months",
];

export const FilterSidebar = ({
  selectedFilters,
  onFiltersChange,
  sortBy,
  onSortChange,
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    types: true,
    locations: false,
    deadlines: false,
  });

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
      categories: [],
      types: [],
      locations: [],
      deadlines: [],
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (arr) => arr.length > 0
  );

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
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedFilters.categories.includes(category)}
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
              ))}
            </div>
          </CardContent>
        )}
      </Card>

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
              {types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
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
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Locations */}
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
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
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
              ))}
            </div>
          </CardContent>
        )}
      </Card>

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
              {deadlines.map((deadline) => (
                <div key={deadline} className="flex items-center space-x-2">
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
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
