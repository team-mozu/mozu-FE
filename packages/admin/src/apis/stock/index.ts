import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { instance } from '@configs/util';
import {
  StockManagementEditRequest,
  StockAddRequest,
  StockDetailResponse,
  StockListResponse,
} from './type';
import { useNavigate } from 'react-router';

const router = '/item';

export const useAddStock = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (addData: StockAddRequest) => {
      return await instance.post(`${router}`, addData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (response) => {
      console.log('성공');
      const id = response.data.id;
      navigate(`/stock-management/${id}`);
    },
    onError: (error) => console.log('error', error),
  });
};

export const useDeleteStock = (stockId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await instance.delete(`${router}/${stockId}`);
    },
    onSuccess: (stockId) => {
      console.log('삭제 성공:', stockId);
      queryClient.invalidateQueries({ queryKey: ['getStock'] });
    },
    onError: (error) => console.log('삭제 실패:', error),
  });
};

export const useGetStockDetail = (stockId: number) => {
  return useQuery({
    queryKey: ['getStock', stockId],
    queryFn: async () => {
      const { data } = await instance.get<StockDetailResponse>(
        `${router}/${stockId}`,
      );
      return data;
    },
  });
};

export const useGetStockList = () => {
  return useQuery({
    queryKey: ['getStock'],
    queryFn: async () => {
      const { data } = await instance.get<{ items: StockListResponse[] }>(
        `${router}`,
      );
      return data;
    },
  });
};

export const useEditStock = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (datas: StockManagementEditRequest) => {
      const { stockId: _, ...data } = datas;

      return await instance.post(`${router}/${datas.stockId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      console.log('성공');
      navigate(-1);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    onError: (error) => console.log('error', error),
  });
};
