import { useMutation } from "@tanstack/react-query"
import { instance } from '@configs/util';
import Cookies from 'universal-cookie';

export const articleManagementDel = () => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");

  
  return useMutation({
    mutationFn: async (articleId: number) => {
      return await instance.delete(`/article/delete/${articleId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",  
        },
      });
    },
    onSuccess: () => console.log("성공"),
    onError: (error) => console.log("error", error),
  });
};
