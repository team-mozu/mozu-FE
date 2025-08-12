import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HoldStockTable } from "../components/monitoring/HoldStockTable";

describe("HoldStockTable", () => {
  it("renders correctly with no items", () => {
    render(<HoldStockTable holdItems={[]} />);
    expect(screen.getByText("보유중인 종목이 없습니다.")).toBeInTheDocument();
  });
});
