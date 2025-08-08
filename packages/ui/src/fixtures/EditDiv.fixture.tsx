import { EditDiv } from "../components/EditDiv";
import { BrowserRouter } from "react-router-dom";

export default {
  "Default EditDiv": (
    <BrowserRouter>
      <EditDiv
        title="제목"
        value1="취소"
        value2="저장"
        type1="cancelImg"
        type2="saveImg"
        isIcon1={true}
        isIcon2={true}
        onClick={() => console.log("Save clicked")}
      />
    </BrowserRouter>
  ),
};
