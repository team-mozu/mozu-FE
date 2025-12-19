import type { ComponentType } from "react";
import { withArticle } from "./withArticle";
import { withQuery } from "./withQuery";
import { withStyled } from "./withStyled";

const providers = [
  withStyled,
  withArticle,
  withQuery,
];

export const withProviders = (Component: ComponentType) => {
  return providers.reduceRight((AccumulatedComponent, provider) => provider(AccumulatedComponent), Component);
};
