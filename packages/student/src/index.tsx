import App from "./App";
import CreateDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CustomToastContainer } from "@mozu/ui";
import { GlobalStyle } from "@mozu/design-token";

const root = CreateDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

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
    <App />
    <CustomToastContainer />
    <GlobalStyle />
  </QueryClientProvider>
);
