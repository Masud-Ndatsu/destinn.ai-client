import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { http } from "./http";
import { AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function request<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  const res = await http.request({
    url,
    method: options?.method || "GET",
    data: options?.data,
    headers: {
      ...options?.headers,
    },
  });

  return res.data;
}

// utils/uploadBanner.ts
export async function uploadFile(
  file: File,
  folder: string
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/file/upload/${folder}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    console.log({ data });
    return data.url as string;
  } catch (error) {
    console.error("Banner upload error:", error);
    return null;
  }
}

function getTokenExpiration(token: string): number {
  const decoded: { exp: number } = jwtDecode(token);
  console.log({ decoded });
  return decoded.exp * 1000; // convert to milliseconds
}

export function scheduleAutoLogout(token: string, onLogout: () => void) {
  const expiryTime = getTokenExpiration(token);
  const timeLeft = expiryTime - Date.now();

  if (timeLeft <= 0) {
    onLogout();
  } else {
    setTimeout(() => {
      onLogout();
    }, timeLeft);
  }
}

export const scrollToChat = () => {
  const chatWidget = document.querySelector("[data-chat-widget]");
  if (chatWidget) {
    chatWidget.scrollIntoView({ behavior: "smooth" });
  }
};
