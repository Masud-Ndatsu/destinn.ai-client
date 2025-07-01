import { http } from "@/lib/http";

export interface Category {
  id: string;
  name: string;
}

interface GetCategoriesResponse {
  data: Category[];
}

export async function getCategories(): Promise<{ data: Category[] }> {
  const response = await http.get("/categories");
  console.log({ response });
  return response.data;
}
