export const useUnchangedValue = (
  totalMoney: string,
  basicMoney: string,
): boolean => {
  return (
    parseInt(totalMoney.replace(/,/g, ''), 10) ===
    parseInt(basicMoney.replace(/,/g, ''), 10)
  );
};
