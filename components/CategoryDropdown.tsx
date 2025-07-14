"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  {
    id: "cmcrfmwte0000q0xh5hn7gz3l",
    name: "Scholarships",
    slug: "scholarships",
    thumbnail_url: null,
    created_at: "2025-07-06T08:50:48.098Z",
  },
  {
    id: "cmcrfmyi50001q0xhdfy4y7u0",
    name: "Fellowships",
    slug: "fellowships",
    thumbnail_url: null,
    created_at: "2025-07-06T08:50:50.285Z",
  },
  {
    id: "cmcrfmzj70002q0xh4dkc6qko",
    name: "Internships",
    slug: "internships",
    thumbnail_url: null,
    created_at: "2025-07-06T08:50:51.619Z",
  },
  {
    id: "cmcrfn0j30003q0xhy1bfq3vz",
    name: "Competitions",
    slug: "competitions",
    thumbnail_url: null,
    created_at: "2025-07-06T08:50:52.911Z",
  },
  {
    id: "cmcrfn1jz0004q0xh513yn4ty",
    name: "Jobs",
    slug: "jobs",
    thumbnail_url: null,
    created_at: "2025-07-06T08:50:54.240Z",
  },
  {
    id: "cmcrfn2c70005q0xh4qtnrx5x",
    name: "Grants",
    slug: "grants",
    thumbnail_url: null,
    created_at: "2025-07-06T08:50:55.255Z",
  },
];

export const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    console.log(`Navigate to category: ${slug}`);
    // Navigate to opportunities page with category filter
    router.push(`/opportunities?category=${slug}`);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        Categories
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 md:w-80 sm:w-64 bg-background border border-border shadow-lg z-50">
          <div className="p-4">
            {/* Mobile: Single column list, Desktop: 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="text-left p-3 hover:bg-muted transition-colors group"
                >
                  <div className="font-medium text-foreground group-hover:text-primary">
                    {category.name}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 capitalize">
                    Browse {category.slug}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
