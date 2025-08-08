import { TextArea } from "../components/TextArea";
import { useState } from "react";

export default {
  "Default Text Area": () => {
    const [value, setValue] = useState("");
    return (
      <TextArea
        placeholder="내용을 입력하세요"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    );
  },
  "Text Area with Label": () => {
    const [value, setValue] = useState("");
    return (
      <TextArea
        label="설명"
        placeholder="자세한 설명을 입력하세요"
        height={150}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    );
  },
  "Text Area with Initial Value": () => {
    const [value, setValue] = useState("미리 채워진 내용입니다.");
    return (
      <TextArea
        placeholder="내용을 입력하세요"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    );
  },
};
