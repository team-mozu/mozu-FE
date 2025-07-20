import { instance } from "@mozu/util-config";
import { useQuery } from "@tanstack/react-query";
import type { ClassDetailResponse, ClassResponse } from "./type";

const router = "/class/team";

export const useGetClassItem = () => {
  return useQuery({
    queryKey: [
      "getClass",
    ],
    queryFn: async () => {
      const { data } = await instance.get<ClassResponse>(`${router}/classItem`);
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useGetClassDetail = (id: number) => {
  return useQuery({
    queryKey: [
      "getClass",
      id,
    ],
    queryFn: async () => {
      const { data } = await instance.get<ClassDetailResponse>(`${router}/${id}`);
      return data;
    },
  });
};
