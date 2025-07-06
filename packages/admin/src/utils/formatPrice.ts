export const formatPrice = (price: number | null | undefined): string => {
  // null, undefined, NaN 체크
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }

  // 숫자가 아닌 경우 처리
  if (typeof price !== 'number') {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return '0';
    }
    price = numericPrice;
  }

  // 음수 처리
  if (price < 0) {
    return '-' + Math.abs(price).toLocaleString();
  }

  return price.toLocaleString();
};
