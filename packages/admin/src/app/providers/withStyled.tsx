import { GlobalStyle } from "@mozu/design-token";
import { CustomToastContainer } from "@mozu/ui";
import type { ComponentType } from "react";

export const withStyled = (Component: ComponentType) => {
  return function WithStyled() {
    return (
      <>
        <GlobalStyle />
        <CustomToastContainer />
        <Component />
      </>
    );
  };
};
