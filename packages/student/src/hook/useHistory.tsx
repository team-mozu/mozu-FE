import { useEffect, useState } from 'react';
import { fetchTradeHistory } from '@/db';
import { TeamEndData } from '@/apis/team/type';

export const useTradeHistory = () => {
  const [history, setHistory] = useState<TeamEndData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTradeHistory();
        const filteredData = data.map(
          ({
            itemId,
            itemMoney,
            itemName,
            orderCount,
            orderType,
            totalMoney,
          }) => ({
            itemId,
            itemMoney,
            itemName,
            orderCount,
            orderType,
            totalMoney,
          }),
        );

        setHistory(filteredData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { history, loading, error };
};
