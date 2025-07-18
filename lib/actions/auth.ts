import { http } from "@/lib/http";
import { scheduleAutoLogout } from "../utils";
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

interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  education_level?: string;
  experience_years?: number;
  interests?: string[];
}

interface SignInResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: {
      interests: string[] | undefined;
      experience_years: number | undefined;
      education_level: string | undefined;
      id: string;
      name: string;
      email: string;
      role: UserRole;
      first_name?: string;
      last_name?: string;
    };
  };
}

interface SignUpResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: UserRole;
    first_name?: string;
    last_name?: string;
  };
}

export async function signInUser(
  payload: SignInPayload
): Promise<SignInResponse> {
  try {
    console.log("🔐 Starting signin request...");
    console.log("📧 Email:", payload.email);
    console.log("🔗 API URL:", process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000");
    console.log("📤 Request payload:", { email: payload.email, password: "[REDACTED]" });
    
    const response = await http.post<SignInResponse>("/auth/login", payload);
    
    console.log("✅ Signin response received:");
    console.log("📊 Status:", response.status);
    console.log("📋 Response data:", {
      success: response.data.success,
      message: response.data.message,
      user: {
        id: response.data.data?.user?.id,
        email: response.data.data?.user?.email,
        role: response.data.data?.user?.role,
        first_name: response.data.data?.user?.first_name,
        last_name: response.data.data?.user?.last_name
      },
      hasToken: !!response.data.data?.access_token
    });
    
    return response.data;
  } catch (error: any) {
    console.error("❌ Signin request failed:");
    console.error("🔍 Error details:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        baseURL: error?.config?.baseURL
      }
    });
    
    const message = extractErrorMessage(error, "Login failed. Please check your credentials and try again.");
    throw new Error(message);
  }
}

export async function signUpUser(
  payload: SignUpPayload
): Promise<SignUpResponse> {
  try {
    const response = await http.post<SignUpResponse>("/auth/register", payload);
    return response.data;
  } catch (error: any) {
    let message = extractErrorMessage(error, "Registration failed. Please try again.");
    
    // Override with specific messages for common status codes
    if (error?.response?.status === 409) {
      message = "An account with this email already exists.";
    } else if (error?.response?.status === 400 && !error?.response?.data?.message) {
      message = "Invalid registration data. Please check your inputs.";
    } else if (error?.response?.status >= 500) {
      message = "Server error. Please try again later.";
    }
    
    throw new Error(message);
  }
}
