import { http } from "@/lib/http";

export interface Category {
  id: string;
  name: string;
  description?: string; // in case you use this too
}

interface GetCategoriesResponse {
  data: Category[];
}

export async function getCategories() {
  const response = await http.get("/categories");
  console.log({ response });
  return response.data;
}

export async function getCategoryById(id: string) {
  const response = await http.get(`/categories/${id}`);
  return response.data;
}
