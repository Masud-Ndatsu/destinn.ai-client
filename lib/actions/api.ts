import { http } from "@/lib/http";

export interface Category {
  id: string;
  name: string;
}

interface GetCategoriesResponse {
  data: Category[];
}

export async function getCategories(): Promise<Category[]> {
  const response = await http.get<GetCategoriesResponse>("/categories");
  return response.data.data;
}
