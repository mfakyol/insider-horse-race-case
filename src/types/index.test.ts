import { describe, it, expect } from "vitest";
import type {
  IHorse,
  IRaceSchedule,
  IRaceResult,
  ICurrentRoundData,
  IRaceStatus,
} from "./index";

describe("Type Definitions", () => {
  describe("IHorse interface", () => {
    it("should accept valid horse objects", () => {
      const validHorse: IHorse = {
        id: 1,
        name: "Swift Thunder",
        color: "#ff0000",
        condition: 85,
      };

      expect(validHorse.id).toBe(1);
      expect(validHorse.name).toBe("Swift Thunder");
      expect(validHorse.color).toBe("#ff0000");
      expect(validHorse.condition).toBe(85);
    });

    it("should have all required properties", () => {
      const horse: IHorse = {
        id: 0,
        name: "",
        color: "",
        condition: 0,
      };

      expect("id" in horse).toBe(true);
      expect("name" in horse).toBe(true);
      expect("color" in horse).toBe(true);
      expect("condition" in horse).toBe(true);
    });

    it("should work with different value types", () => {
      const horses: IHorse[] = [
        { id: 1, name: "Horse 1", color: "#000000", condition: 100 },
        { id: 2, name: "Horse 2", color: "#ffffff", condition: 80 },
        { id: 0, name: "", color: "", condition: 0 },
        { id: -1, name: "Negative ID", color: "red", condition: 50 },
      ];

      horses.forEach((horse) => {
        expect(typeof horse.id).toBe("number");
        expect(typeof horse.name).toBe("string");
        expect(typeof horse.color).toBe("string");
        expect(typeof horse.condition).toBe("number");
      });
    });
  });

  describe("IRaceSchedule interface", () => {
    it("should accept valid race schedule objects", () => {
      const participants: IHorse[] = [
        { id: 1, name: "Horse 1", color: "#ff0000", condition: 85 },
        { id: 2, name: "Horse 2", color: "#00ff00", condition: 90 },
      ];

      const validSchedule: IRaceSchedule = {
        round: 1,
        participants: participants,
        distance: 1200,
      };

      expect(validSchedule.round).toBe(1);
      expect(validSchedule.participants).toEqual(participants);
      expect(validSchedule.distance).toBe(1200);
    });

    it("should work with empty participants", () => {
      const schedule: IRaceSchedule = {
        round: 0,
        participants: [],
        distance: 0,
      };

      expect(schedule.participants).toEqual([]);
      expect(Array.isArray(schedule.participants)).toBe(true);
    });

    it("should work with multiple participants", () => {
      const participants: IHorse[] = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: `Horse ${i}`,
        color: `#${i.toString().padStart(6, "0")}`,
        condition: 80 + i,
      }));

      const schedule: IRaceSchedule = {
        round: 5,
        participants: participants,
        distance: 2000,
      };

      expect(schedule.participants).toHaveLength(10);
      expect(schedule.participants[0].id).toBe(0);
      expect(schedule.participants[9].id).toBe(9);
    });
  });

  describe("IRaceResult interface", () => {
    it("should accept valid race result objects", () => {
      const validResult: IRaceResult = {
        round: 1,
        distance: 1200,
        results: [
          { id: 1, name: "Horse 1", color: "#ff0000", position: 1 },
          { id: 2, name: "Horse 2", color: "#00ff00", position: 2 },
        ],
      };

      expect(validResult.round).toBe(1);
      expect(validResult.distance).toBe(1200);
      expect(validResult.results).toHaveLength(2);
      expect(validResult.results[0].position).toBe(1);
    });

    it("should work with empty results", () => {
      const result: IRaceResult = {
        round: 0,
        distance: 0,
        results: [],
      };

      expect(result.results).toEqual([]);
      expect(Array.isArray(result.results)).toBe(true);
    });

    it("should have results with correct structure", () => {
      const result: IRaceResult = {
        round: 1,
        distance: 1500,
        results: [{ id: 5, name: "Winner", color: "#gold", position: 1 }],
      };

      const firstResult = result.results[0];
      expect("id" in firstResult).toBe(true);
      expect("name" in firstResult).toBe(true);
      expect("color" in firstResult).toBe(true);
      expect("position" in firstResult).toBe(true);

      expect(typeof firstResult.id).toBe("number");
      expect(typeof firstResult.name).toBe("string");
      expect(typeof firstResult.color).toBe("string");
      expect(typeof firstResult.position).toBe("number");
    });

    it("should support multiple results with different positions", () => {
      const results = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        name: `Horse ${i + 1}`,
        color: `#color${i}`,
        position: i + 1,
      }));

      const raceResult: IRaceResult = {
        round: 3,
        distance: 1800,
        results: results,
      };

      expect(raceResult.results).toHaveLength(5);
      raceResult.results.forEach((result, index) => {
        expect(result.position).toBe(index + 1);
        expect(result.id).toBe(index);
      });
    });
  });

  describe("ICurrentRoundData interface", () => {
    it("should accept valid current round data", () => {
      const validData: ICurrentRoundData = {
        round: 1,
        distance: 1200,
        participants: [
          {
            traveledDistance: 450.5,
            id: 1,
            name: "Horse 1",
            color: "#ff0000",
            condition: 85,
            position: 0,
          },
        ],
      };

      expect(validData.round).toBe(1);
      expect(validData.distance).toBe(1200);
      expect(validData.participants[0].traveledDistance).toBe(450.5);
      expect(validData.participants[0].position).toBe(0);
    });

    it("should extend IHorse with additional properties", () => {
      const participant = {
        traveledDistance: 100,
        id: 1,
        name: "Test Horse",
        color: "#000000",
        condition: 90,
        position: 2,
      };

      const data: ICurrentRoundData = {
        round: 1,
        distance: 1000,
        participants: [participant],
      };

      // Should have all IHorse properties
      expect(data.participants[0].id).toBeDefined();
      expect(data.participants[0].name).toBeDefined();
      expect(data.participants[0].color).toBeDefined();
      expect(data.participants[0].condition).toBeDefined();

      // Plus additional properties
      expect(data.participants[0].traveledDistance).toBeDefined();
      expect(data.participants[0].position).toBeDefined();
    });

    it("should work with multiple participants in different states", () => {
      const data: ICurrentRoundData = {
        round: 2,
        distance: 1400,
        participants: [
          {
            traveledDistance: 1400,
            id: 1,
            name: "Finished",
            color: "#gold",
            condition: 95,
            position: 1,
          },
          {
            traveledDistance: 1200,
            id: 2,
            name: "Almost",
            color: "#silver",
            condition: 88,
            position: 0,
          },
          {
            traveledDistance: 800,
            id: 3,
            name: "Halfway",
            color: "#bronze",
            condition: 82,
            position: 0,
          },
        ],
      };

      expect(data.participants[0].position).toBe(1); // Finished
      expect(data.participants[1].position).toBe(0); // Still racing
      expect(data.participants[2].position).toBe(0); // Still racing

      expect(data.participants[0].traveledDistance).toBe(1400);
      expect(data.participants[1].traveledDistance).toBe(1200);
      expect(data.participants[2].traveledDistance).toBe(800);
    });
  });

  describe("IRaceStatus type", () => {
    it("should accept all valid status values", () => {
      const validStatuses: IRaceStatus[] = [
        "not_initiated",
        "not_started",
        "in_progress",
        "finished",
        "paused",
      ];

      validStatuses.forEach((status) => {
        const testStatus: IRaceStatus = status;
        expect(testStatus).toBe(status);
      });
    });

    it("should work in conditional statements", () => {
      const testStatuses: IRaceStatus[] = [
        "not_initiated",
        "not_started",
        "in_progress",
        "finished",
        "paused",
      ];

      testStatuses.forEach((status) => {
        let result = "";
        switch (status) {
          case "not_initiated":
            result = "Not initiated";
            break;
          case "not_started":
            result = "Not started";
            break;
          case "in_progress":
            result = "In progress";
            break;
          case "finished":
            result = "Finished";
            break;
          case "paused":
            result = "Paused";
            break;
        }

        expect(result).toBeTruthy();
      });

      // Test specific case
      const inProgressStatus: IRaceStatus = "in_progress";
      expect(inProgressStatus).toBe("in_progress");
    });

    it("should work with type guards", () => {
      const checkStatus = (status: string): status is IRaceStatus => {
        return [
          "not_initiated",
          "not_started",
          "in_progress",
          "finished",
          "paused",
        ].includes(status);
      };

      expect(checkStatus("in_progress")).toBe(true);
      expect(checkStatus("invalid_status")).toBe(false);
      expect(checkStatus("finished")).toBe(true);
      expect(checkStatus("")).toBe(false);
    });
  });

  describe("Type relationships", () => {
    it("should work together in complex scenarios", () => {
      // Create a complete race scenario
      const horses: IHorse[] = [
        { id: 1, name: "Swift", color: "#ff0000", condition: 90 },
        { id: 2, name: "Brave", color: "#00ff00", condition: 85 },
      ];

      const schedule: IRaceSchedule = {
        round: 1,
        participants: horses,
        distance: 1200,
      };

      const currentData: ICurrentRoundData = {
        round: schedule.round,
        distance: schedule.distance,
        participants: schedule.participants.map((horse) => ({
          ...horse,
          traveledDistance: 600,
          position: 0,
        })),
      };

      const result: IRaceResult = {
        round: schedule.round,
        distance: schedule.distance,
        results: horses.map((horse, index) => ({
          id: horse.id,
          name: horse.name,
          color: horse.color,
          position: index + 1,
        })),
      };

      const status: IRaceStatus = "finished";

      // All types should work together
      expect(currentData.round).toBe(schedule.round);
      expect(result.distance).toBe(currentData.distance);
      expect(status).toBe("finished");
    });

    it("should maintain type safety across transformations", () => {
      const horse: IHorse = {
        id: 1,
        name: "Test",
        color: "#000",
        condition: 80,
      };

      // Transform to current round participant
      const participant = {
        ...horse,
        traveledDistance: 0,
        position: 0,
      };

      // Transform to result
      const resultEntry = {
        id: horse.id,
        name: horse.name,
        color: horse.color,
        position: 1,
      };

      expect(participant.id).toBe(horse.id);
      expect(resultEntry.name).toBe(horse.name);
    });
  });
});
