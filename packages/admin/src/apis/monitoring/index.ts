import { Toast } from "@mozu/ui";
import { instance } from "@mozu/util-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { HoldItem, TeamTradeStatus } from "./type";

const router = "/class";

export const useClassStop = (id: number) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (): Promise<{
      id: number;
    }> => {
      const response = await instance.post<{
        id: number;
      }>(`${router}/stop/${id}`);
      return response.data;
    },
    onSuccess: () => {
      Toast("수업을 성공적으로 종료했습니다.", {
        type: "success",
      });
      navigate(`/class-management/${id}`);
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
