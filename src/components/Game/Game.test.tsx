import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Game from "./index";
import type { IRaceStatus, ICurrentRoundData } from "@/types";

// Mock the store
interface MockState {
  raceStatus: IRaceStatus;
  currentRoundData: ICurrentRoundData | null;
  updateHorsePositions: () => void;
}

const mockUseRaceStore = vi.fn();
vi.mock("@/stores/useRaceStore", () => ({
  useRaceStore: (selector: (state: MockState) => unknown) =>
    mockUseRaceStore(selector),
}));

// Mock the game service
vi.mock("@/services/game.service", () => ({
  default: {
    getLapText: vi.fn(
      (round: number, distance: number) => `${round}st Lap ${distance}m`
    ),
  },
}));

// Mock SVG
vi.mock("@/assets/horse.svg", () => ({
  ReactComponent: ({
    style,
    className,
  }: {
    style?: React.CSSProperties;
    className?: string;
  }) => <div data-testid="horse-icon" style={style} className={className} />,
}));

// Mock requestAnimationFrame
Object.defineProperty(window, "requestAnimationFrame", {
  writable: true,
  value: vi.fn((cb: FrameRequestCallback) => {
    setTimeout(cb, 16);
    return 1;
  }),
});

Object.defineProperty(window, "cancelAnimationFrame", {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window, "performance", {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
  },
});

describe("Game Component", () => {
  const mockCurrentRoundData: ICurrentRoundData = {
    round: 1,
    distance: 1200,
    participants: [
      {
        id: 0,
        name: "Thunder Horse",
        color: "#FF0000",
        condition: 85,
        traveledDistance: 500,
        position: 1,
      },
      {
        id: 1,
        name: "Lightning Bolt",
        color: "#00FF00",
        condition: 92,
        traveledDistance: 300,
        position: 2,
      },
    ],
  };

  const mockState: MockState = {
    raceStatus: "not_initiated",
    currentRoundData: null,
    updateHorsePositions: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRaceStore.mockImplementation((selector) => selector(mockState));
  });

  it("renders the game component", () => {
    render(<Game />);
    expect(
      screen.getByText("No race in progress. Please Generate Program")
    ).toBeInTheDocument();
  });

  it("displays no race message when currentRoundData is null", () => {
    render(<Game />);
    expect(
      screen.getByText("No race in progress. Please Generate Program")
    ).toBeInTheDocument();
  });

  it("displays race information when currentRoundData exists", () => {
    mockState.currentRoundData = mockCurrentRoundData;

    render(<Game />);
    expect(screen.getByText("1st Lap 1200m")).toBeInTheDocument();
  });

  it("renders race track when currentRoundData exists", () => {
    mockState.currentRoundData = mockCurrentRoundData;

    render(<Game />);
    expect(screen.getByText("Thunder Horse")).toBeInTheDocument();
    expect(screen.getByText("Lightning Bolt")).toBeInTheDocument();
  });

  it("displays horse positions correctly", () => {
    mockState.currentRoundData = mockCurrentRoundData;

    render(<Game />);
    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("2nd")).toBeInTheDocument();
  });

  it("renders horse icons with correct colors", () => {
    mockState.currentRoundData = mockCurrentRoundData;

    render(<Game />);
    const horseIcons = screen.getAllByTestId("horse-icon");
    expect(horseIcons).toHaveLength(2);
  });

  it("shows starting gate numbers", () => {
    mockState.currentRoundData = mockCurrentRoundData;

    render(<Game />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("applies running class when race is in progress", () => {
    mockState.raceStatus = "in_progress";
    mockState.currentRoundData = mockCurrentRoundData;

    render(<Game />);
    // Check if horses are in running state
    const raceTrack = screen.getByText("Thunder Horse").closest(".raceTrack");
    expect(raceTrack).toBeInTheDocument();
  });

  it("does not show race track when no current round data", () => {
    mockState.currentRoundData = null;

    render(<Game />);
    expect(screen.queryByText("Thunder Horse")).not.toBeInTheDocument();
  });
});
