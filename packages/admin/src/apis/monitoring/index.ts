import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { instance } from '@configs/util';
import { Toast } from '@mozu/ui';

const router = '/class';

export const useClassStop = (id: number) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (): Promise<{ id: number }> => {
      const response = await instance.post<{ id: number }>(
        `${router}/stop/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      Toast('수업을 성공적으로 종료했습니다.', { type: 'success' });
      navigate(`/class-management/${id}`);
    },
  });
};
