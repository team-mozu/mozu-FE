import { SearchInput } from "../components/SearchInput";
import { useState } from "react";

export default {
  "Default Search Input": () => {
    const [value, setValue] = useState("");
    return (
      <SearchInput
        inputText="검색어를 입력하세요"
        value={value}
        onChange={setValue}
      />
    );
  },
  "Search Input with Initial Value": () => {
    const [value, setValue] = useState("초기 검색어");
    return (
      <SearchInput
        inputText="검색어를 입력하세요"
        value={value}
        onChange={setValue}
      />
    );
  },
};
