import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StockManagementPage } from "../pages/StockManagementPage";

describe("StockManagementPage", () => {
  it("renders correctly", () => {
    render(<StockManagementPage />);
    expect(screen.getByText("종목 추가하기")).toBeInTheDocument();
  });
});
