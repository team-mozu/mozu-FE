import { instance } from "@mozu/util-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { HoldItem, TeamTradeStatus } from "./type";

const router = "/class";

export const useClassStop = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: async (
      id: number,
    ): Promise<{
      id: number;
    }> => {
      const response = await instance.post<{
        id: number;
      }>(`${router}/stop/${id}`);
      return response.data;
    },
    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};

export const useGetTeamTradeStatus = (id: number) => {
  return useQuery({
    queryKey: [
      "getTeamTradeStatus",
      id,
    ],
    queryFn: async () => {
      const { data } = await instance.get<TeamTradeStatus[]>(`/team/${id}`);
      return data;
    },
  });
};

export const useGetTeamHoldItems = (id: number) => {
  return useQuery({
    queryKey: [
      "getTeamHoldItems",
      id,
    ],
    queryFn: async () => {
      const { data } = await instance.get<HoldItem[]>(`/team/${id}/holdItems`);
      return data;
    },
  });
};
