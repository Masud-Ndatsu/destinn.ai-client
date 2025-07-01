import { http } from "@/lib/http";
import { scheduleAutoLogout } from "../utils";

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
  return response.data.data;
}
