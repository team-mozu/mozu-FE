import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignInPage } from "../pages/SignInPage";

describe("SignInPage", () => {
  it("renders correctly", () => {
    render(<SignInPage />);
    expect(screen.getByText("관리자 로그인")).toBeInTheDocument();
  });
});
