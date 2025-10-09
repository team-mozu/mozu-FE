import { useState } from "react";
import { Input } from "../components/Input";

export default {
  "Default Input": () => {
    const [value, setValue] = useState("");
    return (
      <Input
        placeholder="텍스트를 입력하세요"
        value={value}
        onChange={e => setValue(e.target.value)}
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
        onChange={e => setValue(e.target.value)}
      />
    );
  },

  "Required Input": () => {
    const [value, setValue] = useState("");
    return (
      <Input
        label="필수 입력 필드"
        placeholder="필수 입력 사항입니다"
        value={value}
        onChange={e => setValue(e.target.value)}
        required
      />
    );
  },

  "Password Input": () => {
    const [password, setPassword] = useState("");
    return (
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    );
  },

  "Number Input": () => {
    const [num, setNum] = useState("");
    return (
      <Input
        label="수량"
        type="number"
        placeholder="수량을 입력하세요"
        value={num}
        onChange={e => setNum(e.target.value)}
      />
    );
  },

  "Money Input": () => {
    const [money, setMoney] = useState("");
    return (
      <Input
        label="금액"
        type="money"
        placeholder="금액을 입력하세요"
        value={money}
        onChange={e => setMoney(e.target.value)}
        rightText="원"
      />
    );
  },

  "Input with Helper Text": () => {
    const [value, setValue] = useState("");
    return (
      <Input
        label="사용자명"
        placeholder="사용자명을 입력하세요"
        value={value}
        onChange={e => setValue(e.target.value)}
        helperText="영문, 숫자 조합으로 4-20자 입력해주세요"
      />
    );
  },

  "Input with Error": () => {
    const [value, setValue] = useState("");
    return (
      <Input
        label="이메일"
        placeholder="이메일을 입력하세요"
        value={value}
        onChange={e => setValue(e.target.value)}
        state="error"
        errorMessage="올바른 이메일 형식이 아닙니다"
      />
    );
  },

  "Disabled Input": () => {
    return (
      <Input
        label="비활성화된 필드"
        placeholder="비활성화된 입력창"
        value="수정할 수 없는 값"
        disabled
      />
    );
  },

  "ReadOnly Input": () => {
    return (
      <Input
        label="읽기 전용 필드"
        value="읽기 전용 값"
        readOnly
      />
    );
  },

  "Full Width Input": () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "400px", padding: "20px", border: "1px solid #ccc" }}>
        <Input
          label="전체 너비 입력"
          placeholder="전체 너비로 표시됩니다"
          value={value}
          onChange={e => setValue(e.target.value)}
          fullWidth
        />
      </div>
    );
  },

  "Input with Max Length": () => {
    const [value, setValue] = useState("");
    return (
      <Input
        label="제한된 입력"
        placeholder="최대 10자까지 입력 가능"
        value={value}
        onChange={e => setValue(e.target.value)}
        maxLength={10}
        helperText={`${value.length}/10자`}
      />
    );
  },
};
