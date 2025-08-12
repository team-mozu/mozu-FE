import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { GlobalStyle } from "../theme/GlobalStyle";

describe("GlobalStyle", () => {
  it("renders without crashing", () => {
    render(<GlobalStyle />);
  });
});
