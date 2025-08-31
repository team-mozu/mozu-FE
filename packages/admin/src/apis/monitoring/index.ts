import { instance } from "@mozu/util-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HoldItem, TeamTradeStatus } from "./type";

const router = "/class";

export const useClassStop = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      id: number
    ): Promise<{
      id: number;
    }> => {
      const response = await instance.post<{
        id: number;
      }>(`${router}/stop/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["class", "list"] });
      queryClient.invalidateQueries({ queryKey: ["class", "detail", id] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};

export const useGetTeamTradeStatus = (id: number) => {
  return useQuery({
    queryKey: ["team", "tradeStatus", id],
    queryFn: async () => {
      const { data } = await instance.get<TeamTradeStatus[]>(`/team/${id}`);
      return data;
    },
    enabled: !!id,
    refetchInterval: 5000,
  });
};

export const useGetTeamHoldItems = (id: number) => {
  return useQuery({
    queryKey: ["team", "holdItems", id],
    queryFn: async () => {
      const { data } = await instance.get<HoldItem[]>(`/team/${id}/holdItems`);
      return data;
    },
    enabled: !!id,
    refetchInterval: 5000,
  });
};
