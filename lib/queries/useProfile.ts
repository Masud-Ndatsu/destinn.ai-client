import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile, UpdateProfilePayload } from "../actions/profile";
import { useAuthStore } from "@/store/auth";
import { toast } from "react-toastify";

export function useUserProfile() {
  const { user, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ["profile", user?.email],
    queryFn: getUserProfile,
    enabled: isAuthenticated && !user?.isGuest,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // Update the query cache
      queryClient.setQueryData(["profile", user?.email], data);
      
      // Update the auth store with new user data
      if (user) {
        const updatedUser = {
          ...user,
          firstName: data.data.first_name,
          lastName: data.data.last_name,
          educationLevel: data.data.education_level,
          experienceYears: data.data.experience_years,
          interests: data.data.interests,
        };
        setUser(updatedUser);
      }
      
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}