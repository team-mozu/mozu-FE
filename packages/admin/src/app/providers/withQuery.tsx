import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ComponentType } from "react";
import { queryClient } from "@/shared/lib/queryClient";

export const withQuery = (Component: ComponentType) => {
  return function WithQuery() {
    return (
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Component />
      </QueryClientProvider>
    );
  };
};
