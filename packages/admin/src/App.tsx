import { RouterProvider } from 'react-router-dom';
import { Router } from './router';
import { Global } from '@emotion/react';
import { GlobalStyle } from './style/globalStyle.style';

function App() {
  return (
    <>
      <Global styles={GlobalStyle} />
      <RouterProvider router={Router} />
    </>
  );
}

export default App;