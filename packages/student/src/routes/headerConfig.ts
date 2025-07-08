export const headerConfigMap: Record<string, HeaderConfig> = {
  '/:classId': { showNav: true, showRound: true },
  '/:classId/news': { showNav: true, showRound: true },
  '/:classId/result': { showNav: false, showRound: false },
  '/:classId/ending': { showNav: false, showRound: false },
  '/signin/wait': { showNav: false, showRound: false },
  '/class-management/start': {
    showNav: false,
    showRound: false,
    isAdminMargin: false,
  },
  '/class-management/monitoring': {
    showNav: false,
    showRound: false,
    isAdminMargin: false,
  },
};

export interface HeaderConfig {
  showNav: boolean;
  showRound: boolean;
  isAdminMargin?: boolean;
}
