import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { withProviders } from "./providers/withProviders";
import { Router } from "./routes/router";

function App() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <RouterProvider router={Router} />
    </Suspense>
  );
}

export default withProviders(App);
