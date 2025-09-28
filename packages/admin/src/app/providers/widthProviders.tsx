import type { ComponentType } from "react";
import { withQuery } from "./withQuery";

const providers = [
  withQuery,
];

export const withProviders = (Component: ComponentType) => {
  return providers.reduceRight((AccumulatedComponent, provider) => provider(AccumulatedComponent), Component);
};
