import { instance } from "@mozu/util-config";
import { useQuery } from "@tanstack/react-query";
import type { StockDetailResponse } from "./type";

const router = "/class/team/classItem";

export const useGetStockDetail = (stockId: number | null) => {
  return useQuery({
    queryKey: [
      "getStock",
      stockId,
    ],
    queryFn: async () => {
      const { data } = await instance.get<StockDetailResponse>(`${router}/${stockId}`);
      return data;
    },
    staleTime: 5000,
    gcTime: 5000,
  });
};
