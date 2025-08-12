import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClassManagement } from "../pages/ClassManagement";

describe("ClassManagement", () => {
  it("renders correctly", () => {
    render(<ClassManagement />);
    expect(screen.getByText("수업 관리")).toBeInTheDocument();
  });
});
