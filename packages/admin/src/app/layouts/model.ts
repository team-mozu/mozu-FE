export const shouldApplyMargin = (pathname: string) => {
  const segments = pathname.split("/");

  const isClassSpecialPage =
    segments[1] === "class-management" && (segments[3] === "start" || segments[3] === "monitoring");

  return !isClassSpecialPage;
};

export const shouldUsePageTransition = (pathname: string) => {
  const isStockDetail = /^\/stock-management\/\d+$/.test(pathname);
  const isArticleDetail = /^\/article-management\/[0-9a-fA-F-]{36}$/.test(pathname);

  return !(isStockDetail || isArticleDetail);
};
