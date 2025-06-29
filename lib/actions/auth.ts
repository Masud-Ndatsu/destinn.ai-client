import { http } from "@/lib/http";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function signInUser(
  payload: SignInPayload
): Promise<SignInResponse> {
  const response = await http.post<{ data: SignInResponse }>(
    "/auth/login",
    payload
  );
  // Store token (optional)
  if (typeof window !== "undefined") {
    localStorage.setItem("token", response.data.data.access_token);
  }
  return response.data.data;
}
