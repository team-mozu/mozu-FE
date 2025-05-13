import { useQuery } from "@tanstack/react-query";
import { instance } from "@configs/util";
import { StockDetailResponse } from "./type";

const router = "/class/team/classItem";

export const useGetStockDetail = (stockId: number) => {
  return useQuery({
    queryKey: ["getStock", stockId],
    queryFn: async () => {
      const { data } = await instance.get<StockDetailResponse>(
        `${router}/${stockId}`
      );
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
