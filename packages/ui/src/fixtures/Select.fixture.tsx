import { Select } from "../components/Select";
import { useState } from "react";

export default {
  "Default Select": () => {
    const data = ["옵션 1", "옵션 2", "옵션 3"];
    const [selectedValue, setSelectedValue] = useState(data[0]);
    return (
      <Select
        data={data}
        value={selectedValue}
        onChange={setSelectedValue}
        width={200}
        height={40}
        padding={{ top: 10, right: 12, bottom: 10, left: 12 }}
      />
    );
  },
  "Select with Many Options": () => {
    const data = Array.from({ length: 20 }, (_, i) => `긴 옵션 ${i + 1}`);
    const [selectedValue, setSelectedValue] = useState(data[0]);
    return (
      <Select
        data={data}
        value={selectedValue}
        onChange={setSelectedValue}
        width={250}
        height={40}
        padding={{ top: 10, right: 12, bottom: 10, left: 12 }}
      />
    );
  },
};
