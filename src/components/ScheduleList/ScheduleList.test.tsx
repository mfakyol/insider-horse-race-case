import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProgramList from "./index";
import type { IRaceSchedule, IHorse } from "@/types";

// Mock the store
interface MockState {
  raceSchedule: IRaceSchedule[];
}

const mockUseRaceStore = vi.fn();
vi.mock("@/stores/useRaceStore", () => ({
  useRaceStore: (selector: (state: MockState) => unknown) =>
    mockUseRaceStore(selector),
}));

// Mock utils
vi.mock("@/utils/getNumberSuffix", () => ({
  getNumberSuffix: vi.fn((n: number, uppercase?: boolean) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const suffix =
      n % 100 >= 11 && n % 100 <= 13 ? "th" : suffixes[n % 10] || "th";
    return uppercase ? suffix.toUpperCase() : suffix;
  }),
}));

describe("ScheduleList Component", () => {
  const mockHorses: IHorse[] = [
    { id: 0, name: "Thunder Horse", color: "#FF0000", condition: 85 },
    { id: 1, name: "Lightning Bolt", color: "#00FF00", condition: 92 },
    { id: 2, name: "Storm Runner", color: "#0000FF", condition: 78 },
  ];

  const mockRaceSchedule: IRaceSchedule[] = [
    {
      round: 1,
      distance: 1200,
      participants: [mockHorses[0], mockHorses[1], mockHorses[2]],
    },
    {
      round: 2,
      distance: 1400,
      participants: [mockHorses[1], mockHorses[2], mockHorses[0]],
    },
    {
      round: 3,
      distance: 1600,
      participants: [mockHorses[2], mockHorses[0], mockHorses[1]],
    },
  ];

  const mockState: MockState = {
    raceSchedule: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRaceStore.mockImplementation((selector) => selector(mockState));
  });

  it("renders Program title", () => {
    render(<ProgramList />);
    expect(screen.getByText("Program")).toBeInTheDocument();
  });

  it("displays no program message when raceSchedule is empty", () => {
    render(<ProgramList />);
    expect(
      screen.getByText("No program available. Please generate a program.")
    ).toBeInTheDocument();
  });

  it("renders race schedule when data exists", () => {
    mockState.raceSchedule = mockRaceSchedule;

    render(<ProgramList />);

    expect(screen.getByText("1ST Lap - 1200m")).toBeInTheDocument();
    expect(screen.getByText("2ND Lap - 1400m")).toBeInTheDocument();
    expect(screen.getByText("3RD Lap - 1600m")).toBeInTheDocument();
  });

  it("displays table headers correctly", () => {
    mockState.raceSchedule = mockRaceSchedule;

    render(<ProgramList />);

    // Should have 3 sets of headers (one for each race)
    const trackHeaders = screen.getAllByText("Track");
    const nameHeaders = screen.getAllByText("Name");

    expect(trackHeaders).toHaveLength(3);
    expect(nameHeaders).toHaveLength(3);
  });

  it("displays horse names in schedule", () => {
    mockState.raceSchedule = mockRaceSchedule;

    render(<ProgramList />);

    expect(screen.getAllByText("Thunder Horse")).toHaveLength(3);
    expect(screen.getAllByText("Lightning Bolt")).toHaveLength(3);
    expect(screen.getAllByText("Storm Runner")).toHaveLength(3);
  });

  it("displays correct track numbers", () => {
    mockState.raceSchedule = mockRaceSchedule;

    render(<ProgramList />);

    // Each race should have tracks 1, 2, 3
    const track1s = screen.getAllByText("1");
    const track2s = screen.getAllByText("2");
    const track3s = screen.getAllByText("3");

    expect(track1s).toHaveLength(3); // One for each race
    expect(track2s).toHaveLength(3);
    expect(track3s).toHaveLength(3);
  });

  it("renders participants in correct order for each race", () => {
    mockState.raceSchedule = mockRaceSchedule;

    const { container } = render(<ProgramList />);

    // Get all table rows and check order
    const tables = container.querySelectorAll("tbody");

    // First race: Thunder Horse (Track 1), Lightning Bolt (Track 2), Storm Runner (Track 3)
    const firstRaceRows = tables[0].querySelectorAll("tr");
    expect(firstRaceRows[0]).toHaveTextContent("1Thunder Horse");
    expect(firstRaceRows[1]).toHaveTextContent("2Lightning Bolt");
    expect(firstRaceRows[2]).toHaveTextContent("3Storm Runner");

    // Second race: Lightning Bolt (Track 1), Storm Runner (Track 2), Thunder Horse (Track 3)
    const secondRaceRows = tables[1].querySelectorAll("tr");
    expect(secondRaceRows[0]).toHaveTextContent("1Lightning Bolt");
    expect(secondRaceRows[1]).toHaveTextContent("2Storm Runner");
    expect(secondRaceRows[2]).toHaveTextContent("3Thunder Horse");

    // Third race: Storm Runner (Track 1), Thunder Horse (Track 2), Lightning Bolt (Track 3)
    const thirdRaceRows = tables[2].querySelectorAll("tr");
    expect(thirdRaceRows[0]).toHaveTextContent("1Storm Runner");
    expect(thirdRaceRows[1]).toHaveTextContent("2Thunder Horse");
    expect(thirdRaceRows[2]).toHaveTextContent("3Lightning Bolt");
  });

  it("handles single race schedule correctly", () => {
    mockState.raceSchedule = [mockRaceSchedule[0]];

    render(<ProgramList />);

    expect(screen.getByText("1ST Lap - 1200m")).toBeInTheDocument();
    expect(screen.queryByText("2ND Lap - 1400m")).not.toBeInTheDocument();
    expect(screen.queryByText("3RD Lap - 1600m")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    mockState.raceSchedule = mockRaceSchedule;

    const { container } = render(<ProgramList />);

    const scheduleContainer = container.querySelector(".scheduleList");
    expect(scheduleContainer).toBeInTheDocument();

    const raceCards = container.querySelectorAll(".raceCard");
    expect(raceCards).toHaveLength(3);
  });

  it("handles different distances correctly", () => {
    const customSchedule: IRaceSchedule[] = [
      {
        round: 1,
        distance: 1000,
        participants: [mockHorses[0]],
      },
      {
        round: 2,
        distance: 1500,
        participants: [mockHorses[1]],
      },
    ];

    mockState.raceSchedule = customSchedule;

    render(<ProgramList />);

    expect(screen.getByText("1ST Lap - 1000m")).toBeInTheDocument();
    expect(screen.getByText("2ND Lap - 1500m")).toBeInTheDocument();
  });

  it("handles different round numbers correctly", () => {
    const customSchedule: IRaceSchedule[] = [
      {
        round: 11,
        distance: 1200,
        participants: [mockHorses[0]],
      },
      {
        round: 21,
        distance: 1400,
        participants: [mockHorses[1]],
      },
      {
        round: 22,
        distance: 1600,
        participants: [mockHorses[2]],
      },
    ];

    mockState.raceSchedule = customSchedule;

    render(<ProgramList />);

    expect(screen.getByText("11TH Lap - 1200m")).toBeInTheDocument();
    expect(screen.getByText("21ST Lap - 1400m")).toBeInTheDocument();
    expect(screen.getByText("22ND Lap - 1600m")).toBeInTheDocument();
  });

  it("renders empty participants list correctly", () => {
    const emptySchedule: IRaceSchedule[] = [
      {
        round: 1,
        distance: 1200,
        participants: [],
      },
    ];

    mockState.raceSchedule = emptySchedule;

    render(<ProgramList />);

    expect(screen.getByText("1ST Lap - 1200m")).toBeInTheDocument();
    expect(screen.getByText("Track")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });
});
