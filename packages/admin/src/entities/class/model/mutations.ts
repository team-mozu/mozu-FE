import { Toast } from "@mozu/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createLesson,
  deleteLesson,
  endLesson,
  nextDegree,
  startDegree,
  startLesson,
  toggleStar,
  updateLesson,
} from "../api";
import type {
  LessonCreateRequest,
  LessonCreateResponse,
  LessonEditDetailRequest,
  LessonEditResponse,
  LessonGetListResponse,
  LessonStartResponse,
} from "../api/type";

/**
 * 새로운 수업을 생성하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 생성된 수업 상세 페이지로 이동합니다.
 * @returns {UseMutationResult} 수업 생성 mutation 객체
 */
export const useCreateClass = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: LessonCreateRequest) => createLesson(data),
    onSuccess: (data: LessonCreateResponse) => {
      Toast("성공적으로 생성되었습니다.", {
        type: "success",
      });
      navigate(`/class-management/${data.id}`);
    },
  });
};

/**
 * 수업을 삭제하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 캐시를 무효화하여 목록을 새로고침합니다.
 * @param {string} id - 삭제할 수업의 ID (UUID)
 * @param {Function} [onSuccessCallback] - 삭제 성공 시 실행될 콜백 함수 (주로 모달 닫기)
 * @returns {UseMutationResult} 수업 삭제 mutation 객체
 */
export const useDeleteClass = (id?: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteLesson(id!),
    onSuccess: () => {
      Toast("삭제에 성공했습니다.", {
        type: "success",
      });
      onSuccessCallback?.();
      queryClient.invalidateQueries({
        queryKey: [
          "getClass",
        ],
      });
    },
    onError: () => {
      Toast("수업 삭제에 실패했습니다.", {
        type: "error",
      });
    },
  });
};

/**
 * 기존 수업의 정보를 수정하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 수정된 수업 상세 페이지로 이동합니다.
 * @param {string} id - 수정할 수업의 ID (UUID)
 * @returns {UseMutationResult} 수업 수정 mutation 객체
 */
export const useUpdateClass = (id?: string) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: LessonEditDetailRequest) => updateLesson(id!, data),
    onSuccess: (data: LessonEditResponse) => {
      Toast("성공적으로 수정되었습니다.", {
        type: "success",
      });
      navigate(`/class-management/${data.id}`);
    },
  });
};

/**
 * 수업을 시작하는 React Query Mutation 훅입니다.
 * 성공 시 초대 코드를 로컬 스토리지에 저장하고 수업 시작 페이지로 이동합니다.
 * @param {string} id - 시작할 수업의 ID (UUID)
 * @returns {UseMutationResult} 수업 시작 mutation 객체
 */
export const useStartClass = (id?: string) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => startLesson(id!),
    onSuccess: (data: LessonStartResponse) => {
      localStorage.setItem("inviteCode", data.lessonCode);
      Toast("수업을 성공적으로 시작했습니다.", {
        type: "success",
      });
      navigate("start");
    },
    onError: () => {
      Toast("수업 시작에 실패했습니다.", {
        type: "error",
      });
    },
  });
};

/**
 * 수업을 즐겨찾기에 추가하거나 제거하는 React Query Mutation 훅입니다.
 * 낙관적 업데이트를 사용하여 즉시 UI에 반영되며, 실패 시 롤백됩니다.
 * @param {string} id - 즐겨찾기를 변경할 수업의 ID (UUID)
 * @returns {UseMutationResult} 즐겨찾기 토글 mutation 객체
 */
export const useStarClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleStar(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [
          "getClass",
        ],
      });
      const prevData = queryClient.getQueryData<LessonGetListResponse>([
        "getClass",
      ]);

      // 낙관적 업데이트
      queryClient.setQueryData(
        [
          "getClass",
        ],
        (oldData?: LessonGetListResponse) => {
          if (!oldData) return oldData;
          return {
            lessons: oldData.lessons.map(item =>
              item.id === id
                ? {
                    ...item,
                    isStarred: !item.isStarred,
                  }
                : item,
            ),
          };
        },
      );

      return {
        prevData,
      };
    },
    onSuccess: () => {
      Toast(`즐겨찾기 상태가 변경되었습니다.`, {
        type: "success",
      });
    },
    onError: (_err, _id, context) => {
      // 실패 시 롤백
      if (context?.prevData) {
        queryClient.setQueryData(
          [
            "getClass",
          ],
          context.prevData,
        );
      }
      Toast("즐겨찾기 변경에 실패했습니다.", {
        type: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "getClass",
        ],
      });
    },
  });
};

/**
 * 수업을 다음 차수로 진행하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 모니터링 페이지로 이동하거나 콜백을 실행합니다.
 * @param {string} id - 진행할 수업의 ID (UUID)
 * @param {Function} [onSuccessCallback] - 진행 성공 시 실행될 콜백 함수
 * @returns {UseMutationResult} 수업 진행 mutation 객체
 */
export const useNextDegree = (id?: string, onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => nextDegree(id!),
    onSuccess: () => {
      Toast(`수업이 진행되었습니다.`, {
        type: "success",
      });

      // React Query 캐시 무효화 - 수업 및 팀 관련 데이터 새로고침
      queryClient.invalidateQueries({
        queryKey: [
          "getClass",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getMonitoring",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getTeam",
        ],
      });

      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        const newPath = pathname.replace(/\/start$/, "/monitoring");
        navigate(newPath);
      }
    },
    onError: () => {
      Toast("수업 진행에 실패했습니다.", {
        type: "error",
      });
    },
  });
};

/**
 * 수업을 시작하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 모니터링 페이지로 이동하거나 콜백을 실행합니다.
 * @param {string} id - 시작할 수업의 ID (UUID)
 * @param {Function} [onSuccessCallback] - 시작 성공 시 실행될 콜백 함수
 * @returns {UseMutationResult} 수업 시작 mutation 객체
 */
export const useStartDegree = (id?: string, onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => startDegree(id!),
    onSuccess: () => {
      Toast(`수업이 시작되었습니다.`, {
        type: "success",
      });

      // React Query 캐시 무효화 - 수업 및 팀 관련 데이터 새로고침
      queryClient.invalidateQueries({
        queryKey: [
          "getClass",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getMonitoring",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getTeam",
        ],
      });

      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        const newPath = pathname.replace(/\/start$/, "/monitoring");
        navigate(newPath);
      }
    },
    onError: () => {
      Toast("수업 시작에 실패했습니다.", {
        type: "error",
      });
    },
  });
};

/**
 * 진행 중인 수업을 종료하는 React Query Mutation 훅입니다.
 * 성공 시 제공된 콜백 함수를 실행합니다.
 * @param {string} id - 종료할 수업의 ID (UUID)
 * @param {Function} [onSuccessCallback] - 수업 종료 성공 시 실행될 콜백 함수
 * @returns {UseMutationResult} 수업 종료 mutation 객체
 */
export const useEndClass = (id?: string, onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: () => endLesson(id!),
    onSuccess: () => {
      onSuccessCallback?.();
    },
  });
};
