import { Toast } from "@mozu/ui";
import { instance } from "@mozu/util-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { StockAddRequest, StockDetailResponse, StockListResponse, StockManagementEditRequest } from "./type";

const router = "/item";

export const useAddStock = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (addData: StockAddRequest) => {
      return await instance.post(`${router}`, addData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: response => {
      const id = response.data.id;
      navigate(`/stock-management/${id}`);
    },
    onError: () => {},
  });
};

export const useDeleteStock = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stockId: number) => {
      return await instance.delete(`${router}/${stockId}`);
    },
    onSuccess: () => {
      Toast("삭제에 성공했습니다.", {
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getStock",
        ],
      });
      if (onSuccessCallback) {
        onSuccessCallback(); // 모달 닫기 실행
      }
    },
    onError: () => {},
  });
};

export const useGetStockDetail = (stockId: number | null) => {
  return useQuery({
    queryKey: [
      "getStock",
      stockId,
    ],
    queryFn: async () => {
      const { data } = await instance.get<StockDetailResponse>(`${router}/${stockId}`);
      return data;
    },
  });
};

export const useGetStockList = () => {
  return useQuery({
    queryKey: [
      "getStock",
    ],
    queryFn: async () => {
      const { data } = await instance.get<{
        items: StockListResponse[];
      }>(`${router}`);
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
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      navigate(-1);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    onError: () => {},
  });
};
