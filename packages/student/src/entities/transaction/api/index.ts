import { instance } from "@mozu/util-config";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { TeamOrdersData, TeamOrdersResponse } from "./type";

const router = "/team";

export const useTeamOrders = (options?: UseQueryOptions<TeamOrdersResponse, AxiosError>) => {
  return useQuery<TeamOrdersResponse, AxiosError>({
    queryKey: [
      "getTeamOrder",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamOrdersResponse>(`${router}/orders`);
      return data;
    },
    ...options,
  });
};
