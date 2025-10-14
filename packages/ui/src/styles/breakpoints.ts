/**
 * 데스크탑 전용 반응형 브레이크포인트 정의
 * Windows 데스크탑 환경을 고려한 브레이크포인트
 */

export const desktopBreakpoints = {
  // 소형 데스크탑 (일반 Windows 데스크탑 1366x768, 1920x1080)
  small: 1366,
  // 중형 데스크탑 (1440p 모니터)
  medium: 1440,
  // 대형 데스크탑 (맥북 Pro 16인치, 4K 모니터)
  large: 1680,
  // 초대형 데스크탑 (5K, 울트라와이드)
  xlarge: 2560,
} as const;

export const desktopMediaQueries = {
  small: `@media (max-width: ${desktopBreakpoints.small}px)`,
  medium: `@media (max-width: ${desktopBreakpoints.medium}px)`,
  large: `@media (max-width: ${desktopBreakpoints.large}px)`,
  xlarge: `@media (max-width: ${desktopBreakpoints.xlarge}px)`,

  // 최소 크기 쿼리
  minSmall: `@media (min-width: ${desktopBreakpoints.small + 1}px)`,
  minMedium: `@media (min-width: ${desktopBreakpoints.medium + 1}px)`,
  minLarge: `@media (min-width: ${desktopBreakpoints.large + 1}px)`,
  minXlarge: `@media (min-width: ${desktopBreakpoints.xlarge + 1}px)`,

  // 범위 쿼리
  onlySmall: `@media (max-width: ${desktopBreakpoints.small}px)`,
  onlyMedium: `@media (min-width: ${desktopBreakpoints.small + 1}px) and (max-width: ${desktopBreakpoints.medium}px)`,
  onlyLarge: `@media (min-width: ${desktopBreakpoints.medium + 1}px) and (max-width: ${desktopBreakpoints.large}px)`,
  onlyXlarge: `@media (min-width: ${desktopBreakpoints.large + 1}px)`,
} as const;

export type DesktopBreakpointKey = keyof typeof desktopBreakpoints;
export type DesktopMediaQueryKey = keyof typeof desktopMediaQueries;
