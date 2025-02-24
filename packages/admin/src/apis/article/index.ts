import { useMutation, useQueryClient } from "@tanstack/react-query"
import { instance, getCookies } from '@configs/util';
import {ArticleManagementEditRequest, ArticleAddRequest,ArticleDetailResponse} from './type'
import { useNavigate } from "react-router";


export const articleManagementAdd = () => {
  const accessToken = getCookies<string>("accessToken");
  const navigate = useNavigate();


  return useMutation({
    mutationFn: async (addData: ArticleAddRequest) => {
      return await instance.post("/article/create", addData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",  
        },
      });
    },
    onSuccess: (response) => {
      console.log("성공");
      const id = response.data.id
      navigate(`/article-management/${id}`);
    },
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


export const articleManagementList =  async() => {
  const accessToken = getCookies<string>("accessToken");
  
    return instance.get('/article',{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    console.log(error)
  })

};




export const articleManagementEdit = () => {
    const accessToken = getCookies<string>("accessToken");
    const navigate = useNavigate();

  
  return useMutation({
    mutationFn: async (data: ArticleManagementEditRequest) => {
      const {articleId: _, ...datas} = data;

      return await instance.post(`/article/update/${data.articleId}`, datas, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",  
        },
      });
    },
    onSuccess: () => {
      console.log("성공");
      navigate(-1);
      setTimeout(() => {
        window.location.reload(); 
      }, 100);
    },
    onError: (error) => console.log("error", error),
  });
};
