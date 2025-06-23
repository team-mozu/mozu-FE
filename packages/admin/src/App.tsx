import { RouterProvider } from "react-router-dom";
import { queryClient } from "./utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StyledProvider } from "./style/StyledProvider";
import { Suspense } from "react";
import { Router } from "./router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <StyledProvider>
        <Suspense fallback={<div>로딩중...</div>}>
          <RouterProvider router={Router} />
        </Suspense>
      </StyledProvider>
    </QueryClientProvider>
  );
}

export default App;
