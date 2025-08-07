import { Input } from "../components/Input";
import { useState } from "react";

export default {
  "Default Input": () => {
    const [value, setValue] = useState("");
    return (
      <Input
        placeholder="텍스트를 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  "Input with Label": () => {
    const [value, setValue] = useState("");
    return (
      <Input
        label="이름"
        placeholder="이름을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  "Password Input": () => {
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        passwordVisible={passwordVisible}
        setPasswordVisible={setPasswordVisible}
      />
    );
  },
  "Number Input": () => {
    const [num, setNum] = useState<number | string>("");
    return (
      <Input
        label="수량"
        type="number"
        placeholder="수량을 입력하세요"
        value={num}
        onChange={(e) => setNum(e.target.value)}
        max={100}
      />
    );
  },
  "Disabled Input": () => {
    const [value, setValue] = useState("비활성화된 입력창");
    return (
      <Input
        placeholder="비활성화된 입력창"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled
      />
    );
  },
};
