import { instance } from "@mozu/util-config";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { HoldItemsResponse } from "./type";

const router = "/team";

export const useGetHoldItems = (options?: UseQueryOptions<HoldItemsResponse, AxiosError>) => {
  return useQuery<HoldItemsResponse, AxiosError>({
    queryKey: [
      "team",
      "holdItems",
    ],
    queryFn: async () => {
      const { data } = await instance.get<HoldItemsResponse>(`${router}/stocks`);
      return data;
    },
    ...options,
  });
};
