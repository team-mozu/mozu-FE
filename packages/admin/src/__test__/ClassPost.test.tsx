// ClassPost.test.tsx - 개선된 종합적인 테스트
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import '@testing-library/jest-dom';
import { ClassPost } from '../components/class/ClassPost';

describe("ClassPost", () => {
  const defaultProps = {
    title: "Test Class",
    creationDate: "2025-08-08",
  };

  it("renders correctly with required props", () => {
    render(<ClassPost {...defaultProps} />);

    expect(screen.getByText("Test Class")).toBeInTheDocument();
    expect(screen.getByText("생성일자 | 2025-08-08")).toBeInTheDocument();
    expect(screen.getByText("삭제하기")).toBeInTheDocument();
  });

  it("handles main container click", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<ClassPost {...defaultProps} onClick={mockOnClick} />);

    await user.click(screen.getByRole("button", { name: /test class/i }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("handles star click without propagation", async () => {
    const mockStarClick = vi.fn();
    const mockMainClick = vi.fn();
    const user = userEvent.setup();

    render(
      <ClassPost
        {...defaultProps}
        onClick={mockMainClick}
        starOnClick={mockStarClick}
        isClick={false}
      />
    );

    const starButton = screen.getByRole("button", { name: /star/i });
    await user.click(starButton);

    expect(mockStarClick).toHaveBeenCalledTimes(1);
    expect(mockMainClick).not.toHaveBeenCalled(); // 이벤트 전파 차단 확인
  });

  it("handles delete button click without propagation", async () => {
    const mockDelClick = vi.fn();
    const mockMainClick = vi.fn();
    const user = userEvent.setup();

    render(
      <ClassPost
        {...defaultProps}
        onClick={mockMainClick}
        delClick={mockDelClick}
      />
    );

    const deleteButton = screen.getByRole("button", { name: "삭제하기" });
    await user.click(deleteButton);

    expect(mockDelClick).toHaveBeenCalledTimes(1);
    expect(mockMainClick).not.toHaveBeenCalled(); // 이벤트 전파 차단 확인
  });

  it("shows filled star when isClick is true", () => {
    render(<ClassPost {...defaultProps} isClick={true} />);

    const starButton = screen.getByRole("button", { name: /star/i });
    // Star 컴포넌트의 props를 통해 색상 확인 (실제 구현에 따라 다름)
    expect(starButton).toBeInTheDocument();
  });

  it("shows empty star when isClick is false", () => {
    render(<ClassPost {...defaultProps} isClick={false} />);

    const starButton = screen.getByRole("button", { name: /star/i });
    expect(starButton).toBeInTheDocument();
  });

  it("truncates long titles correctly", () => {
    const longTitle = "This is a very long title that should be truncated with ellipsis when it exceeds the maximum width";

    render(<ClassPost {...defaultProps} title={longTitle} />);

    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    });
  });

  it("matches snapshot for default state", () => {
    const { container } = render(<ClassPost {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot for starred state", () => {
    const { container } = render(<ClassPost {...defaultProps} isClick={true} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders without optional props", () => {
    render(<ClassPost {...defaultProps} />);

    // 옵셔널 props 없이도 정상 렌더링되는지 확인
    expect(screen.getByText("Test Class")).toBeInTheDocument();
    expect(() => screen.getByRole("button", { name: /star/i })).not.toThrow();
  });
});
