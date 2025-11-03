import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Title from "./index";

describe("Title Component", () => {
  it("renders title with text correctly", () => {
    render(<Title>Test Title</Title>);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("applies default large size class", () => {
    render(<Title>Large Title</Title>);

    const titleElement = screen.getByText("Large Title");
    expect(titleElement).toHaveClass("title");
    expect(titleElement).toHaveClass("large");
  });

  it("applies medium size class when specified", () => {
    render(<Title size="medium">Medium Title</Title>);

    const titleElement = screen.getByText("Medium Title");
    expect(titleElement).toHaveClass("title");
    expect(titleElement).toHaveClass("medium");
  });

  it("applies background color when provided", () => {
    render(<Title bgColor="#FF0000">Colored Title</Title>);

    const titleElement = screen.getByText("Colored Title");
    expect(titleElement).toHaveStyle({ backgroundColor: "#FF0000" });
  });

  it("applies CSS variable background color", () => {
    render(<Title bgColor="var(--color-blue)">Blue Title</Title>);

    const titleElement = screen.getByText("Blue Title");
    expect(titleElement).toHaveStyle({ backgroundColor: "var(--color-blue)" });
  });

  it("applies custom className correctly", () => {
    render(<Title className="custom-title">Custom Title</Title>);

    const titleElement = screen.getByText("Custom Title");
    expect(titleElement).toHaveClass("title");
    expect(titleElement).toHaveClass("large"); // default size
    expect(titleElement).toHaveClass("custom-title");
  });

  it("merges custom styles with background color", () => {
    render(
      <Title
        bgColor="#00FF00"
        style={{ color: "rgb(255, 255, 255)", padding: "10px" }}
      >
        Styled Title
      </Title>
    );

    const titleElement = screen.getByText("Styled Title");
    expect(titleElement).toHaveStyle({
      backgroundColor: "#00FF00",
      color: "rgb(255, 255, 255)",
      padding: "10px",
    });
  });

  it("passes through HTML props correctly", () => {
    render(
      <Title data-testid="test-title" role="heading" aria-level={2}>
        Accessible Title
      </Title>
    );

    const titleElement = screen.getByTestId("test-title");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveAttribute("role", "heading");
    expect(titleElement).toHaveAttribute("aria-level", "2");
  });

  it("renders with medium size and background color", () => {
    render(
      <Title size="medium" bgColor="var(--color-pink)">
        Medium Pink Title
      </Title>
    );

    const titleElement = screen.getByText("Medium Pink Title");
    expect(titleElement).toHaveClass("title");
    expect(titleElement).toHaveClass("medium");
    expect(titleElement).toHaveStyle({ backgroundColor: "var(--color-pink)" });
  });

  it("renders with all props combined", () => {
    render(
      <Title
        size="medium"
        bgColor="#FFFF00"
        className="special-title"
        data-testid="combined-title"
      >
        Combined Props Title
      </Title>
    );

    const titleElement = screen.getByTestId("combined-title");
    expect(titleElement).toHaveClass("title");
    expect(titleElement).toHaveClass("medium");
    expect(titleElement).toHaveClass("special-title");
    expect(titleElement).toHaveStyle("backgroundColor: #FFFF00");
    expect(titleElement).toHaveTextContent("Combined Props Title");
  });

  it("handles empty children correctly", () => {
    const { container } = render(<Title />);

    const titleElement = container.querySelector(".title");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("title");
    expect(titleElement).toHaveClass("large");
  });

  it("handles multiple children correctly", () => {
    render(
      <Title>
        <span>Part 1</span>
        <span>Part 2</span>
      </Title>
    );

    expect(screen.getByText("Part 1")).toBeInTheDocument();
    expect(screen.getByText("Part 2")).toBeInTheDocument();
  });

  it("preserves existing style properties when setting background color", () => {
    const customStyle = {
      fontSize: "24px",
      fontWeight: "bold",
      margin: "20px",
    };

    render(
      <Title bgColor="#FF00FF" style={customStyle}>
        Styled Background Title
      </Title>
    );

    const titleElement = screen.getByText("Styled Background Title");
    expect(titleElement).toHaveStyle({
      backgroundColor: "#FF00FF",
      fontSize: "24px",
      fontWeight: "bold",
      margin: "20px",
    });
  });

  it("handles onClick events correctly", () => {
    const handleClick = vi.fn();

    render(<Title onClick={handleClick}>Clickable Title</Title>);

    const titleElement = screen.getByText("Clickable Title");
    titleElement.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
