import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Header from "./index";
import type { IRaceStatus, IRaceSchedule } from "@/types";

// Mock the store
interface MockState {
  currentRound: number;
  raceSchedule: IRaceSchedule[];
  raceStatus: IRaceStatus;
  initializeRaceSchedule: () => void;
  startNextRound: () => void;
  updateRaceStatus: (status: IRaceStatus) => void;
}

const mockUseRaceStore = vi.fn();
const mockGetState = vi.fn();

vi.mock("@/stores/useRaceStore", () => ({
  useRaceStore: Object.assign(
    (selector: (state: MockState) => unknown) => mockUseRaceStore(selector),
    {
      getState: () => mockGetState(),
    }
  ),
}));

describe("Header", () => {
  const mockSchedule: IRaceSchedule[] = [
    { round: 1, participants: [], distance: 1200 },
    { round: 2, participants: [], distance: 1400 },
    { round: 3, participants: [], distance: 1600 },
  ];

  const mockState: MockState = {
    currentRound: -1,
    raceSchedule: [],
    raceStatus: "not_initiated",
    initializeRaceSchedule: vi.fn(),
    startNextRound: vi.fn(),
    updateRaceStatus: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRaceStore.mockImplementation((selector) => selector(mockState));
    mockGetState.mockReturnValue(mockState);
  });

  it("renders header component", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("displays the application title", () => {
    render(<Header />);
    expect(screen.getByText("Horse Racing")).toBeInTheDocument();
  });

  it("has correct navigation structure", () => {
    render(<Header />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("header");
  });

  it("renders Generate Program button", () => {
    render(<Header />);
    expect(screen.getByText("Generate Program")).toBeInTheDocument();
  });

  it("renders Start Race button when not initiated", () => {
    render(<Header />);
    expect(screen.getByText("Start Race")).toBeInTheDocument();
  });

  it("disables Start Race button when race is not initiated", () => {
    render(<Header />);
    const startButton = screen.getByText("Start Race");
    expect(startButton).toBeDisabled();
  });

  it("shows Pause Race when race is in progress", () => {
    mockState.raceStatus = "in_progress";
    mockState.currentRound = 0;
    mockState.raceSchedule = mockSchedule;

    render(<Header />);
    expect(screen.getByText("Pause Race")).toBeInTheDocument();
  });

  it("shows Resume Race when race is paused", () => {
    mockState.raceStatus = "paused";
    mockState.currentRound = 0;

    render(<Header />);
    expect(screen.getByText("Resume Race")).toBeInTheDocument();
  });

  it("shows Next Round when race is finished and not last round", () => {
    mockState.raceStatus = "finished";
    mockState.currentRound = 0;
    mockState.raceSchedule = mockSchedule;

    render(<Header />);
    expect(screen.getByText("Next Round")).toBeInTheDocument();
  });
});
