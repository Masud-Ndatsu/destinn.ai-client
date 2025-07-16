import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getOpportunities } from "@/lib/actions/opportunity";
import { getCategories } from "@/lib/actions/category";
import { useMemo } from "react";

// Type definitions
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

export interface OpportunityWithCategory extends Opportunity {
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

interface CategoriesResponse {
  data: Category[];
}

interface Filters {
  categories: string[];
  types: string[];
  locations: string[];
  deadlines: string[];
}

interface OpportunityStore {
  // State
  opportunities: OpportunityWithCategory[];
  categories: Category[];
  filters: Filters;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  viewMode: "grid" | "list";
  sortBy: string;
  selectedOpportunity: OpportunityWithCategory | null;
  showFilters: boolean;

  // Loading states
  isLoading: boolean;
  categoriesLoading: boolean;
  error: string | null;
  categoriesError: string | null;

  // Actions
  setOpportunities: (opportunities: OpportunityWithCategory[]) => void;
  setCategories: (categories: Category[]) => void;
  setFilters: (filters: Filters) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sortBy: string) => void;
  setSelectedOpportunity: (opportunity: OpportunityWithCategory | null) => void;
  setShowFilters: (show: boolean) => void;

  // Async actions
  fetchOpportunities: (page?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;

  // Computed getters
  getFilteredOpportunities: () => OpportunityWithCategory[];
  getUniqueLocations: () => string[];
  transformOpportunityForCard: (opp: OpportunityWithCategory) => any;
  getRelatedOpportunities: (
    opportunity: OpportunityWithCategory
  ) => OpportunityWithCategory[];

  // Reset functions
  resetFilters: () => void;
  resetSearch: () => void;
  resetPagination: () => void;
}

const defaultFilters: Filters = {
  categories: [],
  types: [],
  locations: [],
  deadlines: [],
};

export const useOpportunityStore = create<OpportunityStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        opportunities: [],
        categories: [],
        filters: defaultFilters,
        searchQuery: "",
        currentPage: 1,
        pageSize: 20,
        totalPages: 0,
        totalItems: 0,
        viewMode: "grid",
        sortBy: "newest",
        selectedOpportunity: null,
        showFilters: false,

        // Loading states
        isLoading: false,
        categoriesLoading: false,
        error: null,
        categoriesError: null,

        // Basic setters
        setOpportunities: (opportunities) => set({ opportunities }),
        setCategories: (categories) => {
          set({ categories });
          // Auto-set all categories as selected when first loaded
          const current = get();
          if (current.filters.categories.length === 0) {
            set({
              filters: {
                ...current.filters,
                categories: categories.map((cat) => cat.name),
              },
            });
          }
        },
        setFilters: (filters) => set({ filters }),
        setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
        setCurrentPage: (currentPage) => set({ currentPage }),
        setViewMode: (viewMode) => set({ viewMode }),
        setSortBy: (sortBy) => set({ sortBy }),
        setSelectedOpportunity: (selectedOpportunity) =>
          set({ selectedOpportunity }),
        setShowFilters: (showFilters) => set({ showFilters }),

        // Async actions
        fetchOpportunities: async (page?: number) => {
          const currentPage = page || get().currentPage;
          set({ isLoading: true, error: null });

          try {
            const response = await getOpportunities(currentPage);
            const categoriesMap = new Map(
              get().categories.map((cat: Category) => [cat.id, cat])
            );

            const transformedOpportunities = response.data.data.map(
              (opp: any) => ({
                ...opp,
                category: categoriesMap.get(opp.category_id),
                type: "Opportunity",
                amount: "N/A",
                tags: [],
                featured: false,
              })
            );

            set({
              opportunities: transformedOpportunities,
              totalPages: response.data.meta.totalPages,
              totalItems: response.data.meta.total,
              currentPage: response.data.meta.currentPage,
              isLoading: false,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch opportunities",
              isLoading: false,
            });
          }
        },

        fetchCategories: async () => {
          set({ categoriesLoading: true, categoriesError: null });

          try {
            const response = await getCategories();
            get().setCategories(response.data.data);
            set({ categoriesLoading: false });
          } catch (error) {
            set({
              categoriesError:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch categories",
              categoriesLoading: false,
            });
          }
        },

        // Computed getters
        getFilteredOpportunities: () => {
          const { opportunities, searchQuery, filters, sortBy } = get();
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
          if (filters.categories.length > 0) {
            filtered = filtered.filter(
              (opp) =>
                opp.category && filters.categories.includes(opp.category.name)
            );
          }

          // Location filter
          if (filters.locations.length > 0) {
            filtered = filtered.filter((opp) =>
              filters.locations.includes(opp.location)
            );
          }

          // Deadline filter
          if (filters.deadlines.length > 0) {
            const now = new Date();
            filtered = filtered.filter((opp) => {
              // Handle rolling deadlines
              if (opp.deadline === "Rolling" || opp.deadline === "Ongoing") {
                return filters.deadlines.includes("Rolling");
              }

              try {
                const deadline = new Date(opp.deadline);
                const daysUntilDeadline = Math.ceil(
                  (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );

                return filters.deadlines.some((filter) => {
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
                if (a.deadline === "Rolling" && b.deadline === "Rolling")
                  return 0;
                if (a.deadline === "Rolling") return 1;
                if (b.deadline === "Rolling") return -1;
                return (
                  new Date(a.deadline).getTime() -
                  new Date(b.deadline).getTime()
                );
              });
              break;
            case "popular":
              filtered.sort(
                (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
              );
              break;
            case "oldest":
              filtered.sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              );
              break;
            default: // newest first
              filtered.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              );
          }

          return filtered;
        },

        getUniqueLocations: () => {
          const { opportunities } = get();
          const locations = new Set<string>();
          opportunities.forEach((opp) => locations.add(opp.location));
          return Array.from(locations);
        },

        transformOpportunityForCard: (opp: OpportunityWithCategory) => ({
          ...opp,
          category: opp.category?.name || "Unknown",
          applyUrl: opp.application_url,
          applicationInstructions:
            "Visit the application link to apply for this opportunity.",
        }),

        getRelatedOpportunities: (opportunity: OpportunityWithCategory) => {
          const { opportunities } = get();
          return opportunities
            .filter(
              (opp) =>
                opp.id !== opportunity.id &&
                opp.category_id === opportunity.category_id
            )
            .slice(0, 3);
        },

        // Reset functions
        resetFilters: () => {
          const { categories } = get();
          set({
            filters: {
              categories: categories.map((cat) => cat.name),
              types: [],
              locations: [],
              deadlines: [],
            },
          });
        },

        resetSearch: () => set({ searchQuery: "", currentPage: 1 }),

        resetPagination: () => set({ currentPage: 1 }),
      }),
      {
        name: "opportunity-store",
        // Only persist non-sensitive UI state
        partialize: (state) => ({
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          pageSize: state.pageSize,
          showFilters: state.showFilters,
        }),
      }
    ),
    {
      name: "opportunity-store",
    }
  )
);

// Selectors for better performance
export const useOpportunities = () =>
  useOpportunityStore((state) => state.opportunities);
export const useCategories = () =>
  useOpportunityStore((state) => state.categories);
export const useFilters = () => useOpportunityStore((state) => state.filters);
export const useSearchQuery = () =>
  useOpportunityStore((state) => state.searchQuery);
export const useCurrentPage = () =>
  useOpportunityStore((state) => state.currentPage);
export const useViewMode = () => useOpportunityStore((state) => state.viewMode);
export const useSortBy = () => useOpportunityStore((state) => state.sortBy);
export const useSelectedOpportunity = () =>
  useOpportunityStore((state) => state.selectedOpportunity);
export const useShowFilters = () =>
  useOpportunityStore((state) => state.showFilters);
export const useIsLoading = () =>
  useOpportunityStore((state) => state.isLoading);
export const useCategoriesLoading = () =>
  useOpportunityStore((state) => state.categoriesLoading);
export const useError = () => useOpportunityStore((state) => state.error);
export const useCategoriesError = () =>
  useOpportunityStore((state) => state.categoriesError);

// Action selectors
export const useOpportunityActions = () => {
  const setOpportunities = useOpportunityStore(
    (state) => state.setOpportunities
  );
  const setCategories = useOpportunityStore((state) => state.setCategories);
  const setFilters = useOpportunityStore((state) => state.setFilters);
  const setSearchQuery = useOpportunityStore((state) => state.setSearchQuery);
  const setCurrentPage = useOpportunityStore((state) => state.setCurrentPage);
  const setViewMode = useOpportunityStore((state) => state.setViewMode);
  const setSortBy = useOpportunityStore((state) => state.setSortBy);
  const setSelectedOpportunity = useOpportunityStore(
    (state) => state.setSelectedOpportunity
  );
  const setShowFilters = useOpportunityStore((state) => state.setShowFilters);
  const fetchOpportunities = useOpportunityStore(
    (state) => state.fetchOpportunities
  );
  const fetchCategories = useOpportunityStore((state) => state.fetchCategories);
  const resetFilters = useOpportunityStore((state) => state.resetFilters);
  const resetSearch = useOpportunityStore((state) => state.resetSearch);
  const resetPagination = useOpportunityStore((state) => state.resetPagination);

  return {
    setOpportunities,
    setCategories,
    setFilters,
    setSearchQuery,
    setCurrentPage,
    setViewMode,
    setSortBy,
    setSelectedOpportunity,
    setShowFilters,
    fetchOpportunities,
    fetchCategories,
    resetFilters,
    resetSearch,
    resetPagination,
  };
};

// Computed selectors
export const useFilteredOpportunities = () => {
  const getFilteredOpportunities = useOpportunityStore(
    (s) => s.getFilteredOpportunities
  );
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const searchQuery = useOpportunityStore((s) => s.searchQuery);
  const filters = useOpportunityStore((s) => s.filters);
  const sortBy = useOpportunityStore((s) => s.sortBy);

  // Apply memo AFTER collecting dependencies
  const filtered = useMemo(
    () => getFilteredOpportunities(),
    [getFilteredOpportunities, opportunities, searchQuery, filters, sortBy]
  );

  return filtered;
};

export const useUniqueLocations = () => {
  const opportunities = useOpportunityStore((s) => s.opportunities);

  const locations = useMemo(() => {
    const locations = new Set<string>();
    opportunities.forEach((opp) => locations.add(opp.location));
    return Array.from(locations);
  }, [opportunities]);

  return locations;
};

export const useTransformOpportunityForCard = () => {
  const fn = useOpportunityStore((s) => s.transformOpportunityForCard);
  return fn;
};

export const useGetRelatedOpportunities = () => {
  const fn = useOpportunityStore((s) => s.getRelatedOpportunities);
  return fn;
};

// Pagination selectors
export const usePagination = () => {
  const currentPage = useOpportunityStore((state) => state.currentPage);
  const totalPages = useOpportunityStore((state) => state.totalPages);
  const totalItems = useOpportunityStore((state) => state.totalItems);
  const pageSize = useOpportunityStore((state) => state.pageSize);

  return {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
  };
};

// Combined selectors for common use cases
export const useOpportunityData = () => {
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const getFilteredOpportunities = useOpportunityStore(
    (s) => s.getFilteredOpportunities
  );
  const categories = useOpportunityStore((s) => s.categories);
  const getUniqueLocations = useOpportunityStore((s) => s.getUniqueLocations);
  const isLoading = useOpportunityStore((s) => s.isLoading);
  const error = useOpportunityStore((s) => s.error);

  const filtered = () => getFilteredOpportunities();
  const locations = () => getUniqueLocations();

  return {
    opportunities,
    filteredOpportunities: filtered,
    categories,
    uniqueLocations: locations,
    isLoading,
    error,
  };
};

export const useOpportunityUI = () => {
  const viewMode = useOpportunityStore((state) => state.viewMode);
  const sortBy = useOpportunityStore((state) => state.sortBy);
  const showFilters = useOpportunityStore((state) => state.showFilters);
  const selectedOpportunity = useOpportunityStore(
    (state) => state.selectedOpportunity
  );
  const searchQuery = useOpportunityStore((state) => state.searchQuery);
  const filters = useOpportunityStore((state) => state.filters);

  return {
    viewMode,
    sortBy,
    showFilters,
    selectedOpportunity,
    searchQuery,
    filters,
  };
};
