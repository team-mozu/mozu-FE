import { useMutation, useQuery } from '@tanstack/react-query';
import { instance } from '@configs/util';
import {
  HoldItemsResponse,
  TeamDeatilResponse,
  TeamEndProps,
  TeamOrdersResponse,
  TeamRankResponse,
  TeamResultResponse,
} from './type';
import { AxiosError } from 'axios';

const router = '/team';

export const useGetTeamDetail = () => {
  return useQuery({
    queryKey: ['getTeam'],
    queryFn: async () => {
      const { data } = await instance.get<TeamDeatilResponse>(`${router}`);
      return data;
    },
  });
};

export const useGetHoldItems = () => {
  return useQuery({
    queryKey: ['getHoldItem'],
    queryFn: async () => {
      const { data } = await instance.get<HoldItemsResponse>(
        `${router}/holditems`,
      );
      console.log('data:', data);
      return data;
    },
  });
};

export const useTeamEnd = () => {
  return useMutation<void, AxiosError, TeamEndProps>({
    mutationFn: async (teamData) => {
      const response = await instance.post('/team/end', teamData);
      return response.data;
    },
    onSuccess: () => {
      console.log('팀 종료 성공');
    },
    onError: (error) => {
      console.error('팀 종료 실패:', error);
    },
  });
};

export const useTeamOrders = () => {
  return useQuery({
    queryKey: ['getTeamOrder'],
    queryFn: async () => {
      const { data } = await instance.get<TeamOrdersResponse>(
        `${router}/orders`,
      );
      return data;
    },
  });
};

export const useTeamResult = () => {
  return useQuery({
    queryKey: ['getTeamResult'],
    queryFn: async () => {
      const { data } = await instance.get<TeamResultResponse>(
        `${router}/result`,
      );
      return data;
    },
  });
};

export const useTeamRank = () => {
  return useQuery({
    queryKey: ['getTeamRank'],
    queryFn: async () => {
      const { data } = await instance.get<TeamRankResponse>(`${router}/rank`);
      return data;
    },
  });
};
