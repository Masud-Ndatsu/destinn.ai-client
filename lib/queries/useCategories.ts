import { useQuery } from "@tanstack/react-query";
import { http } from "../http";
import { getCategories, getCategoryById } from "../actions/category";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => getCategories(),
  });
}

export function useCategoryById(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
