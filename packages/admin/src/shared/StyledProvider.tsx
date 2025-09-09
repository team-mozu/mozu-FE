import { GlobalStyle } from "@mozu/design-token";
import { CustomToastContainer } from "@mozu/ui";
import React from "react";

export const StyledProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <CustomToastContainer />
      {children}
    </React.Fragment>
  );
};
