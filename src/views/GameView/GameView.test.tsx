import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GameView from "./index";

// Mock all child components
vi.mock("@/components/Game", () => ({
  default: () => <div data-testid="game-component">Game Component</div>,
}));

vi.mock("@/components/Header", () => ({
  default: () => <div data-testid="header-component">Header Component</div>,
}));

vi.mock("@/components/HorseList", () => ({
  default: () => (
    <div data-testid="horse-list-component">Horse List Component</div>
  ),
}));

vi.mock("@/components/ResultList", () => ({
  default: () => (
    <div data-testid="result-list-component">Result List Component</div>
  ),
}));

vi.mock("@/components/ScheduleList", () => ({
  default: () => (
    <div data-testid="schedule-list-component">Schedule List Component</div>
  ),
}));

describe("GameView", () => {
  it("should render the main game view container", () => {
    render(<GameView />);

    const gameView = document.querySelector(".gameView");
    expect(gameView).toBeInTheDocument();
  });

  it("should render the Header component", () => {
    render(<GameView />);

    expect(screen.getByTestId("header-component")).toBeInTheDocument();
    expect(screen.getByText("Header Component")).toBeInTheDocument();
  });

  it("should render the main content area", () => {
    render(<GameView />);

    const main = document.querySelector(".main");
    expect(main).toBeInTheDocument();
  });

  it("should render the HorseList component in main area", () => {
    render(<GameView />);

    expect(screen.getByTestId("horse-list-component")).toBeInTheDocument();
    expect(screen.getByText("Horse List Component")).toBeInTheDocument();
  });

  it("should render the Game component in main area", () => {
    render(<GameView />);

    expect(screen.getByTestId("game-component")).toBeInTheDocument();
    expect(screen.getByText("Game Component")).toBeInTheDocument();
  });

  it("should render the ScheduleList component in main area", () => {
    render(<GameView />);

    expect(screen.getByTestId("schedule-list-component")).toBeInTheDocument();
    expect(screen.getByText("Schedule List Component")).toBeInTheDocument();
  });

  it("should render the ResultList component in main area", () => {
    render(<GameView />);

    expect(screen.getByTestId("result-list-component")).toBeInTheDocument();
    expect(screen.getByText("Result List Component")).toBeInTheDocument();
  });

  it("should render all components in correct order", () => {
    render(<GameView />);

    const gameView = document.querySelector(".gameView");
    const children = gameView?.children;

    expect(children).toHaveLength(2);

    // First child should be Header
    expect(children?.[0]).toContainElement(
      screen.getByTestId("header-component")
    );

    // Second child should be main with 4 components
    const main = children?.[1];
    expect(main?.children).toHaveLength(4);
    expect(main?.children[0]).toContainElement(
      screen.getByTestId("horse-list-component")
    );
    expect(main?.children[1]).toContainElement(
      screen.getByTestId("game-component")
    );
    expect(main?.children[2]).toContainElement(
      screen.getByTestId("schedule-list-component")
    );
    expect(main?.children[3]).toContainElement(
      screen.getByTestId("result-list-component")
    );
  });

  it("should apply correct CSS classes", () => {
    render(<GameView />);

    const gameView = document.querySelector(".gameView");
    const main = document.querySelector(".main");

    expect(gameView).toHaveClass("gameView");
    expect(main).toHaveClass("main");
  });

  it("should have semantic HTML structure", () => {
    render(<GameView />);

    // Should have a main element
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass("main");
  });

  it("should render without errors", () => {
    expect(() => render(<GameView />)).not.toThrow();
  });

  it("should be accessible", () => {
    render(<GameView />);

    // Should have proper semantic structure
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    // All child components should be present
    expect(screen.getByTestId("header-component")).toBeInTheDocument();
    expect(screen.getByTestId("horse-list-component")).toBeInTheDocument();
    expect(screen.getByTestId("game-component")).toBeInTheDocument();
    expect(screen.getByTestId("schedule-list-component")).toBeInTheDocument();
    expect(screen.getByTestId("result-list-component")).toBeInTheDocument();
  });

  describe("layout structure", () => {
    it("should have header outside of main content", () => {
      render(<GameView />);

      const gameView = document.querySelector(".gameView");
      const header = screen.getByTestId("header-component");
      const main = screen.getByRole("main");

      expect(gameView).toContainElement(header);
      expect(gameView).toContainElement(main);
      expect(main).not.toContainElement(header);
    });

    it("should have all game components inside main", () => {
      render(<GameView />);

      const main = screen.getByRole("main");

      expect(main).toContainElement(screen.getByTestId("horse-list-component"));
      expect(main).toContainElement(screen.getByTestId("game-component"));
      expect(main).toContainElement(
        screen.getByTestId("schedule-list-component")
      );
      expect(main).toContainElement(
        screen.getByTestId("result-list-component")
      );
    });

    it("should render components in logical order", () => {
      render(<GameView />);

      const main = screen.getByRole("main");
      const components = Array.from(main.children);

      // Check the order of components
      expect(components[0]).toContainElement(
        screen.getByTestId("horse-list-component")
      );
      expect(components[1]).toContainElement(
        screen.getByTestId("game-component")
      );
      expect(components[2]).toContainElement(
        screen.getByTestId("schedule-list-component")
      );
      expect(components[3]).toContainElement(
        screen.getByTestId("result-list-component")
      );
    });
  });

  describe("component integration", () => {
    it("should import and render all required components", () => {
      render(<GameView />);

      // Verify all expected components are present
      const expectedComponents = [
        "header-component",
        "horse-list-component",
        "game-component",
        "schedule-list-component",
        "result-list-component",
      ];

      expectedComponents.forEach((testId) => {
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });
    });

    it("should not render any unexpected elements", () => {
      render(<GameView />);

      const gameView = document.querySelector(".gameView");
      expect(gameView?.children).toHaveLength(2); // Only header and main

      const main = screen.getByRole("main");
      expect(main.children).toHaveLength(4); // Only the 4 expected components
    });
  });
});
