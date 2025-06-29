import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { http } from "./http";
import { AxiosRequestConfig } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/request.ts

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
