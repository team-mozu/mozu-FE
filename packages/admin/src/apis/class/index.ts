import { Toast } from "@mozu/ui";
import { instance } from "@mozu/util-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import type {
  ClassCreateRequest,
  ClassData,
  ClassDetailResponse,
  ClassResponse,
  TeamDealsResponse,
} from "@/apis";

const router = "/class";

export const useGetClassList = () => {
  return useQuery({
    queryKey: ["class", "list"],
    queryFn: async () => {
      const { data } = await instance.get<ClassResponse>(`${router}`);
      return data;
    },
    staleTime: 1000 * 60,
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
  });
};

export const useClassCreate = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (
      data: ClassCreateRequest
    ): Promise<{
      id: number;
    }> => {
      const response = await instance.post<{
        id: number;
      }>(`${router}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      Toast("성공적으로 생성되었습니다.", {
        type: "success",
      });
      navigate(`/class-management/${data.id}`);
    },
  });
};

export const useClassUpdate = (id: string) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await instance.post(`${router}/update/${id}`, FormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: (data) => {
      Toast("성공적으로 수정되었습니다.", {
        type: "success",
      });
    },
  });
};

export const useClassStar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      await instance.post(`${router}/star/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        ["class", "list"],
        (oldData: ClassResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            classes: oldData.classes.map((item) =>
              item.id === id
                ? {
                    ...item,
                    starYN: !item.starYN,
                  }
                : item
            ),
          };
        }
      );
    },
    onError: () => {
      Toast("즐겨찾기 변경에 실패 했습니다.", {
        type: "error",
      });
    },
  });
};

export const useClassDelete = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await instance.delete(`${router}/${id}`);
    },
    onSuccess: () => {
      Toast("삭제에 성공했습니다.", {
        type: "success",
      });
      if (onSuccessCallback) {
        onSuccessCallback(); // 모달 닫기 실행
      }
      queryClient.invalidateQueries({
        queryKey: ["class", "list"],
      });
    },
    onError: () => {
      Toast("수업 삭제에 실패했습니다.", {
        type: "error",
      });
    },
  });
};

export const useClassStart = (id: number) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await instance.post<{
        classCode: string;
      }>(`${router}/start/${id}`);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("inviteCode", data.classCode);
      Toast("수업을 성공적으로 시작했습니다.", {
        type: "success",
      });
      navigate(`start`);
      // biome-ignore lint/correctness/noSelfAssign: <임시>
      window.location.href = window.location.href;
    },
    onError: () => {},
  });
};

export const useNextDegree = (id: number, onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useMutation({
    mutationFn: async () => {
      await instance.post<{
        id: number;
      }>(`${router}/next/${id}`);
    },
    onSuccess: () => {
      Toast(`수업이 진행되었습니다.`, {
        type: "success",
      });

      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        const newPath = pathname.replace(/\/start$/, "/monitoring");
        navigate(newPath);
      }
    },
    onError: (err) => {
      Toast(`수업 진행에 실패했습니다. ${err}`, {
        type: "error",
      });
    },
  });
};

export const useEditClass = (classId: number) => {
  return useMutation({
    mutationFn: async (payload: ClassData) => {
      await instance.post(`${router}/${classId}`, payload);
    },
    onSuccess: () => {
      Toast(`수업이 수정되었습니다.`, {
        type: "success",
      });
    },
    onError: (err) => {
      Toast(`수업 수정에 실패했습니다. ${err}`, {
        type: "error",
      });
    },
  });
};

export const useTeamDeals = (teamId: number) => {
  return useQuery({
    queryKey: ["team", "deals", teamId],
    queryFn: async () => {
      const { data } = await instance.get<TeamDealsResponse[]>(
        `/team/${teamId}`
      );
      return data;
    },
    enabled: !!teamId,
  });
};
