import { RouterProvider } from "react-router-dom";
import { Router } from "./router";
import { queryClient } from "./utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StyledProvider } from "./style/StyledProvider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <StyledProvider>
        <RouterProvider router={Router} />
      </StyledProvider>
    </QueryClientProvider>
  );
}

export default App;
