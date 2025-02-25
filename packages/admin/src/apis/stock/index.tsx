import { useMutation, useQueryClient } from "@tanstack/react-query"
import { instance, getCookies } from '@configs/util';
import {StockManagementEditRequest, StockAddRequest,StockDetailResponse} from './type'
import { useNavigate } from "react-router";



export const stockManagementAdd = () => {
  const accessToken = getCookies<string>("accessToken");
  const navigate = useNavigate();


  return useMutation({
    mutationFn: async (addData: StockAddRequest) => {
      return await instance.post("/item/create", addData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",  
        },
      });
    },
    onSuccess: (response) => {
      console.log("성공")
      const id = response.data.id;
      navigate(`/stock-management/${id}`)
    },
    onError: (error) => console.log("error", error),
  });
};



export const stockManagementDel = () => {
  const accessToken = getCookies<string>("accessToken");

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stockId: number) => {
      return await instance.delete(`/item/delete/${stockId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: () => {
      console.log("성공"),
      queryClient.invalidateQueries(["stocks"]);
    },
    onError: (error) => console.log("error", error),
  });
};


export const stockManagementDetail =  async(stockId: number):Promise<StockDetailResponse> => {
  const accessToken = getCookies<string>("accessToken");
  
    return instance.get(`/item/${stockId}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    console.log(error)
  })

};


export const stockManagementList =  async() => {
  const accessToken = getCookies<string>("accessToken");
  
    return instance.get('/item',{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    console.log(error)
  })

};



export const stockManagementEdit = () => {
    const accessToken = getCookies<string>("accessToken");
    const navigate = useNavigate();
    
    return useMutation({
      mutationFn: async (datas: StockManagementEditRequest) => {
        const {stockId: _, ...data} = datas;
        
      return await instance.post(`/item/update/${datas.stockId}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",  
        },
      });
    },
    onSuccess: () => {
      console.log("성공")
      navigate(-1);
      setTimeout(() => {
        window.location.reload(); 
      }, 100);
    },
    onError: (error) => console.log("error", error),
  });
};
