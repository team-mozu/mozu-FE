import { useMutation, useQueryClient } from "@tanstack/react-query"
import { instance, getCookies } from '@configs/util';
import {ArticleManagementEditRequest} from './type'
import {ArticleAddRequest} from './type'
import {ArticleDetailResponse} from './type'

export const articleManagementAdd = () => {
  const accessToken = getCookies<string>("accessToken");


  return useMutation({
    mutationFn: async (addData: ArticleAddRequest) => {
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



export const articleManagementDel = () => {
  const accessToken = getCookies<string>("accessToken");

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


export const articleManagementDetail =  async(articleId: number):Promise<ArticleDetailResponse> => {
  const accessToken = getCookies<string>("accessToken");
  
    return instance.get(`/article/${articleId}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    console.log(error)
  })

};




export const articleManagementEdit = () => {
    const accessToken = getCookies<string>("accessToken");

  
  return useMutation({
    mutationFn: async (data: ArticleManagementEditRequest) => {
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
