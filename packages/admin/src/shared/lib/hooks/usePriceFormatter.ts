import { useState } from "react";

export const usePriceFormatter = (
  initialPrices: number[],
  onChange: (index: number, value: number) => void
) => {
  const [prices, setPrices] = useState<string[]>(
    initialPrices.map(price => 
      isNaN(price) ? "" : price.toLocaleString()
    )
  );

  const priceChangeHandler = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    
    // 빈 문자열 처리
    if (rawValue === '') {
      const newPrices = [...prices];
      newPrices[index] = '';
      setPrices(newPrices);
      onChange(index, NaN);
      return;
    }
    
    // 숫자만 허용
    if (!/^\d*$/.test(rawValue)) return;
    
    const numericValue = Number(rawValue);
    
    // 0 처리
    if (numericValue === 0) {
      const newPrices = [...prices];
      newPrices[index] = '0';
      setPrices(newPrices);
      onChange(index, 0);
      return;
    }
    
    // 일반 숫자 처리
    if (!isNaN(numericValue)) {
      const newPrices = [...prices];
      newPrices[index] = numericValue.toLocaleString();
      setPrices(newPrices);
      onChange(index, numericValue);
    }
  };

  return { prices, priceChangeHandler };
};