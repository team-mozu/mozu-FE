import { instance } from "@mozu/util-config";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ClassDetailResponse, ClassResponse } from "./type";

const router = "/class/team";

export const useGetClassItem = (
  options?: UseQueryOptions<ClassResponse, AxiosError>
) => {
  return useQuery({
    queryKey: ["class", "list"],
    queryFn: async () => {
      const { data } = await instance.get<ClassResponse>(`${router}/classItem`);
      return data;
    },
    // 세션 동안 데이터가 절대 변경되지 않는다고 가정
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
};

export const useGetClassDetail = (id: number) => {
  return useQuery({
    queryKey: ["class", "detail", id],
    queryFn: async () => {
      const { data } = await instance.get<ClassDetailResponse>(
        `${router}/${id}`
      );
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};
