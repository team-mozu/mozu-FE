import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StockDiv } from "../components/stock/StockDiv";

describe("StockDiv", () => {
  it("renders correctly", () => {
    render(
      <StockDiv
        name="Test Stock"
        number={1}
        selected={false}
        onClick={() => { }}
      />,
    );
    expect(screen.getByText("Test Stock")).toBeInTheDocument();
  });
});
