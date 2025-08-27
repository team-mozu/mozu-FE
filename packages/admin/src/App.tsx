import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router";
import { StyledProvider } from "./style/StyledProvider";
import { ArticleProvider } from "./utils";
import { queryClient } from "./utils/queryClient";

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
