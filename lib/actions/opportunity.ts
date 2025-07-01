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

export async function createOpportunity(
  payload: CreateOpportunityPayload
): Promise<any> {
  const response = await http.post("/opportunities", payload);
  return response;
}
