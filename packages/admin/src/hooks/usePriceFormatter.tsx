import { useState } from 'react';

export const usePriceFormatter = (initialPrices: string[] = []) => {
  const [prices, setPrices] = useState<string[]>(initialPrices);

  const priceChangeHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numericValue = Number(inputValue.replace(/,/g, ''));
      const newPrices = [...prices];

      if (isNaN(numericValue) || inputValue === '') {
        newPrices[index] = '';
      } else {
        newPrices[index] = numericValue.toLocaleString('ko-KR');
      }

      setPrices(newPrices);
    };

  return { prices, setPrices, priceChangeHandler };
};
