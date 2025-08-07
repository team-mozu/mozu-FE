import { Item } from "../components/Item";
import { useState } from "react";

export default {
  "Default Item": () => {
    const [checked, setChecked] = useState(false);
    return (
      <Item
        title1="항목 1"
        title2="설명 1"
        checked={checked}
        onChange={() => setChecked(!checked)}
        id="item-1"
      />
    );
  },
  "Header Item": (
    <Item isHeader={true} title1="제목 1" title2="제목 2" />
  ),
  "Checked Item": () => {
    const [checked, setChecked] = useState(true);
    return (
      <Item
        title1="체크된 항목"
        title2="체크된 설명"
        checked={checked}
        onChange={() => setChecked(!checked)}
        id="item-checked"
      />
    );
  },
};
