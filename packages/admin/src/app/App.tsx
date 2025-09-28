import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { withProviders } from "@/app/providers/widthProviders";
import { ArticleProvider } from "@/shared/lib/contexts/ArticleContext";
import { StyledProvider } from "@/shared/StyledProvider";
import { Router } from "./router/router";

function App() {
  return (
    <StyledProvider>
      <ArticleProvider>
        <Suspense fallback={<div>로딩중...</div>}>
          <RouterProvider router={Router} />
        </Suspense>
      </ArticleProvider>
    </StyledProvider>
  );
}

export default withProviders(App);
