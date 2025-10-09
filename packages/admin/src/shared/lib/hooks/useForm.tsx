import { type ChangeEvent, useState } from "react";

export const useForm = <T extends object>(initState: T) => {
  const [state, setState] = useState<T>(initState);

  const onChangeInputValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    setState(prev => ({
      ...prev,
      [name]: type === "file" ? (files?.[0] ?? null) : value,
    }));
  };
  return {
    state,
    setState,
    onChangeInputValue,
  };
};
