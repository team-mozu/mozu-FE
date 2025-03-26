import { useQuery } from '@tanstack/react-query';
import { instance } from '@configs/util';
import { TeamDeatilResponse } from './type';

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
