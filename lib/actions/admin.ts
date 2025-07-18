import { http } from "@/lib/http";
import { UserRole } from "@/enum";

// Base API Response interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination interfaces
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Dashboard interfaces
export interface DashboardMetrics {
  totalUsers: number;
  totalOpportunities: number;
  pendingOpportunities: number;
  activeUsers: number;
  recentUsers: number;
  approvedOpportunities: number;
  metrics: {
    userGrowthRate: number;
    opportunityApprovalRate: number;
    avgOpportunitiesPerUser: number;
  };
}

// User interfaces
export interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  interests?: string[];
  education_level?: string;
  experience_years?: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Array<{
    role: UserRole;
    _count: { role: number };
  }>;
  recentSignups: number;
  growthRate: number;
}

// Opportunity interfaces
export interface AdminOpportunity {
  id: string;
  title: string;
  description: string;
  location?: string;
  deadline?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  created_by?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface OpportunityAnalytics {
  totalOpportunities: number;
  approvedOpportunities: number;
  pendingOpportunities: number;
  opportunitiesByCategory: Array<{
    category_id: string;
    _count: { category_id: number };
  }>;
  recentOpportunities: number;
  approvalRate: number;
}

export interface EngagementAnalytics {
  totalViews: number;
  totalClicks: number;
  avgTimeOnSite: number;
  bounceRate: number;
  topPerformingOpportunities: any[];
  userEngagementTrends: any[];
}

// Request interfaces
export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface BulkOpportunityActionPayload {
  ids: string[];
  action: "approve" | "reject" | "delete";
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  perPage?: number;
  search?: string;
}

// Utility function to extract error message from API response
function extractErrorMessage(error: any, defaultMessage: string): string {
  if (error?.response?.data) {
    const apiError = error.response.data;

    if (apiError.message) {
      return apiError.message;
    } else if (apiError.error) {
      return apiError.error;
    } else if (apiError.details) {
      return apiError.details;
    } else if (Array.isArray(apiError)) {
      return apiError.map((err) => err.message || err).join(", ");
    } else if (typeof apiError === "string") {
      return apiError;
    }
  }

  return defaultMessage;
}

// Dashboard API actions
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await http.get<ApiResponse<DashboardMetrics>>(
      "/admin/dashboard"
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Failed to fetch dashboard metrics"
    );
    throw new Error(message);
  }
}

// User Management API actions
export async function getAdminUsers(
  params: PaginationParams = {}
): Promise<PaginatedResponse<AdminUser>> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage)
      queryParams.append("perPage", params.perPage.toString());
    if (params.search) queryParams.append("search", params.search);

    const response = await http.get<ApiResponse<PaginatedResponse<AdminUser>>>(
      `/admin/users?${queryParams.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to fetch users");
    throw new Error(message);
  }
}

export async function getAdminUser(id: string): Promise<AdminUser> {
  try {
    const response = await http.get<ApiResponse<AdminUser>>(
      `/admin/users/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to fetch user");
    throw new Error(message);
  }
}

export async function updateUserRole(
  id: string,
  payload: UpdateUserRolePayload
): Promise<AdminUser> {
  try {
    const response = await http.put<ApiResponse<AdminUser>>(
      `/admin/users/${id}/role`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to update user role");
    throw new Error(message);
  }
}

export async function deactivateUser(id: string): Promise<AdminUser> {
  try {
    const response = await http.post<ApiResponse<AdminUser>>(
      `/admin/users/${id}/deactivate`
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to deactivate user");
    throw new Error(message);
  }
}

export async function activateUser(id: string): Promise<AdminUser> {
  try {
    const response = await http.post<ApiResponse<AdminUser>>(
      `/admin/users/${id}/activate`
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to activate user");
    throw new Error(message);
  }
}

// Opportunity Management API actions
export async function getAdminOpportunities(
  params: PaginationParams & { status?: string } = {}
): Promise<PaginatedResponse<AdminOpportunity>> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage)
      queryParams.append("perPage", params.perPage.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);

    const response = await http.get<
      ApiResponse<PaginatedResponse<AdminOpportunity>>
    >(`/admin/opportunities?${queryParams.toString()}`);
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to fetch opportunities");
    throw new Error(message);
  }
}

export async function getPendingOpportunities(
  params: PaginationParams = {}
): Promise<PaginatedResponse<AdminOpportunity>> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage)
      queryParams.append("perPage", params.perPage.toString());

    const response = await http.get<
      ApiResponse<PaginatedResponse<AdminOpportunity>>
    >(`/admin/opportunities/pending?${queryParams.toString()}`);
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Failed to fetch pending opportunities"
    );
    throw new Error(message);
  }
}

export async function approveOpportunity(
  id: string
): Promise<AdminOpportunity> {
  try {
    const response = await http.put<ApiResponse<AdminOpportunity>>(
      `/admin/opportunities/${id}/approve`
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to approve opportunity");
    throw new Error(message);
  }
}

export async function rejectOpportunity(id: string): Promise<AdminOpportunity> {
  try {
    const response = await http.put<ApiResponse<AdminOpportunity>>(
      `/admin/opportunities/${id}/reject`
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to reject opportunity");
    throw new Error(message);
  }
}

export async function bulkOpportunityAction(
  payload: BulkOpportunityActionPayload
): Promise<{ count: number; action: string }> {
  try {
    const response = await http.post<
      ApiResponse<{ count: number; action: string }>
    >(`/admin/opportunities/bulk-action`, payload);
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to perform bulk action");
    throw new Error(message);
  }
}

// Analytics API actions
export async function getUserAnalytics(): Promise<UserAnalytics> {
  try {
    const response = await http.get<ApiResponse<UserAnalytics>>(
      "/admin/analytics/users"
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Failed to fetch user analytics"
    );
    throw new Error(message);
  }
}

export async function getOpportunityAnalytics(): Promise<OpportunityAnalytics> {
  try {
    const response = await http.get<ApiResponse<OpportunityAnalytics>>(
      "/admin/analytics/opportunities"
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Failed to fetch opportunity analytics"
    );
    throw new Error(message);
  }
}

export async function getEngagementAnalytics(): Promise<EngagementAnalytics> {
  try {
    const response = await http.get<ApiResponse<EngagementAnalytics>>(
      "/admin/analytics/engagement"
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(
      error,
      "Failed to fetch engagement analytics"
    );
    throw new Error(message);
  }
}

// Category interfaces and actions
export interface Category {
  id: string;
  name: string;
  slug: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface CreateOpportunityPayload {
  title: string;
  description: string;
  company: string;
  location: string;
  deadline: string;
  application_url: string;
  image_url: string;
  category_id: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await http.get<ApiResponse<{ data: Category[] }>>(
      "/categories"
    );
    return response.data.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to fetch categories");
    throw new Error(message);
  }
}

export async function createOpportunity(
  payload: CreateOpportunityPayload
): Promise<AdminOpportunity> {
  try {
    const response = await http.post<ApiResponse<AdminOpportunity>>(
      "/opportunities",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    const message = extractErrorMessage(error, "Failed to create opportunity");
    throw new Error(message);
  }
}
