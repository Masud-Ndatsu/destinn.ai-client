import { http } from "@/lib/http";
import { scheduleAutoLogout } from "../utils";
import { UserRole } from "@/enum";

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
  const response = await http.post<SignInResponse>("/auth/login", payload);
  return response.data;
}

export async function signUpUser(
  payload: SignUpPayload
): Promise<SignUpResponse> {
  try {
    const response = await http.post<SignUpResponse>("/auth/register", payload);

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Registration failed. Please try again.";
    throw new Error(message);
  }
}
