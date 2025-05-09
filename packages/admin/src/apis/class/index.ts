import { instance } from "@configs/util";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ClassCreateRequest,
  ClassData,
  ClassDetailResponse,
  ClassResponse,
  TeamDealsResponse,
} from "@/apis";
import { Toast } from "@mozu/ui";
import { useLocation, useNavigate } from "react-router";

const router = "/class";

export const useGetClassList = () => {
  return useQuery({
    queryKey: ["getClass"],
    queryFn: async () => {
      const { data } = await instance.get<ClassResponse>(`${router}`);
      return data;
    },
  });
};

export const useGetClassDetail = (id: number) => {
  return useQuery({
    queryKey: ["getClass", id],
    queryFn: async () => {
      const { data } = await instance.get<ClassDetailResponse>(
        `${router}/${id}`
      );
      return data;
    },
  });
};

export const useClassCreate = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: ClassCreateRequest): Promise<{ id: number }> => {
      const response = await instance.post<{ id: number }>(`${router}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      Toast("성공적으로 생성되었습니다.", { type: "success" });
      navigate(`/class-management/${data.id}`);
    },
  });
};

export const useClassUpdate = (id: string) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await instance.post(`${router}/update/${id}`, FormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      Toast("성공적으로 수정되었습니다.", { type: "success" });
    },
  });
};

export const useClassStar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      await instance.post(`${router}/star/${id}`),
    onSuccess: (_, id) => {
      Toast("즐겨찾기 변경에 성공 했습니다.", { type: "success" });
      queryClient.setQueryData(
        ["getClass"],
        (oldData: ClassResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            classes: oldData.classes.map((item) =>
              item.id === id ? { ...item, starYN: !item.starYN } : item
            ),
          };
        }
      );
    },
    onError: (error) => {
      Toast("즐겨찾기 변경에 실패 했습니다.", { type: "error" });
      console.log(error);
    },
  });
};

export const useClassDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await instance.delete(`${router}/${id}`);
    },
    onSuccess: () => {
      Toast("삭제에 성공했습니다.", { type: "success" });
      queryClient.invalidateQueries({ queryKey: ["getClass"] });
    },
    onError: (error) => console.log("error", error),
  });
};

export const useClassStart = (id: number) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await instance.post<{ classCode: string }>(
        `${router}/start/${id}`
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("inviteCode", data.classCode);
      Toast("수업을 성공적으로 시작했습니다.", { type: "success" });
      navigate(`start`);
      window.location.href = window.location.href;
    },
    onError: (error) => {
      console.log(error);
    },
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
      Toast(`수업이 진행되었습니다.`, { type: "success" });

      const newPath = pathname.replace(/\/start$/, "/monitoring");
      navigate(newPath);
    },
    onError: (err) => {
      Toast(`수업 진행에 실패했습니다. ${err}`, { type: "error" });
    },
  });
};

export const useEditClass = (classId: number) => {
  return useMutation({
    mutationFn: async (payload: ClassData) => {
      await instance.post(`${router}/${classId}`, payload);
    },
    onSuccess: () => {
      Toast(`수업이 수정되었습니다.`, { type: "success" });
    },
    onError: (err) => {
      Toast(`수업 수정에 실패했습니다. ${err}`, { type: "error" });
    },
  });
};

export const useTeamDeals = (teamId: number) => {
  return useQuery({
    queryKey: ["teamDeals", teamId],
    queryFn: async (teamId) => {
      const { data } = await instance.get<TeamDealsResponse[]>(
        `/team/${teamId}`
      );
      return data;
    },
    enabled: !!teamId,
  });
};
