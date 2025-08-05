import { instance } from "@mozu/util-config";
import { type UseMutationOptions, type UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  HoldItemsResponse,
  TeamDeatilResponse,
  TeamEndProps,
  TeamOrdersResponse,
  TeamRankResponse,
  TeamResultResponse,
} from "./type";

const router = "/team";

export const useGetTeamDetail = (options?: UseQueryOptions<TeamDeatilResponse, AxiosError>) => {
  return useQuery<TeamDeatilResponse, AxiosError>({
    queryKey: [
      "getTeam",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamDeatilResponse>(`${router}`);
      return data;
    },
    staleTime: 5000,
    gcTime: 5000,
    ...options,
  });
};

export const useGetHoldItems = (options?: UseQueryOptions<HoldItemsResponse, AxiosError>) => {
  return useQuery<HoldItemsResponse, AxiosError>({
    queryKey: [
      "getHoldItem",
    ],
    queryFn: async () => {
      const { data } = await instance.get<HoldItemsResponse>(`${router}/holditems`);
      console.log("data:", data);
      return data;
    },
    ...options,
  });
};

export const useTeamEnd = (options?: UseMutationOptions<void, AxiosError, TeamEndProps>) => {
  return useMutation<void, AxiosError, TeamEndProps>({
    mutationFn: async teamData => {
      const response = await instance.post("/team/end", teamData);
      return response.data;
    },
    ...options,
  });
};

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

export const useTeamResult = (options?: UseQueryOptions<TeamResultResponse, AxiosError>) => {
  return useQuery<TeamResultResponse, AxiosError>({
    queryKey: [
      "getTeamResult",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamResultResponse>(`${router}/result`);
      return data;
    },
    ...options,
  });
};

export const useTeamRank = (options?: UseQueryOptions<TeamRankResponse, AxiosError>) => {
  return useQuery<TeamRankResponse, AxiosError>({
    queryKey: [
      "getTeamRank",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamRankResponse>(`${router}/rank`);
      return data;
    },
    staleTime: 5000,
    gcTime: 5000,
    ...options,
  });
};
