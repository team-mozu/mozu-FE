import { RouterProvider } from "react-router-dom";
import { Router } from "./router/router";

function App() {
  return (
    <RouterProvider router={Router} />
  );
}

export default App;
