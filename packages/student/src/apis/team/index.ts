import { instance } from "@mozu/util-config";
import { type UseMutationOptions, useMutation, useQuery } from "@tanstack/react-query";
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

export const useGetTeamDetail = () => {
  return useQuery({
    queryKey: [
      "getTeam",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamDeatilResponse>(`${router}`);
      return data;
    },
    staleTime: 5000,
    gcTime: 5000,
  });
};

export const useGetHoldItems = () => {
  return useQuery({
    queryKey: [
      "getHoldItem",
    ],
    queryFn: async () => {
      const { data } = await instance.get<HoldItemsResponse>(`${router}/holditems`);
      console.log("data:", data);
      return data;
    },
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

export const useTeamOrders = () => {
  return useQuery({
    queryKey: [
      "getTeamOrder",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamOrdersResponse>(`${router}/orders`);
      return data;
    },
  });
};

export const useTeamResult = () => {
  return useQuery({
    queryKey: [
      "getTeamResult",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamResultResponse>(`${router}/result`);
      return data;
    },
  });
};

export const useTeamRank = () => {
  return useQuery({
    queryKey: [
      "getTeamRank",
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamRankResponse>(`${router}/rank`);
      return data;
    },
    staleTime: 5000,
    gcTime: 5000,
  });
};
