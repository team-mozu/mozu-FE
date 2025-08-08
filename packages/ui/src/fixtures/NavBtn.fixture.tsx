import { NavBtn } from "../components/NavBtn";

export default {
  "Default Nav Button": <NavBtn>메뉴 항목</NavBtn>,
  "Active Nav Button": <NavBtn isColor={true}>활성 메뉴 항목</NavBtn>,
  "Nav Button with Class Icon": <NavBtn type="classIcon">수업 관리</NavBtn>,
  "Nav Button with Stock Icon": <NavBtn type="stockIcon">종목 관리</NavBtn>,
  "Nav Button with Article Icon": <NavBtn type="articleIcon">기사 관리</NavBtn>,
};
