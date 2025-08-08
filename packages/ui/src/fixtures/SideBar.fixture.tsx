import { SideBar } from "../components/SideBar";
import { BrowserRouter } from "react-router-dom";

export default {
  "Default SideBar": (
    <BrowserRouter>
      <SideBar
        name="관리자"
        role="매니저"
        navTitle="메뉴"
      />
    </BrowserRouter>
  ),
  "SideBar with Long Name": (
    <BrowserRouter>
      <SideBar
        name="매우 긴 이름의 관리자"
        role="최고 관리자"
        navTitle="주요 메뉴"
      />
    </BrowserRouter>
  ),
};
