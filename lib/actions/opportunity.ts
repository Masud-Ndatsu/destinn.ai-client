import { http } from "@/lib/http";

export interface CreateOpportunityPayload {
  title: string;
  company?: string;
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
  company?: string;
  location: string;
  deadline: string;
  source_url: string;
  description?: string;
  category_id: string;
  application_url?: string; // Added to match API response
  created_at?: string;
  updated_at?: string;
  is_approved?: boolean; // Added to match API response
  source_type?: string; // Added to match API response
  created_by_id?: string | null; // Added to match API response
}

// Define pagination meta structure
export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

// Define the API response structure
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Define paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export async function createOpportunity(
  payload: CreateOpportunityPayload
): Promise<ApiResponse<Opportunity>> {
  try {
    const response = await http.post<ApiResponse<Opportunity>>(
      "/opportunities",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating opportunity:", error);
    throw error;
  }
}

export async function getOpportunitiesByCategoryId(
  categoryId: string,
  page: number = 1,
  perPage: number = 20
): Promise<ApiResponse<PaginatedResponse<Opportunity>>> {
  try {
    const response = await http.get<
      ApiResponse<PaginatedResponse<Opportunity>>
    >(
      `/categories/${categoryId}/opportunities?page=${page}&perPage=${perPage}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching opportunities for category ${categoryId}:`,
      error
    );
    throw error;
  }
}

export async function getOpportunities(
  page: number = 1,
  perPage: number = 20,
  search?: string,
  category?: string
): Promise<ApiResponse<PaginatedResponse<Opportunity>>> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });

    if (search) params.append("search", search);
    if (category) params.append("category", category);

    const response = await http.get<
      ApiResponse<PaginatedResponse<Opportunity>>
    >(`/opportunities?${params.toString()}`);
    console.log({ response });
    return response.data;
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    throw error;
  }
}

// Additional utility function to get opportunity by ID
export async function getOpportunityById(
  id: string
): Promise<ApiResponse<Opportunity>> {
  try {
    const response = await http.get<ApiResponse<Opportunity>>(
      `/opportunities/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching opportunity ${id}:`, error);
    throw error;
  }
}
