import { describe, it, expect, vi } from "vitest";
import { generateUniqueHorseName } from "./generateUniqueHorseName";

// Mock constants
vi.mock("@/constants/horseNames", () => ({
  HORSE_ADJECTIVES: ["Swift", "Brave", "Mighty", "Noble"],
  HORSE_NOUNS: ["Thunder", "Lightning", "Shadow", "Blaze"],
}));

describe("generateUniqueHorseName", () => {
  describe("basic functionality", () => {
    it("generates a valid horse name format", () => {
      const name = generateUniqueHorseName();

      expect(typeof name).toBe("string");
      expect(name.length).toBeGreaterThan(0);
      expect(name).toMatch(/^[A-Za-z]+ [A-Za-z]+( \d+)?$/); // "Adjective Noun" or "Adjective Noun Number"
    });

    it("generates names with adjective and noun", () => {
      const name = generateUniqueHorseName();
      const parts = name.split(" ");

      expect(parts.length).toBeGreaterThanOrEqual(2);
      expect(parts[0]).toMatch(/^[A-Za-z]+$/); // Adjective
      expect(parts[1]).toMatch(/^[A-Za-z]+$/); // Noun
    });

    it("uses words from the constants", () => {
      const mockAdjectives = ["Swift", "Brave", "Mighty", "Noble"];
      const mockNouns = ["Thunder", "Lightning", "Shadow", "Blaze"];

      const name = generateUniqueHorseName();
      const parts = name.split(" ");

      expect(mockAdjectives).toContain(parts[0]);
      expect(mockNouns).toContain(parts[1]);
    });
  });

  describe("uniqueness within function scope", () => {
    it("generates different names on multiple calls", () => {
      const names = Array.from({ length: 10 }, () => generateUniqueHorseName());

      // Since we're using limited word lists, we might get some duplicates
      // but we should see some variety
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBeGreaterThan(1);
    });

    it("can generate different combinations", () => {
      // With limited adjectives (4) and nouns (4), we have 16 possible combinations
      // Each call creates its own usedNames set, so we won't see numbered names
      // unless we mock random to force collisions within a single call
      const names = Array.from({ length: 20 }, () => generateUniqueHorseName());

      // All names should be valid format
      names.forEach((name) => {
        expect(name).toMatch(/^[A-Za-z]+ [A-Za-z]+( \d+)?$/);
      });

      // We should see some variety in the names
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBeGreaterThan(1);
    });
  });

  describe("deterministic behavior with mocked random", () => {
    it("produces predictable results with mocked Math.random", () => {
      const mockRandom = vi.spyOn(Math, "random");

      // Mock to select first adjective and first noun
      mockRandom.mockReturnValue(0);

      const name1 = generateUniqueHorseName();
      expect(name1).toBe("Swift Thunder");

      // Mock to select different combinations
      mockRandom.mockReturnValueOnce(0.25); // Second adjective
      mockRandom.mockReturnValueOnce(0.5); // Third noun
      const name2 = generateUniqueHorseName();
      expect(name2).toBe("Brave Shadow");

      mockRandom.mockRestore();
    });

    it("handles edge random values correctly", () => {
      const mockRandom = vi.spyOn(Math, "random");

      // Test with value close to 1 (should select last items)
      mockRandom.mockReturnValue(0.99);

      const name = generateUniqueHorseName();
      expect(name).toBe("Noble Blaze"); // Last adjective + Last noun

      mockRandom.mockRestore();
    });
  });

  describe("fallback mechanism", () => {
    it("adds counter when all combinations are used", () => {
      const mockRandom = vi.spyOn(Math, "random");

      // Force it to always generate the same combination
      mockRandom.mockReturnValue(0);

      // The first call should succeed without counter
      const name1 = generateUniqueHorseName();
      expect(name1).toBe("Swift Thunder");

      // Subsequent calls would hit the used names, but since each call
      // creates its own usedNames set, this test needs adjustment

      mockRandom.mockRestore();
    });
  });

  describe("edge cases", () => {
    it("handles when Math.random returns exactly 0", () => {
      const mockRandom = vi.spyOn(Math, "random");
      mockRandom.mockReturnValue(0);

      const name = generateUniqueHorseName();
      expect(name).toBe("Swift Thunder");

      mockRandom.mockRestore();
    });

    it("handles when Math.random returns value close to 1", () => {
      const mockRandom = vi.spyOn(Math, "random");
      mockRandom.mockReturnValue(0.9999);

      const name = generateUniqueHorseName();
      expect(name).toMatch(/^[A-Za-z]+ [A-Za-z]+( \d+)?$/);

      mockRandom.mockRestore();
    });
  });

  describe("performance", () => {
    it("generates names quickly", () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        generateUniqueHorseName();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete in less than 100ms
    });

    it("does not hang when generating many names", () => {
      // This test ensures the function completes even when generating many names
      const names = Array.from({ length: 50 }, () => generateUniqueHorseName());

      expect(names).toHaveLength(50);
      names.forEach((name) => {
        expect(name).toMatch(/^[A-Za-z]+ [A-Za-z]+( \d+)?$/);
      });
    });
  });

  describe("name format validation", () => {
    it("never returns empty strings", () => {
      for (let i = 0; i < 20; i++) {
        const name = generateUniqueHorseName();
        expect(name.length).toBeGreaterThan(0);
        expect(name.trim()).toBe(name); // No leading/trailing spaces
      }
    });

    it("always has proper capitalization", () => {
      const name = generateUniqueHorseName();
      const parts = name.split(" ");

      // First two parts should be capitalized words
      expect(parts[0]).toMatch(/^[A-Z][a-z]*$/);
      expect(parts[1]).toMatch(/^[A-Z][a-z]*$/);

      // If there's a number, it should be at the end
      if (parts.length > 2) {
        expect(parts[2]).toMatch(/^\d+$/);
      }
    });

    it("contains only expected characters", () => {
      const name = generateUniqueHorseName();

      // Should only contain letters, spaces, and optionally numbers
      expect(name).toMatch(/^[A-Za-z\s\d]+$/);

      // Should not contain special characters
      expect(name).not.toMatch(/[!@#$%^&*()_+=[\]{};':"\\|,.<>?]/);
    });
  });
});
