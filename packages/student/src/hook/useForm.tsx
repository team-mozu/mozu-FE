import { ChangeEvent, useState } from 'react';

export const useForm = <T extends object>(initState: T) => {
  const [state, setState] = useState<T>(initState);

  const onChangeInputValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  return {
    state,
    setState,
    onChangeInputValue,
  };
};
