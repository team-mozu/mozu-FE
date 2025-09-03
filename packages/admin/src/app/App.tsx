import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ArticleProvider } from "@/shared/lib/contexts/ArticleContext";
import { queryClient } from "@/shared/lib/queryClient";
import { StyledProvider } from "@/shared/StyledProvider";
import { Router } from "./router/router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <StyledProvider>
        <ArticleProvider>
          <Suspense fallback={<div>로딩중...</div>}>
            <RouterProvider router={Router} />
          </Suspense>
        </ArticleProvider>
      </StyledProvider>
    </QueryClientProvider>
  );
}

export default App;
