import { useMutation } from "@tanstack/react-query"
import { instance } from '@configs/util';
import Cookies from 'universal-cookie';

interface IArticleManagementEditType {
  title?: string,
  description?: string,
  image?: File,
  articleId: number
}


export const articleManagementEdit = () => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");

  
  return useMutation({
    mutationFn: async (data: IArticleManagementEditType) => {
      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      if (data.image) {
        formData.append("image", data.image);
      }

      return await instance.post(`/article/update/${data.articleId}`, formData, {
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
