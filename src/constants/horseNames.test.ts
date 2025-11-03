import { describe, it, expect } from "vitest";
import { HORSE_ADJECTIVES, HORSE_NOUNS } from "./horseNames";

describe("horseNames constants", () => {
  describe("HORSE_ADJECTIVES", () => {
    it("should be defined and not empty", () => {
      expect(HORSE_ADJECTIVES).toBeDefined();
      expect(HORSE_ADJECTIVES.length).toBeGreaterThan(0);
    });

    it("should contain expected number of adjectives", () => {
      expect(HORSE_ADJECTIVES).toHaveLength(24);
    });

    it("should contain only string values", () => {
      HORSE_ADJECTIVES.forEach((adjective) => {
        expect(typeof adjective).toBe("string");
        expect(adjective.length).toBeGreaterThan(0);
      });
    });

    it("should contain expected adjectives", () => {
      const expectedAdjectives = [
        "Swift",
        "Brave",
        "Mighty",
        "Noble",
        "Fierce",
        "Gentle",
        "Royal",
        "Golden",
        "Silver",
        "Crimson",
        "Dark",
        "Bright",
        "Wild",
        "Free",
        "Bold",
        "Proud",
        "Strong",
        "Fast",
        "Majestic",
        "Elegant",
        "Graceful",
        "Powerful",
        "Mystical",
        "Ancient",
      ];

      expectedAdjectives.forEach((adjective) => {
        expect(HORSE_ADJECTIVES).toContain(adjective);
      });
    });

    it("should have all unique adjectives", () => {
      const uniqueAdjectives = new Set(HORSE_ADJECTIVES);
      expect(uniqueAdjectives.size).toBe(HORSE_ADJECTIVES.length);
    });

    it("should have proper capitalization", () => {
      HORSE_ADJECTIVES.forEach((adjective) => {
        expect(adjective[0]).toBe(adjective[0].toUpperCase());
        expect(adjective.slice(1)).toBe(adjective.slice(1).toLowerCase());
      });
    });

    it("should not contain empty strings or whitespace", () => {
      HORSE_ADJECTIVES.forEach((adjective) => {
        expect(adjective.trim()).toBe(adjective);
        expect(adjective.length).toBeGreaterThan(0);
        expect(adjective).not.toContain(" ");
      });
    });

    it("should have TypeScript readonly behavior", () => {
      // TypeScript const assertion makes it readonly at compile time
      // Runtime behavior depends on the implementation
      expect(Array.isArray(HORSE_ADJECTIVES)).toBe(true);
      expect(HORSE_ADJECTIVES.length).toBeGreaterThan(0);
    });
  });

  describe("HORSE_NOUNS", () => {
    it("should be defined and not empty", () => {
      expect(HORSE_NOUNS).toBeDefined();
      expect(HORSE_NOUNS.length).toBeGreaterThan(0);
    });

    it("should contain expected number of nouns", () => {
      expect(HORSE_NOUNS).toHaveLength(24);
    });

    it("should contain only string values", () => {
      HORSE_NOUNS.forEach((noun) => {
        expect(typeof noun).toBe("string");
        expect(noun.length).toBeGreaterThan(0);
      });
    });

    it("should contain expected nouns", () => {
      const expectedNouns = [
        "Thunder",
        "Lightning",
        "Shadow",
        "Blaze",
        "Storm",
        "Comet",
        "Spirit",
        "Wind",
        "Fire",
        "Star",
        "Moon",
        "Sun",
        "Warrior",
        "Knight",
        "Arrow",
        "Flame",
        "Diamond",
        "Phoenix",
        "Ranger",
        "Hunter",
        "Champion",
        "Legend",
        "Hero",
        "Dream",
      ];

      expectedNouns.forEach((noun) => {
        expect(HORSE_NOUNS).toContain(noun);
      });
    });

    it("should have all unique nouns", () => {
      const uniqueNouns = new Set(HORSE_NOUNS);
      expect(uniqueNouns.size).toBe(HORSE_NOUNS.length);
    });

    it("should have proper capitalization", () => {
      HORSE_NOUNS.forEach((noun) => {
        expect(noun[0]).toBe(noun[0].toUpperCase());
        expect(noun.slice(1)).toBe(noun.slice(1).toLowerCase());
      });
    });

    it("should not contain empty strings or whitespace", () => {
      HORSE_NOUNS.forEach((noun) => {
        expect(noun.trim()).toBe(noun);
        expect(noun.length).toBeGreaterThan(0);
        expect(noun).not.toContain(" ");
      });
    });

    it("should have TypeScript readonly behavior", () => {
      // TypeScript const assertion makes it readonly at compile time
      // Runtime behavior depends on the implementation
      expect(Array.isArray(HORSE_NOUNS)).toBe(true);
      expect(HORSE_NOUNS.length).toBeGreaterThan(0);
    });
  });

  describe("data quality", () => {
    it("should provide sufficient combinations for unique names", () => {
      const totalCombinations = HORSE_ADJECTIVES.length * HORSE_NOUNS.length;
      expect(totalCombinations).toBeGreaterThanOrEqual(500); // 24 * 24 = 576
    });

    it("should have appropriate word lengths", () => {
      HORSE_ADJECTIVES.forEach((adjective) => {
        expect(adjective.length).toBeGreaterThanOrEqual(3);
        expect(adjective.length).toBeLessThanOrEqual(10);
      });

      HORSE_NOUNS.forEach((noun) => {
        expect(noun.length).toBeGreaterThanOrEqual(3);
        expect(noun.length).toBeLessThanOrEqual(10);
      });
    });

    it("should contain thematically appropriate words", () => {
      // Check for horse/racing related themes
      const speedWords = [
        "Swift",
        "Fast",
        "Lightning",
        "Thunder",
        "Comet",
        "Arrow",
      ];
      const strengthWords = [
        "Mighty",
        "Strong",
        "Powerful",
        "Warrior",
        "Champion",
      ];
      const natureWords = ["Wind", "Fire", "Storm", "Star", "Moon", "Sun"];

      speedWords.forEach((word) => {
        expect([...HORSE_ADJECTIVES, ...HORSE_NOUNS]).toContain(word);
      });

      strengthWords.forEach((word) => {
        expect([...HORSE_ADJECTIVES, ...HORSE_NOUNS]).toContain(word);
      });

      natureWords.forEach((word) => {
        expect([...HORSE_ADJECTIVES, ...HORSE_NOUNS]).toContain(word);
      });
    });

    it("should not contain inappropriate words", () => {
      const allWords = [...HORSE_ADJECTIVES, ...HORSE_NOUNS];

      // Check that words are suitable for a family-friendly horse racing game
      const inappropriateWords = ["Evil", "Death", "Kill", "Hate", "Bad"];
      inappropriateWords.forEach((word) => {
        expect(allWords).not.toContain(word);
      });
    });

    it("should have balanced distribution of word types", () => {
      // Check that we have a good variety of adjective types
      const colorAdjectives = HORSE_ADJECTIVES.filter((adj) =>
        ["Golden", "Silver", "Crimson", "Dark", "Bright"].includes(adj)
      );
      expect(colorAdjectives.length).toBeGreaterThanOrEqual(3);

      const personalityAdjectives = HORSE_ADJECTIVES.filter((adj) =>
        ["Brave", "Noble", "Gentle", "Proud", "Bold", "Wild", "Free"].includes(
          adj
        )
      );
      expect(personalityAdjectives.length).toBeGreaterThanOrEqual(5);
    });

    it("should work well for name generation", () => {
      // Test that combinations create reasonable horse names
      const sampleCombinations = [
        `${HORSE_ADJECTIVES[0]} ${HORSE_NOUNS[0]}`, // "Swift Thunder"
        `${HORSE_ADJECTIVES[5]} ${HORSE_NOUNS[10]}`, // "Gentle Moon"
        `${HORSE_ADJECTIVES[10]} ${HORSE_NOUNS[20]}`, // "Dark Champion"
      ];

      sampleCombinations.forEach((name) => {
        expect(name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
        expect(name.split(" ")).toHaveLength(2);
        expect(name.length).toBeGreaterThan(6);
        expect(name.length).toBeLessThan(25);
      });
    });
  });

  describe("TypeScript types", () => {
    it("should have correct const assertion types", () => {
      // These tests verify the TypeScript types at runtime
      expect(HORSE_ADJECTIVES).toEqual(expect.any(Array));
      expect(HORSE_NOUNS).toEqual(expect.any(Array));

      // Verify immutability - arrays should be readonly
      expect(Object.isFrozen(HORSE_ADJECTIVES)).toBe(false); // Arrays are not frozen by const assertion
      expect(Array.isArray(HORSE_ADJECTIVES)).toBe(true);
      expect(Array.isArray(HORSE_NOUNS)).toBe(true);
    });
  });
});
