import { instance } from '@configs/util';
import Cookies from 'universal-cookie';


interface IArticleDetail {
  title: string;
   description: string;
   image?: string;
}


export const articleManagementDetail =  async(articleId: number):Promise<IArticleDetail> => {
  const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
  
    return instance.get(`/article/${articleId}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    console.log(error)
  })

};
