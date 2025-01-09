import { createBrowserRouter } from 'react-router-dom';
import { Test } from './test';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Test />,
    errorElement: <div>404</div>
  }
]);
