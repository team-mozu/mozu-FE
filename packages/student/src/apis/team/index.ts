import { useQuery } from '@tanstack/react-query';
import { instance } from '@configs/util';
import { HoldItemsResponse, TeamDeatilResponse } from './type';

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
      return data;
    },
  });
};
