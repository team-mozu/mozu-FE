import { type ChangeEvent, useState } from "react";

export const useForm = <T extends object>(initState: T) => {
  const [state, setState] = useState<T>(initState);

  const onChangeInputValue = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | {
          target: {
            name: string;
            value: string | number;
          };
        },
  ) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  return {
    state,
    setState,
    onChangeInputValue,
  };
};
