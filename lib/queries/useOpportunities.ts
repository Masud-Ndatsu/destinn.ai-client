import { useQuery } from "@tanstack/react-query";
import { http } from "../http";

export function useOpportunities(categoryId?: string) {
  return useQuery({
    queryKey: ["opportunities", categoryId],
    queryFn: async () => {
      const res = await http.get("/opportunities", {
        params: { categoryId },
      });
      return res.data;
    },
  });
}
