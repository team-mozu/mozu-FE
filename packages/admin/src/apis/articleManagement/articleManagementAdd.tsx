import { useMutation } from "@tanstack/react-query"
import { instance } from '@configs/util';
import Cookies from 'universal-cookie';

interface IArticleManagementAddType {
  title?: string,
  description?: string,
  image?: File,
}


export const articleManagementAdd = () => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");


  return useMutation({
    mutationFn: async (addData: IArticleManagementAddType) => {
      const formData = new FormData();
      formData.append("title", addData.title || "");
      formData.append("description", addData.description || "");
      if (addData.image) {
        formData.append("image", addData.image);
      }

      return await instance.post("/article/create", formData, {
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
