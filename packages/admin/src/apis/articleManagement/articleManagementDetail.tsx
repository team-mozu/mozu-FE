import { instance } from '@configs/util';
import Cookies from 'universal-cookie';


export const articleManagementDetail = (articleId: number) => {
  const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
    console.log(accessToken)
  
  return instance.get(`/article/${articleId}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },} )

};
