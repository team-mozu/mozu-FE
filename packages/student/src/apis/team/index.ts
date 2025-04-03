import { useMutation, useQuery } from '@tanstack/react-query';
import { instance } from '@configs/util';
import { HoldItemsResponse, TeamDeatilResponse, TeamEndResponse } from './type';
import { AxiosError } from 'axios';
import { Toast } from '@mozu/ui';

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
  return useMutation<TeamEndResponse, AxiosError>({
    mutationFn: async () => {
      const response = await instance.post<TeamEndResponse>(`${router}/end`);
      return response.data;
    },
    onSuccess: () => {},
    onError: (res: AxiosError<unknown>) => {
      if (res.response) {
        switch (res.response?.status) {
          case 401:
            Toast('참가 코드 혹은 학교를 다시 확인해주세요.', {
              type: 'error',
            });
            break;
          default:
            Toast('로그인에 실패하였습니다.', { type: 'error' });
            break;
        }
      } else {
        Toast('네트워크 연결을 확인해주세요.', {
          type: 'error',
        });
        console.log(res);
      }
    },
  });
};
