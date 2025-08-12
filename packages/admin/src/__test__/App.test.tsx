import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import App from "../App";

describe("Admin App", () => {
  it("컴포넌트 렌더링 테스트", () => {
    render(<App />);
  });
});
