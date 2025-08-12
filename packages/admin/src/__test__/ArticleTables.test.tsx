import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleTables } from "../components/common/ArticleTables";

describe("ArticleTables", () => {
  it("renders correctly", () => {
    render(
      <ArticleTables
        isEdit={false}
        degree="3"
      />,
    );
    expect(screen.getByText("기사 목록")).toBeInTheDocument();
  });
});
