import { RouterProvider } from 'react-router-dom';
import { Router } from './router';
import { GlobalStyle } from '@mozu/design-token';

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
