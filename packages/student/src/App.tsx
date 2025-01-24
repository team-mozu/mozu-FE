import { GlobalStyle } from '@mozu/design-token';
import { RouterProvider } from 'react-router-dom';
import { Router } from './router';

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
