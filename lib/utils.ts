import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { http } from "./http";
import { AxiosRequestConfig } from "axios";

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
