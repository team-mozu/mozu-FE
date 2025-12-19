import type { ComponentType } from "react";
import { ArticleProvider } from "@/shared/lib/contexts/ArticleContext";

export const withArticle = (Component: ComponentType) => {
  return function WithArticle() {
    return (
      <ArticleProvider>
        <Component />
      </ArticleProvider>
    );
  };
};
