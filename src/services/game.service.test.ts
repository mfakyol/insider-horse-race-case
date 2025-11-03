import { describe, it, expect, vi, beforeEach } from "vitest";
import gameService from "./game.service";
import type { IHorse } from "@/types";
import { getNumberSuffix } from "@/utils/getNumberSuffix";
import { generateRandomColor } from "@/utils/generateRandomColor";
import { generateUniqueHorseName } from "@/utils/generateUniqueHorseName";
import { selectRandomHorses } from "@/utils/selectRandomHorses";

// Mock utilities
vi.mock("@/utils/getNumberSuffix");
vi.mock("@/utils/generateRandomColor");
vi.mock("@/utils/generateUniqueHorseName");
vi.mock("@/utils/selectRandomHorses");

describe("GameService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock implementations
    vi.mocked(getNumberSuffix).mockImplementation((num: number) => {
      if (num === 1) return "st";
      if (num === 2) return "nd";
      if (num === 3) return "rd";
      return "th";
    });

    vi.mocked(generateRandomColor).mockReturnValue("#ff0000");
    vi.mocked(generateUniqueHorseName).mockReturnValue("Test Horse");
    vi.mocked(selectRandomHorses).mockImplementation(
      (horses: IHorse[], count: number) => horses.slice(0, count)
    );

    // Mock Math.random to return predictable values
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  describe("generateRaceHorses", () => {
    it("should generate the correct number of horses", () => {
      const numHorses = 5;
      const horses = gameService.generateRaceHorses(numHorses);

      expect(horses).toHaveLength(numHorses);
    });

    it("should generate horses with correct structure", () => {
      const horses = gameService.generateRaceHorses(3);

      horses.forEach((horse, index) => {
        expect(horse).toEqual({
          id: index,
          name: "Test Horse",
          color: "#ff0000",
          condition: expect.any(Number),
        });
        expect(horse.condition).toBeGreaterThanOrEqual(80);
        expect(horse.condition).toBeLessThanOrEqual(100);
      });
    });

    it("should generate unique IDs for each horse", () => {
      const horses = gameService.generateRaceHorses(10);
      const ids = horses.map((horse) => horse.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(horses.length);
    });

    it("should handle zero horses", () => {
      const horses = gameService.generateRaceHorses(0);
      expect(horses).toHaveLength(0);
    });

    it("should handle single horse", () => {
      const horses = gameService.generateRaceHorses(1);

      expect(horses).toHaveLength(1);
      expect(horses[0]).toEqual({
        id: 0,
        name: "Test Horse",
        color: "#ff0000",
        condition: expect.any(Number),
      });
    });

    it("should call utility functions for each horse", () => {
      gameService.generateRaceHorses(3);

      expect(generateUniqueHorseName).toHaveBeenCalledTimes(3);
      expect(generateRandomColor).toHaveBeenCalledTimes(3);
    });

    it("should generate condition values between 80-100", () => {
      // Test with mocked Math.random value of 0.5
      const horses = gameService.generateRaceHorses(1);
      expect(horses[0].condition).toBe(90); // 80 + Math.floor(0.5 * 21) = 80 + 10 = 90
    });
  });

  describe("initializeRaceSchedule", () => {
    const mockHorses: IHorse[] = [
      { id: 0, name: "Horse 1", color: "#ff0000", condition: 85 },
      { id: 1, name: "Horse 2", color: "#00ff00", condition: 90 },
      { id: 2, name: "Horse 3", color: "#0000ff", condition: 95 },
      { id: 3, name: "Horse 4", color: "#ffff00", condition: 88 },
      { id: 4, name: "Horse 5", color: "#ff00ff", condition: 92 },
    ];

    it("should generate the correct number of rounds", () => {
      const rounds = 3;
      const schedule = gameService.initializeRaceSchedule(
        rounds,
        mockHorses,
        3
      );

      expect(schedule).toHaveLength(rounds);
    });

    it("should generate schedule with correct structure", () => {
      const schedule = gameService.initializeRaceSchedule(2, mockHorses, 3);

      schedule.forEach((race, index) => {
        expect(race).toEqual({
          round: index + 1,
          participants: expect.any(Array),
          distance: 1200 + index * 200,
        });
        expect(race.participants).toHaveLength(3);
      });
    });

    it("should have increasing distances for each round", () => {
      const schedule = gameService.initializeRaceSchedule(4, mockHorses, 2);

      expect(schedule[0].distance).toBe(1200);
      expect(schedule[1].distance).toBe(1400);
      expect(schedule[2].distance).toBe(1600);
      expect(schedule[3].distance).toBe(1800);
    });

    it("should have sequential round numbers", () => {
      const schedule = gameService.initializeRaceSchedule(3, mockHorses, 2);

      expect(schedule[0].round).toBe(1);
      expect(schedule[1].round).toBe(2);
      expect(schedule[2].round).toBe(3);
    });

    it("should call selectRandomHorses for each round", () => {
      gameService.initializeRaceSchedule(3, mockHorses, 4);

      expect(selectRandomHorses).toHaveBeenCalledTimes(3);
      expect(selectRandomHorses).toHaveBeenCalledWith(mockHorses, 4);
    });

    it("should handle zero rounds", () => {
      const schedule = gameService.initializeRaceSchedule(0, mockHorses, 3);
      expect(schedule).toHaveLength(0);
    });

    it("should handle single round", () => {
      const schedule = gameService.initializeRaceSchedule(1, mockHorses, 2);

      expect(schedule).toHaveLength(1);
      expect(schedule[0]).toEqual({
        round: 1,
        participants: expect.any(Array),
        distance: 1200,
      });
    });

    it("should handle empty horses array", () => {
      const schedule = gameService.initializeRaceSchedule(2, [], 3);

      expect(schedule).toHaveLength(2);
      expect(selectRandomHorses).toHaveBeenCalledWith([], 3);
    });

    it("should maintain participants from selectRandomHorses", () => {
      const expectedParticipants = mockHorses.slice(0, 2);
      vi.mocked(selectRandomHorses).mockReturnValue(expectedParticipants);

      const schedule = gameService.initializeRaceSchedule(1, mockHorses, 2);

      expect(schedule[0].participants).toEqual(expectedParticipants);
    });
  });

  describe("getLapText", () => {
    it("should format lap text correctly for 1st round", () => {
      const result = gameService.getLapText(1, 1200);
      expect(result).toBe("1st Lap 1200m");
      expect(getNumberSuffix).toHaveBeenCalledWith(1);
    });

    it("should format lap text correctly for 2nd round", () => {
      const result = gameService.getLapText(2, 1400);
      expect(result).toBe("2nd Lap 1400m");
      expect(getNumberSuffix).toHaveBeenCalledWith(2);
    });

    it("should format lap text correctly for 3rd round", () => {
      const result = gameService.getLapText(3, 1600);
      expect(result).toBe("3rd Lap 1600m");
      expect(getNumberSuffix).toHaveBeenCalledWith(3);
    });

    it("should format lap text correctly for 4th round and beyond", () => {
      const result = gameService.getLapText(4, 1800);
      expect(result).toBe("4th Lap 1800m");

      const result5 = gameService.getLapText(5, 2000);
      expect(result5).toBe("5th Lap 2000m");
    });

    it("should handle different distances", () => {
      const result1 = gameService.getLapText(1, 800);
      expect(result1).toBe("1st Lap 800m");

      const result2 = gameService.getLapText(2, 2500);
      expect(result2).toBe("2nd Lap 2500m");
    });

    it("should call getNumberSuffix with correct round number", () => {
      gameService.getLapText(7, 1200);
      expect(getNumberSuffix).toHaveBeenCalledWith(7);
    });

    it("should handle zero round (edge case)", () => {
      const result = gameService.getLapText(0, 1000);
      expect(result).toBe("0th Lap 1000m");
    });

    it("should handle negative round (edge case)", () => {
      const result = gameService.getLapText(-1, 1000);
      expect(result).toBe("-1th Lap 1000m");
    });

    it("should handle large round numbers", () => {
      const result = gameService.getLapText(100, 5000);
      expect(result).toBe("100th Lap 5000m");
    });

    it("should work with custom suffix from getNumberSuffix", () => {
      vi.mocked(getNumberSuffix).mockReturnValue("xyz");
      const result = gameService.getLapText(99, 1500);
      expect(result).toBe("99xyz Lap 1500m");
    });
  });

  describe("gameService object", () => {
    it("should export all required methods", () => {
      expect(gameService).toHaveProperty("generateRaceHorses");
      expect(gameService).toHaveProperty("initializeRaceSchedule");
      expect(gameService).toHaveProperty("getLapText");
    });

    it("should have all methods as functions", () => {
      expect(typeof gameService.generateRaceHorses).toBe("function");
      expect(typeof gameService.initializeRaceSchedule).toBe("function");
      expect(typeof gameService.getLapText).toBe("function");
    });
  });

  describe("integration scenarios", () => {
    it("should work with realistic race setup", () => {
      // Generate horses for a realistic race
      const horses = gameService.generateRaceHorses(8);
      expect(horses).toHaveLength(8);

      // Create schedule with 3 rounds, 4 participants each
      const schedule = gameService.initializeRaceSchedule(3, horses, 4);
      expect(schedule).toHaveLength(3);

      // Check lap texts
      schedule.forEach((race) => {
        const lapText = gameService.getLapText(race.round, race.distance);
        expect(lapText).toMatch(/^\d+(st|nd|rd|th|xyz) Lap \d+m$/);
      });
    });

    it("should handle edge case with more participants than horses", () => {
      const horses = gameService.generateRaceHorses(2);
      gameService.initializeRaceSchedule(1, horses, 5);

      // selectRandomHorses should handle this gracefully
      expect(selectRandomHorses).toHaveBeenCalledWith(horses, 5);
    });

    it("should maintain consistency across multiple calls", () => {
      // Test that the service methods work together consistently
      const horses1 = gameService.generateRaceHorses(5);
      const horses2 = gameService.generateRaceHorses(5);

      expect(horses1).toHaveLength(5);
      expect(horses2).toHaveLength(5);

      const schedule1 = gameService.initializeRaceSchedule(2, horses1, 3);
      const schedule2 = gameService.initializeRaceSchedule(2, horses2, 3);

      expect(schedule1).toHaveLength(2);
      expect(schedule2).toHaveLength(2);
    });
  });
});
