import { instance } from '@configs/util';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ClassDetailResponse, ClassResponse } from '@/apis';
import { Toast } from '@mozu/ui';
import { useLocation, useNavigate } from 'react-router';
import { useClassStore } from '@/store';

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

export const useGetClassDetail = (id: number) => {
  return useQuery({
    queryKey: ['getClass', id],
    queryFn: async () => {
      const { data } = await instance.get<ClassDetailResponse>(
        `${router}/${id}`,
      );
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
    mutationFn: async () => await instance.post(`${router}/star/${id}`),
    onSuccess: () => {
      Toast('즐겨찾기 추가에 성공 했습니다.', { type: 'success' });
    },
    onError: () => {
      Toast('즐겨찾기 추가에 실패 했습니다.', { type: 'error' });
    },
  });
};

export const useClassDelete = (id: number) => {
  return useMutation({
    mutationFn: () => instance.delete(`${router}/delete/${id}`),
    onSuccess: () => {},
    onError: () => {},
  });
};

export const useClassStart = (id: number) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await instance.post<{ classCode: string }>(
        `${router}/start/${id}`,
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('inviteCode', data.classCode);
      Toast('수업을 성공적으로 시작했습니다.', { type: 'success' });
      navigate(`start`);
      window.location.href = window.location.href;
    },
    onError: () => {},
  });
};

export const useNextDegree = (id: number) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useMutation({
    mutationFn: async () => {
      await instance.post<{ id: number }>(`${router}/next/${id}`);
    },
    onSuccess: () => {
      Toast(`수업이 진행되었습니다.`, { type: 'success' });

      const newPath = pathname.replace(/\/start$/, '/monitoring');
      navigate(newPath);
    },
    onError: (err) => {
      Toast(`수업 진행에 실패했습니다. ${err}`, { type: 'error' });
    },
  });
};
