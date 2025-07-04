import { http } from "@/lib/http";

export interface CreateOpportunityPayload {
  title: string;
  company: string;
  location: string;
  deadline: string;
  description: string;
  category_id: string;
  source_url: string;
  application_link: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  source_url: string;
  description?: string;
  category_id: string;
}

export async function createOpportunity(
  payload: CreateOpportunityPayload
): Promise<any> {
  const response = await http.post("/opportunities", payload);
  return response;
}

export async function getOpportunitiesByCategoryId(
  categoryId: string
): Promise<{ data: Opportunity[] }> {
  const response = await http.get(`/categories/${categoryId}/opportunities`);
  return response.data;
}
