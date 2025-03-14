import { useQuery } from '@tanstack/react-query';
import { instance } from '@configs/util';
import { ClassResponse } from './type';

const router = '/class/team';

export const useGetClassItem = () => {
  return useQuery({
    queryKey: ['getClass'],
    queryFn: async () => {
      const { data } = await instance.get<ClassResponse>(`${router}/classItem`);
      return data;
    },
  });
};
