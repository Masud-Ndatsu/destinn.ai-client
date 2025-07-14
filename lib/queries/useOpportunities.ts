import { useQuery } from "@tanstack/react-query";
import { http } from "../http";
import {
  getOpportunities,
  getOpportunitiesByCategoryId,
} from "../actions/opportunity";

export function useOpportunities(categoryId?: string) {
  return useQuery({
    queryKey: ["opportunities", categoryId],
    queryFn: () => getOpportunities(),
  });
}

export function useOpportunitiesByCategoryId(categoryId: string) {
  return useQuery({
    queryKey: ["opportunities", categoryId],
    queryFn: () => getOpportunitiesByCategoryId(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}
