import { http } from "@/lib/http";
import { UserRole } from "@/enum";

// Utility function to extract error message from API response
function extractErrorMessage(error: any, defaultMessage: string): string {
  if (error?.response?.data) {
    const apiError = error.response.data;
    
    // Handle different API error response formats
    if (apiError.message) {
      return apiError.message;
    } else if (apiError.error) {
      return apiError.error;
    } else if (apiError.details) {
      return apiError.details;
    } else if (Array.isArray(apiError)) {
      // Handle validation errors array
      return apiError.map(err => err.message || err).join(", ");
    } else if (typeof apiError === 'string') {
      return apiError;
    }
  }
  
  return defaultMessage;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  education_level?: string;
  experience_years?: number;
  interests?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  education_level?: string;
  experience_years?: number;
  interests?: string[];
  role: UserRole;
  created_at: string;
  updated_at: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export async function getUserProfile(): Promise<ProfileResponse> {
  try {
    console.log("👤 Fetching user profile...");
    
    const response = await http.get<ProfileResponse>("/auth/profile");
    
    console.log("✅ Profile response received:", {
      success: response.data.success,
      message: response.data.message,
      user: {
        id: response.data.data?.id,
        email: response.data.data?.email,
        first_name: response.data.data?.first_name,
        last_name: response.data.data?.last_name,
        education_level: response.data.data?.education_level,
        experience_years: response.data.data?.experience_years,
        interests: response.data.data?.interests?.length || 0
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("❌ Profile fetch failed:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message
    });
    
    const message = extractErrorMessage(error, "Failed to fetch profile. Please try again.");
    throw new Error(message);
  }
}

export async function updateUserProfile(
  payload: UpdateProfilePayload
): Promise<ProfileResponse> {
  try {
    console.log("📝 Updating user profile...");
    console.log("📤 Update payload:", {
      first_name: payload.first_name,
      last_name: payload.last_name,
      education_level: payload.education_level,
      experience_years: payload.experience_years,
      interests: payload.interests?.length || 0
    });
    
    const response = await http.put<ProfileResponse>("/auth/profile", payload);
    
    console.log("✅ Profile update response:", {
      success: response.data.success,
      message: response.data.message,
      updatedUser: {
        id: response.data.data?.id,
        email: response.data.data?.email,
        first_name: response.data.data?.first_name,
        last_name: response.data.data?.last_name
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("❌ Profile update failed:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message
    });
    
    const message = extractErrorMessage(error, "Failed to update profile. Please try again.");
    throw new Error(message);
  }
}