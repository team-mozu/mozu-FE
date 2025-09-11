import { GlobalStyle } from "@mozu/design-token";
import { CustomToastContainer } from "@mozu/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import CreateDOM from "react-dom/client";
import App from "./app/App";

const root = CreateDOM.createRoot(document.getElementById("root") as HTMLElement);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
      retry: 1,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <Suspense fallback={<div>로딩중...</div>}>
      <App />
    </Suspense>
    <CustomToastContainer />
    <GlobalStyle />
  </QueryClientProvider>,
);
