import { useState } from 'react';

export const usePriceFormatter = (
  initialPrices: string[] = [],
  onChange: (index: number, value: string) => void,
) => {
  const [prices, setPrices] = useState(initialPrices);

  const priceChangeHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^0-9]/g, '');
      const formattedPrice = inputValue
        ? Number(inputValue).toLocaleString('ko-KR')
        : '';

      const newPrices = [...prices];
      newPrices[index] = formattedPrice; // 새로운 값 반영
      setPrices(newPrices); // 상태 업데이트

      onChange(index, inputValue); // 원본 값 업데이트
    };

  return { prices, priceChangeHandler };
};
