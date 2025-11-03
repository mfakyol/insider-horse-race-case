import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResultList from "./index";
import type { IRaceResult } from "@/types";

// Mock the store
interface MockState {
  raceResults: IRaceResult[];
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

describe("ResultList Component", () => {
  const mockRaceResults: IRaceResult[] = [
    {
      round: 1,
      distance: 1200,
      results: [
        { id: 0, name: "Thunder Horse", color: "#FF0000", position: 1 },
        { id: 1, name: "Lightning Bolt", color: "#00FF00", position: 2 },
        { id: 2, name: "Storm Runner", color: "#0000FF", position: 3 },
      ],
    },
    {
      round: 2,
      distance: 1400,
      results: [
        { id: 1, name: "Lightning Bolt", color: "#00FF00", position: 1 },
        { id: 0, name: "Thunder Horse", color: "#FF0000", position: 2 },
        { id: 2, name: "Storm Runner", color: "#0000FF", position: 3 },
      ],
    },
  ];

  const mockState: MockState = {
    raceResults: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRaceStore.mockImplementation((selector) => selector(mockState));
  });

  it("renders Results title", () => {
    render(<ResultList />);
    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  it("displays no results message when raceResults is empty", () => {
    render(<ResultList />);
    expect(
      screen.getByText("No results available. Please complete a race.")
    ).toBeInTheDocument();
  });

  it("renders race results when data exists", () => {
    mockState.raceResults = mockRaceResults;

    render(<ResultList />);

    expect(screen.getByText("1ST Lap - 1200m")).toBeInTheDocument();
    expect(screen.getByText("2ND Lap - 1400m")).toBeInTheDocument();
  });

  it("displays table headers correctly", () => {
    mockState.raceResults = mockRaceResults;

    render(<ResultList />);

    // Should have 2 sets of headers (one for each race)
    const rankHeaders = screen.getAllByText("Rank");
    const nameHeaders = screen.getAllByText("Name");

    expect(rankHeaders).toHaveLength(2);
    expect(nameHeaders).toHaveLength(2);
  });

  it("displays horse names in results", () => {
    mockState.raceResults = mockRaceResults;

    render(<ResultList />);

    expect(screen.getAllByText("Thunder Horse")).toHaveLength(2);
    expect(screen.getAllByText("Lightning Bolt")).toHaveLength(2);
    expect(screen.getAllByText("Storm Runner")).toHaveLength(2);
  });

  it("displays correct ranking numbers", () => {
    mockState.raceResults = mockRaceResults;

    render(<ResultList />);

    // Each race should have ranks 1, 2, 3
    const rank1s = screen.getAllByText("1");
    const rank2s = screen.getAllByText("2");
    const rank3s = screen.getAllByText("3");

    expect(rank1s).toHaveLength(2); // One for each race
    expect(rank2s).toHaveLength(2);
    expect(rank3s).toHaveLength(2);
  });

  it("renders results in correct order for each race", () => {
    mockState.raceResults = mockRaceResults;

    const { container } = render(<ResultList />);

    // Get all table rows and check order
    const tables = container.querySelectorAll("tbody");

    // First race: Thunder Horse (1st), Lightning Bolt (2nd), Storm Runner (3rd)
    const firstRaceRows = tables[0].querySelectorAll("tr");
    expect(firstRaceRows[0]).toHaveTextContent("1Thunder Horse");
    expect(firstRaceRows[1]).toHaveTextContent("2Lightning Bolt");
    expect(firstRaceRows[2]).toHaveTextContent("3Storm Runner");

    // Second race: Lightning Bolt (1st), Thunder Horse (2nd), Storm Runner (3rd)
    const secondRaceRows = tables[1].querySelectorAll("tr");
    expect(secondRaceRows[0]).toHaveTextContent("1Lightning Bolt");
    expect(secondRaceRows[1]).toHaveTextContent("2Thunder Horse");
    expect(secondRaceRows[2]).toHaveTextContent("3Storm Runner");
  });

  it("handles single race result correctly", () => {
    mockState.raceResults = [mockRaceResults[0]];

    render(<ResultList />);

    expect(screen.getByText("1ST Lap - 1200m")).toBeInTheDocument();
    expect(screen.queryByText("2ND Lap - 1400m")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    mockState.raceResults = mockRaceResults;

    const { container } = render(<ResultList />);

    const scheduleContainer = container.querySelector(".scheduleList");
    expect(scheduleContainer).toBeInTheDocument();
  });

  it("handles different ordinal suffixes correctly", () => {
    const testResults: IRaceResult[] = [
      {
        round: 21,
        distance: 1200,
        results: [{ id: 0, name: "Test Horse", color: "#FF0000", position: 1 }],
      },
      {
        round: 22,
        distance: 1400,
        results: [
          { id: 1, name: "Test Horse 2", color: "#00FF00", position: 1 },
        ],
      },
      {
        round: 23,
        distance: 1600,
        results: [
          { id: 2, name: "Test Horse 3", color: "#0000FF", position: 1 },
        ],
      },
    ];

    mockState.raceResults = testResults;

    render(<ResultList />);

    expect(screen.getByText("21ST Lap - 1200m")).toBeInTheDocument();
    expect(screen.getByText("22ND Lap - 1400m")).toBeInTheDocument();
    expect(screen.getByText("23RD Lap - 1600m")).toBeInTheDocument();
  });
});
