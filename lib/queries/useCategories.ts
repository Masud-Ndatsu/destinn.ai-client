import { useQuery } from "@tanstack/react-query";
import { http } from "../http";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await http.get("/categories");
      return res.data;
    },
  });
}
