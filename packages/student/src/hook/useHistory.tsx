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
        // 필요한 필드만 필터링
        const filteredData = data.map(
          ({
            itemId,
            itemName,
            itemMoney,
            orderCount,
            totalMoney,
            orderType,
          }) => ({
            itemId,
            itemName,
            itemMoney,
            orderCount,
            totalMoney,
            orderType,
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
