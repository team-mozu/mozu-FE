import { RouterProvider } from 'react-router-dom';
import { Router } from './router';
import { useEffect, useState } from 'react';
import { initializeDB } from '@/db';

function App() {
  const [isDBReady, setIsDBReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDB();
        setIsDBReady(true);
      } catch (error) {
        console.error('DB 초기화 오류', error);
        setIsDBReady(false);
      }
    };

    init();
  }, []);

  if (!isDBReady) return <div>로딩중..</div>;

  return (
    <RouterProvider router={Router} />
  );
}

export default App;
