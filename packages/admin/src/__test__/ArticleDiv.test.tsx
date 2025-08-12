import { color } from "@mozu/design-token";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ArticleDiv } from '../components/article/ArticleDiv';

describe("ArticleDiv", () => {
  const defaultProps = {
    title: "Test Article",
    date: "2025-08-08",
    onClick: vi.fn(),
    selected: false,
    articleNumber: 1,
  };

  it("renders correctly with all content", () => {
    render(<ArticleDiv {...defaultProps} />);
    expect(screen.getByText("Test Article")).toBeInTheDocument();
    expect(screen.getByText("2025-08-08")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();
    render(
      <ArticleDiv
        {...defaultProps}
        onClick={mockOnClick}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies selected styles when selected", () => {
    render(
      <ArticleDiv
        {...defaultProps}
        selected={true}
      />,
    );
    const container = screen.getByRole("button");
    expect(container).toHaveStyle(`background-color: ${color.orange[50]}`);
  });

  it("matches snapshot", () => {
    const { container } = render(<ArticleDiv {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot when selected", () => {
    const { container } = render(
      <ArticleDiv
        {...defaultProps}
        selected={true}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
