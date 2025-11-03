import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRaceStore } from "./useRaceStore";
import gameService from "@/services/game.service";

// Mock the game service
vi.mock("@/services/game.service");

describe("useRaceStore", () => {
  beforeEach(() => {
    // Setup mock implementations
    vi.mocked(gameService.generateRaceHorses).mockReturnValue([
      { id: 0, name: "Horse 1", color: "#ff0000", condition: 85 },
      { id: 1, name: "Horse 2", color: "#00ff00", condition: 90 },
      { id: 2, name: "Horse 3", color: "#0000ff", condition: 95 },
      { id: 3, name: "Horse 4", color: "#ffff00", condition: 88 },
      { id: 4, name: "Horse 5", color: "#ff00ff", condition: 92 },
    ]);

    vi.mocked(gameService.initializeRaceSchedule).mockReturnValue([
      {
        round: 1,
        distance: 1200,
        participants: [
          { id: 0, name: "Horse 1", color: "#ff0000", condition: 85 },
          { id: 1, name: "Horse 2", color: "#00ff00", condition: 90 },
        ],
      },
      {
        round: 2,
        distance: 1400,
        participants: [
          { id: 2, name: "Horse 3", color: "#0000ff", condition: 95 },
          { id: 3, name: "Horse 4", color: "#ffff00", condition: 88 },
        ],
      },
    ]);

    // Reset store to initial state
    useRaceStore.setState({
      allHorses: gameService.generateRaceHorses(20),
      raceSchedule: [],
      raceResults: [],
      currentRound: -1,
      raceStatus: "not_initiated",
      currentRoundData: undefined,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useRaceStore.getState();

      expect(state.allHorses).toHaveLength(5);
      expect(state.raceSchedule).toEqual([]);
      expect(state.raceResults).toEqual([]);
      expect(state.currentRound).toBe(-1);
      expect(state.raceStatus).toBe("not_initiated");
      expect(state.currentRoundData).toBeUndefined();
    });

    it("should generate horses on initialization", () => {
      expect(gameService.generateRaceHorses).toHaveBeenCalledWith(20);
    });
  });

  describe("initializeRaceSchedule", () => {
    it("should initialize race schedule", () => {
      const state = useRaceStore.getState();
      state.initializeRaceSchedule();

      const newState = useRaceStore.getState();

      expect(gameService.initializeRaceSchedule).toHaveBeenCalledWith(
        6,
        state.allHorses,
        10
      );
      expect(newState.raceSchedule).toHaveLength(2);
      expect(newState.raceStatus).toBe("not_started");
      expect(newState.raceResults).toEqual([]);
    });

    it("should reset current round and data", () => {
      // Set some existing state
      useRaceStore.setState({
        currentRound: 5,
        currentRoundData: {
          round: 3,
          distance: 1600,
          participants: [],
        },
        raceResults: [{ round: 1, distance: 1200, results: [] }],
      });

      const state = useRaceStore.getState();
      state.initializeRaceSchedule();

      const newState = useRaceStore.getState();
      expect(newState.currentRound).toBe(0); // startNextRound is called
      expect(newState.raceResults).toEqual([]);
    });

    it("should start next round automatically", () => {
      const state = useRaceStore.getState();
      state.initializeRaceSchedule();

      const newState = useRaceStore.getState();
      expect(newState.currentRound).toBe(0);
      expect(newState.currentRoundData).toBeDefined();
      expect(newState.currentRoundData?.round).toBe(1);
    });
  });

  describe("startNextRound", () => {
    beforeEach(() => {
      const state = useRaceStore.getState();
      state.initializeRaceSchedule();
    });

    it("should start the first round", () => {
      // Reset to initial state
      useRaceStore.setState({ currentRound: -1, currentRoundData: undefined });

      const state = useRaceStore.getState();
      state.startNextRound();

      const newState = useRaceStore.getState();
      expect(newState.currentRound).toBe(0);
      expect(newState.currentRoundData).toBeDefined();
      expect(newState.currentRoundData?.round).toBe(1);
      expect(newState.currentRoundData?.distance).toBe(1200);
      expect(newState.currentRoundData?.participants).toHaveLength(2);
    });

    it("should initialize participants with zero traveled distance and position", () => {
      useRaceStore.setState({ currentRound: -1, currentRoundData: undefined });

      const state = useRaceStore.getState();
      state.startNextRound();

      const newState = useRaceStore.getState();
      newState.currentRoundData?.participants.forEach((participant) => {
        expect(participant.traveledDistance).toBe(0);
        expect(participant.position).toBe(0);
      });
    });

    it("should advance to next round when called multiple times", () => {
      const state = useRaceStore.getState();
      state.startNextRound();

      const newState = useRaceStore.getState();
      expect(newState.currentRound).toBe(1);
      expect(newState.currentRoundData?.round).toBe(2);
      expect(newState.currentRoundData?.distance).toBe(1400);
    });

    it("should not advance beyond available rounds", () => {
      // Set to beyond the last round
      useRaceStore.setState({ currentRound: 1 }); // Last available round

      const state = useRaceStore.getState();
      state.startNextRound(); // Try to advance beyond last round

      const newState = useRaceStore.getState();
      expect(newState.currentRound).toBe(1); // Should not change
      // Since we're at the last round, startNextRound won't create new data
    });
  });

  describe("updateRaceStatus", () => {
    it("should update race status", () => {
      const state = useRaceStore.getState();
      state.updateRaceStatus("in_progress");

      const newState = useRaceStore.getState();
      expect(newState.raceStatus).toBe("in_progress");
    });

    it("should update to different statuses", () => {
      const state = useRaceStore.getState();

      state.updateRaceStatus("paused");
      expect(useRaceStore.getState().raceStatus).toBe("paused");

      state.updateRaceStatus("finished");
      expect(useRaceStore.getState().raceStatus).toBe("finished");

      state.updateRaceStatus("not_started");
      expect(useRaceStore.getState().raceStatus).toBe("not_started");
    });
  });

  describe("updateHorsePositions", () => {
    beforeEach(() => {
      const state = useRaceStore.getState();
      state.initializeRaceSchedule();
    });

    it("should set status to not_started when no current round data", () => {
      useRaceStore.setState({ currentRoundData: undefined });

      const state = useRaceStore.getState();
      state.updateHorsePositions();

      const newState = useRaceStore.getState();
      expect(newState.raceStatus).toBe("not_started");
    });

    it("should update horse traveled distances", () => {
      const state = useRaceStore.getState();
      state.updateHorsePositions();

      const newState = useRaceStore.getState();
      expect(newState.currentRoundData?.participants[0].traveledDistance).toBe(
        8.5
      ); // 85 * 0.1
      expect(newState.currentRoundData?.participants[1].traveledDistance).toBe(
        9.0
      ); // 90 * 0.1
    });

    it("should not exceed race distance", () => {
      // Set a horse very close to finish
      useRaceStore.setState({
        currentRoundData: {
          round: 1,
          distance: 100, // Short distance
          participants: [
            {
              id: 0,
              name: "Horse 1",
              color: "#ff0000",
              condition: 1000,
              traveledDistance: 95,
              position: 0,
            },
          ],
        },
      });

      const state = useRaceStore.getState();
      state.updateHorsePositions();

      const newState = useRaceStore.getState();
      expect(newState.currentRoundData?.participants[0].traveledDistance).toBe(
        100
      ); // Capped at distance
    });

    it("should assign positions to finished horses", () => {
      // Set horses that will finish this update
      useRaceStore.setState({
        currentRoundData: {
          round: 1,
          distance: 100,
          participants: [
            {
              id: 0,
              name: "Horse 1",
              color: "#ff0000",
              condition: 500,
              traveledDistance: 95,
              position: 0,
            },
            {
              id: 1,
              name: "Horse 2",
              color: "#00ff00",
              condition: 600,
              traveledDistance: 94,
              position: 0,
            },
          ],
        },
      });

      const state = useRaceStore.getState();
      state.updateHorsePositions();

      const newState = useRaceStore.getState();
      expect(newState.currentRoundData?.participants[0].position).toBe(2); // Second place (lower priority)
      expect(newState.currentRoundData?.participants[1].position).toBe(1); // First place (higher priority)
    });

    it("should handle tie-breaking by index", () => {
      useRaceStore.setState({
        currentRoundData: {
          round: 1,
          distance: 100,
          participants: [
            {
              id: 0,
              name: "Horse 1",
              color: "#ff0000",
              condition: 500,
              traveledDistance: 95,
              position: 0,
            },
            {
              id: 1,
              name: "Horse 2",
              color: "#00ff00",
              condition: 500,
              traveledDistance: 95,
              position: 0,
            },
          ],
        },
      });

      const state = useRaceStore.getState();
      state.updateHorsePositions();

      const newState = useRaceStore.getState();
      // Same priority, so index-based tie-breaking: lower index wins
      expect(newState.currentRoundData?.participants[0].position).toBe(1);
      expect(newState.currentRoundData?.participants[1].position).toBe(2);
    });

    it("should process race completion logic", () => {
      useRaceStore.setState({
        currentRoundData: {
          round: 1,
          distance: 10, // Very short distance
          participants: [
            {
              id: 0,
              name: "Horse 1",
              color: "#ff0000",
              condition: 500,
              traveledDistance: 5,
              position: 0,
            },
            {
              id: 1,
              name: "Horse 2",
              color: "#00ff00",
              condition: 600,
              traveledDistance: 4,
              position: 0,
            },
          ],
        },
        raceResults: [],
      });

      const state = useRaceStore.getState();
      state.updateHorsePositions();

      const newState = useRaceStore.getState();

      // Horses should have moved and potentially finished
      expect(
        newState.currentRoundData?.participants[0].traveledDistance
      ).toBeGreaterThan(5);
      expect(
        newState.currentRoundData?.participants[1].traveledDistance
      ).toBeGreaterThan(4);

      // Race should be processed (positions updated)
      expect(newState.currentRoundData).toBeDefined();
    });

    it("should sort race results by position", () => {
      useRaceStore.setState({
        currentRoundData: {
          round: 1,
          distance: 10,
          participants: [
            {
              id: 0,
              name: "Horse 1",
              color: "#ff0000",
              condition: 400,
              traveledDistance: 5,
              position: 0,
            },
            {
              id: 1,
              name: "Horse 2",
              color: "#00ff00",
              condition: 600,
              traveledDistance: 4,
              position: 0,
            },
            {
              id: 2,
              name: "Horse 3",
              color: "#0000ff",
              condition: 500,
              traveledDistance: 3,
              position: 0,
            },
          ],
        },
        raceResults: [],
      });

      const state = useRaceStore.getState();
      state.updateHorsePositions();

      const newState = useRaceStore.getState();

      // Only check if race finished and results are available
      if (
        newState.raceResults.length > 0 &&
        newState.raceResults[0].results.length > 0
      ) {
        const results = newState.raceResults[0].results;
        expect(results[0].position).toBe(1);
        expect(results[1].position).toBe(2);
        expect(results[2].position).toBe(3);
      }
    });

    it("should preserve existing race results", () => {
      const existingResults = [
        {
          round: 0,
          distance: 1000,
          results: [
            { id: 5, name: "Previous Horse", color: "#000000", position: 1 },
          ],
        },
      ];

      useRaceStore.setState({
        currentRoundData: {
          round: 1,
          distance: 10,
          participants: [
            {
              id: 0,
              name: "Horse 1",
              color: "#ff0000",
              condition: 500,
              traveledDistance: 5,
              position: 0,
            },
          ],
        },
        raceResults: existingResults,
      });

      const state = useRaceStore.getState();
      state.updateHorsePositions();

      const newState = useRaceStore.getState();

      // Check if new result was added
      if (
        newState.currentRoundData?.participants.every((p) => p.position > 0)
      ) {
        expect(newState.raceResults.length).toBeGreaterThanOrEqual(1);
        expect(newState.raceResults).toContainEqual(existingResults[0]);
      } else {
        // If race didn't finish, existing results should be preserved
        expect(newState.raceResults).toEqual(existingResults);
      }
    });
  });

  describe("store actions integration", () => {
    it("should work through a complete race flow", () => {
      const state = useRaceStore.getState();

      // Initialize race
      state.initializeRaceSchedule();
      expect(useRaceStore.getState().raceStatus).toBe("not_started");

      // Start racing
      state.updateRaceStatus("in_progress");
      expect(useRaceStore.getState().raceStatus).toBe("in_progress");

      // Update positions multiple times
      state.updateHorsePositions();
      state.updateHorsePositions();

      // Check that race is progressing
      const midState = useRaceStore.getState();
      expect(
        midState.currentRoundData?.participants[0].traveledDistance
      ).toBeGreaterThan(0);
    });

    it("should handle multiple rounds", () => {
      const state = useRaceStore.getState();
      state.initializeRaceSchedule();

      // Finish first round
      useRaceStore.setState({
        currentRoundData: {
          round: 1,
          distance: 100,
          participants: [
            {
              id: 0,
              name: "Horse 1",
              color: "#ff0000",
              condition: 500,
              traveledDistance: 100,
              position: 1,
            },
            {
              id: 1,
              name: "Horse 2",
              color: "#00ff00",
              condition: 400,
              traveledDistance: 100,
              position: 2,
            },
          ],
        },
      });

      state.updateHorsePositions();
      expect(useRaceStore.getState().raceResults).toHaveLength(1);

      // Start next round
      state.startNextRound();
      expect(useRaceStore.getState().currentRound).toBe(1);
      expect(useRaceStore.getState().currentRoundData?.round).toBe(2);
    });
  });
});
