import { instance } from "@mozu/util-config";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { TeamOrdersResponse, TeamRankResponse } from "./type";

const router = "/team";

export const useTeamOrders = (options?: UseQueryOptions<TeamOrdersResponse, AxiosError>) => {
  return useQuery<TeamOrdersResponse, AxiosError>({
    queryKey: [
      "team",
      "orders",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamOrdersResponse>(`${router}/orders`);
      return data;
    },
    ...options,
  });
};

export const useTeamRank = (options?: UseQueryOptions<TeamRankResponse, AxiosError>) => {
  return useQuery<TeamRankResponse, AxiosError>({
    queryKey: [
      "team",
      "rank",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamRankResponse>(`${router}/ranks`);
      return data;
    },
    staleTime: 5000,
    ...options,
  });
};
