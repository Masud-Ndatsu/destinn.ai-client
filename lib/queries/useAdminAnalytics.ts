import { useQuery } from '@tanstack/react-query';
import {
  getUserAnalytics,
  getOpportunityAnalytics,
  getEngagementAnalytics,
} from '@/lib/actions/admin';

// Query for user analytics
export const useUserAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'users'],
    queryFn: getUserAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Query for opportunity analytics
export const useOpportunityAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'opportunities'],
    queryFn: getOpportunityAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Query for engagement analytics
export const useEngagementAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'engagement'],
    queryFn: getEngagementAnalytics,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
  });
};

// Combined analytics hook for the main analytics page
export const useAllAnalytics = () => {
  const userAnalytics = useUserAnalytics();
  const opportunityAnalytics = useOpportunityAnalytics();
  const engagementAnalytics = useEngagementAnalytics();

  return {
    userAnalytics,
    opportunityAnalytics,
    engagementAnalytics,
    isLoading: userAnalytics.isLoading || opportunityAnalytics.isLoading || engagementAnalytics.isLoading,
    isError: userAnalytics.isError || opportunityAnalytics.isError || engagementAnalytics.isError,
    error: userAnalytics.error || opportunityAnalytics.error || engagementAnalytics.error,
  };
};