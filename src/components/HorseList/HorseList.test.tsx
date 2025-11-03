import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HorseList from "./index";
import type { IHorse, ICurrentRoundData } from "@/types";

// Mock the store
interface MockState {
  allHorses: IHorse[];
  currentRoundData: ICurrentRoundData | null;
}

const mockUseRaceStore = vi.fn();
vi.mock("@/stores/useRaceStore", () => ({
  useRaceStore: (selector: (state: MockState) => unknown) =>
    mockUseRaceStore(selector),
}));

// Mock the SVG icon
vi.mock("@/assets/horse.svg", () => ({
  ReactComponent: ({
    style,
    "aria-label": ariaLabel,
    className,
  }: {
    style?: React.CSSProperties;
    "aria-label"?: string;
    className?: string;
  }) => (
    <div
      data-testid="horse-icon"
      style={style}
      aria-label={ariaLabel}
      className={className}
    />
  ),
}));

describe("HorseList Component", () => {
  const mockHorses: IHorse[] = [
    {
      id: 0,
      name: "Thunder Horse",
      color: "#FF0000",
      condition: 85,
    },
    {
      id: 1,
      name: "Lightning Bolt",
      color: "#00FF00",
      condition: 92,
    },
    {
      id: 2,
      name: "Storm Runner",
      color: "#0000FF",
      condition: 78,
    },
  ];

  const mockCurrentRoundData: ICurrentRoundData = {
    round: 1,
    participants: [
      {
        traveledDistance: 0,
        id: 0,
        name: "Thunder Horse",
        color: "#FF0000",
        condition: 85,
        position: 1,
      },
      {
        traveledDistance: 0,
        id: 2,
        name: "Storm Runner",
        color: "#0000FF",
        condition: 78,
        position: 2,
      },
    ],
    distance: 1200,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders horse list title with correct count", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: null,
      };
      return selector(state);
    });

    render(<HorseList />);

    expect(screen.getByText("Horse List (1 - 3)")).toBeInTheDocument();
  });

  it("renders table headers correctly", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: null,
      };
      return selector(state);
    });

    render(<HorseList />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Speed")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
  });

  it("renders all horses in the list", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: null,
      };
      return selector(state);
    });

    render(<HorseList />);

    expect(screen.getByText("Thunder Horse")).toBeInTheDocument();
    expect(screen.getByText("Lightning Bolt")).toBeInTheDocument();
    expect(screen.getByText("Storm Runner")).toBeInTheDocument();
  });

  it("displays horse conditions correctly", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: null,
      };
      return selector(state);
    });

    render(<HorseList />);

    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("92")).toBeInTheDocument();
    expect(screen.getByText("78")).toBeInTheDocument();
  });

  it("renders horse icons with correct colors", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: null,
      };
      return selector(state);
    });

    render(<HorseList />);

    const horseIcons = screen.getAllByTestId("horse-icon");
    expect(horseIcons).toHaveLength(3);

    expect(horseIcons[0]).toHaveStyle({ fill: "#FF0000" });
    expect(horseIcons[1]).toHaveStyle({ fill: "#00FF00" });
    expect(horseIcons[2]).toHaveStyle({ fill: "#0000FF" });
  });

  it("renders horse icons with correct aria labels", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: null,
      };
      return selector(state);
    });

    render(<HorseList />);

    expect(screen.getByLabelText("Thunder Horse icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Lightning Bolt icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Storm Runner icon")).toBeInTheDocument();
  });

  it("highlights active horses when currentRoundData exists", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: mockCurrentRoundData,
      };
      return selector(state);
    });

    render(<HorseList />);

    // Check that participating horses are highlighted
    const thunderHorseRow = screen.getByText("Thunder Horse").closest("tr");
    const stormRunnerRow = screen.getByText("Storm Runner").closest("tr");
    const lightningBoltRow = screen.getByText("Lightning Bolt").closest("tr");

    expect(thunderHorseRow).toHaveClass("activeHorse");
    expect(stormRunnerRow).toHaveClass("activeHorse");
    expect(lightningBoltRow).not.toHaveClass("activeHorse");
  });

  it("does not highlight any horses when no current round data", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: null,
      };
      return selector(state);
    });

    render(<HorseList />);

    const thunderHorseRow = screen.getByText("Thunder Horse").closest("tr");
    const lightningBoltRow = screen.getByText("Lightning Bolt").closest("tr");
    const stormRunnerRow = screen.getByText("Storm Runner").closest("tr");

    expect(thunderHorseRow).not.toHaveClass("activeHorse");
    expect(lightningBoltRow).not.toHaveClass("activeHorse");
    expect(stormRunnerRow).not.toHaveClass("activeHorse");
  });

  it("renders empty list when no horses available", () => {
    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: [],
        currentRoundData: null,
      };
      return selector(state);
    });

    render(<HorseList />);

    expect(screen.getByText("Horse List (1 - 0)")).toBeInTheDocument();
    expect(screen.queryByText("Thunder Horse")).not.toBeInTheDocument();
  });

  it("correctly identifies participants in current round", () => {
    const customRoundData: ICurrentRoundData = {
      round: 2,
      participants: [
        {
          traveledDistance: 0,
          id: 1,
          name: "Lightning Bolt",
          color: "#00FF00",
          condition: 92,
          position: 1,
        },
      ],
      distance: 1400,
    };

    mockUseRaceStore.mockImplementation((selector) => {
      const state = {
        allHorses: mockHorses,
        currentRoundData: customRoundData,
      };
      return selector(state);
    });

    render(<HorseList />);

    const thunderHorseRow = screen.getByText("Thunder Horse").closest("tr");
    const lightningBoltRow = screen.getByText("Lightning Bolt").closest("tr");
    const stormRunnerRow = screen.getByText("Storm Runner").closest("tr");

    expect(thunderHorseRow).not.toHaveClass("activeHorse");
    expect(lightningBoltRow).toHaveClass("activeHorse");
    expect(stormRunnerRow).not.toHaveClass("activeHorse");
  });
});
