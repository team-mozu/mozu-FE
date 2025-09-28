import { instance } from "@mozu/util-config";
import { useQuery } from "@tanstack/react-query";
import type { StockDetailResponse } from "./type";

const router = "/lesson/team/item";

export const useGetStockDetail = (stockId?: number) => {
  return useQuery({
    queryKey: [
      "stock",
      "detail",
      stockId,
    ],
    queryFn: async () => {
      const { data } = await instance.get<StockDetailResponse>(`${router}/${stockId}`);
      return data;
    },
    enabled: !!stockId,
    staleTime: 5000,
  });
};
