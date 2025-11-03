import { describe, it, expect, vi } from "vitest";
import { selectRandomHorses } from "./selectRandomHorses";
import type { IHorse } from "@/types";

describe("selectRandomHorses", () => {
  const mockHorses: IHorse[] = [
    { id: 0, name: "Thunder Horse", color: "#FF0000", condition: 85 },
    { id: 1, name: "Lightning Bolt", color: "#00FF00", condition: 92 },
    { id: 2, name: "Storm Runner", color: "#0000FF", condition: 78 },
    { id: 3, name: "Wind Dancer", color: "#FFFF00", condition: 88 },
    { id: 4, name: "Fire Spirit", color: "#FF00FF", condition: 90 },
    { id: 5, name: "Shadow Walker", color: "#00FFFF", condition: 82 },
  ];

  describe("basic functionality", () => {
    it("returns the correct number of horses", () => {
      const result = selectRandomHorses(mockHorses, 3);
      expect(result).toHaveLength(3);
    });

    it("returns horses from the original array", () => {
      const result = selectRandomHorses(mockHorses, 2);

      result.forEach((horse) => {
        expect(mockHorses).toContainEqual(horse);
      });
    });

    it("returns different horses when count is less than total", () => {
      const result = selectRandomHorses(mockHorses, 4);
      const ids = result.map((h) => h.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(4); // No duplicates
    });

    it("preserves horse object properties", () => {
      const result = selectRandomHorses(mockHorses, 1);
      const selectedHorse = result[0];

      expect(selectedHorse).toHaveProperty("id");
      expect(selectedHorse).toHaveProperty("name");
      expect(selectedHorse).toHaveProperty("color");
      expect(selectedHorse).toHaveProperty("condition");
      expect(typeof selectedHorse.id).toBe("number");
      expect(typeof selectedHorse.name).toBe("string");
      expect(typeof selectedHorse.color).toBe("string");
      expect(typeof selectedHorse.condition).toBe("number");
    });
  });

  describe("edge cases", () => {
    it("returns all horses when count equals array length", () => {
      const result = selectRandomHorses(mockHorses, mockHorses.length);
      expect(result).toHaveLength(mockHorses.length);

      // Should contain all original horses (order might be different)
      const resultIds = result.map((h) => h.id).sort();
      const originalIds = mockHorses.map((h) => h.id).sort();
      expect(resultIds).toEqual(originalIds);
    });

    it("returns all horses when count is greater than array length", () => {
      const result = selectRandomHorses(mockHorses, mockHorses.length + 5);
      expect(result).toHaveLength(mockHorses.length);
    });

    it("returns empty array when count is 0", () => {
      const result = selectRandomHorses(mockHorses, 0);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("handles empty input array", () => {
      const result = selectRandomHorses([], 3);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("handles negative count", () => {
      const result = selectRandomHorses(mockHorses, -1);
      // slice(0, -1) returns all elements except the last one
      expect(result).toHaveLength(mockHorses.length - 1);
    });
  });

  describe("randomness", () => {
    it("produces different results on multiple calls", () => {
      const results = Array.from({ length: 10 }, () =>
        selectRandomHorses(mockHorses, 3)
      );

      const serializedResults = results.map((r) =>
        r
          .map((h) => h.id)
          .sort()
          .join(",")
      );

      const uniqueResults = new Set(serializedResults);

      // With 10 calls selecting 3 from 6, we should get some variation
      expect(uniqueResults.size).toBeGreaterThan(1);
    });

    it("can select all possible horses over multiple calls", () => {
      const allSelectedIds = new Set<number>();

      // Run many times to ensure we can select all horses
      for (let i = 0; i < 50; i++) {
        const result = selectRandomHorses(mockHorses, 3);
        result.forEach((horse) => allSelectedIds.add(horse.id));
      }

      // We should have seen all horse IDs at some point
      const originalIds = new Set(mockHorses.map((h) => h.id));
      expect(allSelectedIds).toEqual(originalIds);
    });
  });

  describe("array immutability", () => {
    it("does not modify the original array", () => {
      const originalHorses = [...mockHorses];
      selectRandomHorses(mockHorses, 3);

      expect(mockHorses).toEqual(originalHorses);
    });

    it("does not modify horse objects", () => {
      const originalHorse = { ...mockHorses[0] };
      const result = selectRandomHorses(mockHorses, 1);

      // Original horse should be unchanged
      expect(mockHorses[0]).toEqual(originalHorse);

      // Selected horse should have same properties
      if (result[0].id === originalHorse.id) {
        expect(result[0]).toEqual(originalHorse);
      }
    });
  });

  describe("deterministic behavior with mocked random", () => {
    it("produces predictable results with mocked Math.random", () => {
      const mockRandom = vi.spyOn(Math, "random");

      // Mock to always return 0.5, which should give consistent sorting
      mockRandom.mockReturnValue(0.5);

      const result1 = selectRandomHorses(mockHorses, 3);
      const result2 = selectRandomHorses(mockHorses, 3);

      expect(result1).toEqual(result2);

      mockRandom.mockRestore();
    });

    it("handles different random values correctly", () => {
      const mockRandom = vi.spyOn(Math, "random");

      // Test with different mock values
      mockRandom.mockReturnValue(0.1);
      const result1 = selectRandomHorses(mockHorses, 2);

      mockRandom.mockReturnValue(0.9);
      const result2 = selectRandomHorses(mockHorses, 2);

      // Both should return valid results
      expect(result1).toHaveLength(2);
      expect(result2).toHaveLength(2);

      mockRandom.mockRestore();
    });
  });

  describe("performance", () => {
    it("handles large arrays efficiently", () => {
      const largeArray: IHorse[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Horse ${i}`,
        color: "#000000",
        condition: 50 + (i % 50),
      }));

      const startTime = performance.now();
      const result = selectRandomHorses(largeArray, 100);
      const endTime = performance.now();

      expect(result).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(50); // Should be fast
    });
  });

  describe("single horse array", () => {
    it("handles single horse array correctly", () => {
      const singleHorse = [mockHorses[0]];

      const result = selectRandomHorses(singleHorse, 1);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockHorses[0]);

      const resultZero = selectRandomHorses(singleHorse, 0);
      expect(resultZero).toHaveLength(0);

      const resultMore = selectRandomHorses(singleHorse, 5);
      expect(resultMore).toHaveLength(1);
      expect(resultMore[0]).toEqual(mockHorses[0]);
    });
  });
});
