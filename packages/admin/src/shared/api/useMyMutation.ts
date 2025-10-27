import { instance } from "@mozu/util-config";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

/**
 * API 요청을 위한 React Query mutation 훅
 *
 * @param method HTTP 메서드 ("get" | "post" | "patch" | "delete")
 * @param resource API 리소스 경로
 * @param endpoint API 엔드포인트
 * @param contentType 요청 Content-Type ("multipart/form-data" | "application/json")
 * @param options React Query UseMutationOptions
 * @returns useMutation 훅 결과
 */
export const useMyMutation = <TData, TVariables>(
  method: "get" | "post" | "patch" | "delete",
  resource: string,
  endpoint: string,
  contentType?: "multipart/form-data" | "application/json",
  options?: UseMutationOptions<TData, Error, TVariables, unknown>,
) => {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const config =
        contentType === "multipart/form-data"
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : undefined;

      const response = await instance[method]<TData>(`${resource}${endpoint}`, variables, config);
      return response.data;
    },
    ...options,
  });
};
