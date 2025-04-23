import App from "./App";
import CreateDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GlobalStyle } from "@mozu/design-token";
import { CustomToastContainer } from "@mozu/ui";

CreateDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
