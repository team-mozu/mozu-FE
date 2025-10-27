import { instance } from "@mozu/util-config";
import { useQuery } from "@tanstack/react-query";
import type { StockDetailResponse } from "./type";

const router = "/lesson";

export const useGetStockDetail = (stockId?: number) => {
  return useQuery({
    queryKey: [
      "stock",
      "detail",
      stockId,
    ],
    queryFn: async () => {
      const { data } = await instance.get<StockDetailResponse>(`${router}/team/item/${stockId}`);
      return data;
    },
    enabled: !!stockId,
    staleTime: 5000,
  });
};
