import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleManagementPage } from "../pages/ArticleManagementPage";

import "@testing-library/jest-dom";

describe("ArticleManagementPage", () => {
  it("renders correctly", () => {
    render(<ArticleManagementPage />);
    expect(screen.getByText("기사 추가하기")).toBeInTheDocument();
  });
});
