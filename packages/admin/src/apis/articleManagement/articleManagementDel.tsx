import { useMutation, useQueryClient } from "@tanstack/react-query"
import { instance } from '@configs/util';
import Cookies from 'universal-cookie';

export const articleManagementDel = () => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: number) => {
      return await instance.delete(`/article/delete/${articleId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: () => {
      console.log("성공"),
      queryClient.invalidateQueries(["articles"]);
    },
    onError: (error) => console.log("error", error),
  });
};
