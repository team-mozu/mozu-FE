import { useState } from "react";
import { CheckBox } from "../components/CheckBox";

export default {
  "Unchecked CheckBox": () => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckBox
        checked={checked}
        onChange={() => setChecked(!checked)}
        id="checkbox-unchecked"
      />
    );
  },
  "Checked CheckBox": () => {
    const [checked, setChecked] = useState(true);
    return (
      <CheckBox
        checked={checked}
        onChange={() => setChecked(!checked)}
        id="checkbox-checked"
      />
    );
  },
};
