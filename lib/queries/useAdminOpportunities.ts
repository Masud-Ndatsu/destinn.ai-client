import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminOpportunities,
  getPendingOpportunities,
  approveOpportunity,
  rejectOpportunity,
  bulkOpportunityAction,
  getOpportunityAnalytics,
  getCategories,
  createOpportunity,
  type PaginationParams,
  type BulkOpportunityActionPayload,
  type CreateOpportunityPayload,
} from "@/lib/actions/admin";

// Query for paginated opportunities list
export const useAdminOpportunities = (
  params: PaginationParams & { status?: string } = {}
) => {
  return useQuery({
    queryKey: ["admin", "opportunities", params],
    queryFn: () => getAdminOpportunities(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
};

// Query for pending opportunities
export const usePendingOpportunities = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["admin", "opportunities", "pending", params],
    queryFn: () => getPendingOpportunities(params),
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for pending items)
    retry: 3,
  });
};

// Query for opportunity analytics
export const useOpportunityAnalytics = () => {
  return useQuery({
    queryKey: ["admin", "analytics", "opportunities"],
    queryFn: getOpportunityAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Mutation for approving opportunity
export const useApproveOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveOpportunity(id),
    onSuccess: (data, id) => {
      // Invalidate and refetch opportunities lists
      queryClient.invalidateQueries({ queryKey: ["admin", "opportunities"] });

      // Invalidate dashboard metrics
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "opportunities"],
      });

      toast.success("Opportunity approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve opportunity");
    },
  });
};

// Mutation for rejecting opportunity
export const useRejectOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectOpportunity(id),
    onSuccess: (data, id) => {
      // Invalidate and refetch opportunities lists
      queryClient.invalidateQueries({ queryKey: ["admin", "opportunities"] });

      // Invalidate dashboard metrics
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "opportunities"],
      });

      toast.success("Opportunity rejected successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject opportunity");
    },
  });
};

// Mutation for bulk opportunity actions
export const useBulkOpportunityAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkOpportunityActionPayload) =>
      bulkOpportunityAction(payload),
    onSuccess: (data, payload) => {
      // Invalidate and refetch opportunities lists
      queryClient.invalidateQueries({ queryKey: ["admin", "opportunities"] });

      // Invalidate dashboard metrics
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "opportunities"],
      });

      const actionText =
        payload.action === "delete" ? "deleted" : `${payload.action}d`;
      toast.success(`${data.count} opportunities ${actionText} successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to perform bulk action");
    },
  });
};

// Query for categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
  });
};

// Mutation for creating opportunity
export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOpportunityPayload) =>
      createOpportunity(payload),
    onSuccess: (data) => {
      // Invalidate and refetch opportunities lists
      queryClient.invalidateQueries({ queryKey: ["admin", "opportunities"] });

      // Invalidate dashboard metrics
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "opportunities"],
      });

      toast.success("Opportunity created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create opportunity");
    },
  });
};
