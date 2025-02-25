import { instance } from '@configs/util';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ClassDetailResponse, ClassResponse } from '@/apis';
import { Toast } from '@mozu/ui';
import { useNavigate } from 'react-router';

const router = '/class';

export const useGetClassList = () => {
  return useQuery({
    queryKey: ['getClass'],
    queryFn: async () => {
      const { data } = await instance.get<ClassResponse>(`${router}`);
      return data;
    },
  });
};

export const useGetClassDetail = (id: string) => {
  return useQuery({
    queryKey: ['getClass', id],
    queryFn: async (): Promise<ClassDetailResponse> => {
      const { data } = await instance.get(`${router}/${id}`);
      return data;
    },
  });
};

export const useClassCreate = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await instance.post<{ id: number }>(
        `${router}/create`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      Toast('성공적으로 생성되었습니다.', { type: 'success' });
      navigate(`class-management/create${data.id}`);
    },
  });
};

export const useClassUpdate = (id: string) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await instance.post(`${router}/update/${id}`, FormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data) => {
      Toast('성공적으로 수정되었습니다.', { type: 'success' });
    },
  });
};

export const useClassStar = (id: number) => {
  return useMutation({
    mutationFn: () => instance.post(`${router}/star/${id}`),
    onSuccess: () => {},
    onError: () => {},
  });
};

export const useClassDelete = (id: number) => {
  return useMutation({
    mutationFn: () => instance.delete(`${router}/delete/${id}`),
    onSuccess: () => {},
    onError: () => {},
  });
};
