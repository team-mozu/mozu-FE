import { useEffect, useState } from "react";

export const usePriceFormatter = (initialPrices: number[] = [], onChange: (index: number, value: number) => void) => {
  const formatPrice = (value: number) => value.toLocaleString("ko-KR");

  const [prices, setPrices] = useState(initialPrices.map(formatPrice));

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    setPrices(prev => {
      const newFormattedPrices = initialPrices.map(formatPrice);
      if (JSON.stringify(prev) === JSON.stringify(newFormattedPrices)) {
        return prev;
      }
      return newFormattedPrices;
    });
  }, [
    initialPrices,
  ]);

  const priceChangeHandler = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = inputValue ? Number(inputValue) : 0;
    const formattedPrice = formatPrice(numericValue);

    const newPrices = [
      ...prices,
    ];
    newPrices[index] = formattedPrice;
    setPrices(newPrices);

    onChange(index, numericValue);
  };

  return {
    prices,
    priceChangeHandler,
  };
};
