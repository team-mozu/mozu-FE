/**
 * 주어진 숫자를 소숫점 n번째 자리까지 반올림합니다.
 * @param value 반올림할 숫자
 * @param precision 소숫점 자릿수 (기본값: 3)
 * @returns 반올림된 숫자
 */
export const roundToFixed = (value: number, precision: number = 3): number => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
};
