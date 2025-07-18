import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminUsers,
  getAdminUser,
  updateUserRole,
  deactivateUser,
  activateUser,
  getUserAnalytics,
  type PaginationParams,
  type UpdateUserRolePayload,
} from "@/lib/actions/admin";

// Query for paginated users list
export const useAdminUsers = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
};

// Query for single user
export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => getAdminUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Query for user analytics
export const useUserAnalytics = () => {
  return useQuery({
    queryKey: ["admin", "analytics", "users"],
    queryFn: getUserAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Mutation for updating user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserRolePayload;
    }) => updateUserRole(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      // Update the single user cache
      queryClient.setQueryData(["admin", "users", variables.id], data);

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "users"],
      });

      toast.success("User role updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });
};

// Mutation for deactivating user
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateUser(id),
    onSuccess: (data, id) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      // Update the single user cache
      queryClient.setQueryData(["admin", "users", id], data);

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "users"],
      });

      toast.success("User deactivated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate user");
    },
  });
};

// Mutation for activating user
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateUser(id),
    onSuccess: (data, id) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      // Update the single user cache
      queryClient.setQueryData(["admin", "users", id], data);

      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "users"],
      });

      toast.success("User activated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to activate user");
    },
  });
};
