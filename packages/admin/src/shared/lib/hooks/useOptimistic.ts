import { useQueryClient } from "@tanstack/react-query";

type returnType<T> = [
  (data: Partial<T>) => Promise<{
    [x: string]: unknown;
  }>,
  (prev: any) => void,
  () => void,
];

export const useOptimistic = <T>(queryKey: string[], name: string): returnType<T> => {
  const client = useQueryClient();

  const onMutate = async (data: Partial<T>) => {
    await client.cancelQueries({
      queryKey: queryKey,
    });
    const prev = client.getQueryData(queryKey);

    client.setQueryData(queryKey, (perv: T) => ({
      ...perv,
      ...data,
    }));

    return {
      [name]: prev,
    };
  };

  const onError = (prev: any) => {
    client.setQueryData(queryKey, prev);
  };

  const onSettled = () => {
    client.invalidateQueries({
      queryKey: queryKey,
    });
  };

  return [
    onMutate,
    onError,
    onSettled,
  ];
};
