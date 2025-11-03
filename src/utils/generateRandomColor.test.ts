import { describe, it, expect, vi } from "vitest";
import { generateRandomColor } from "./generateRandomColor";

describe("generateRandomColor", () => {
  describe("format validation", () => {
    it("returns a valid hex color format", () => {
      const color = generateRandomColor();
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("always starts with #", () => {
      const color = generateRandomColor();
      expect(color).toMatch(/^#/);
    });

    it("is exactly 7 characters long", () => {
      const color = generateRandomColor();
      expect(color).toHaveLength(7);
    });

    it("contains only valid hex characters", () => {
      const color = generateRandomColor();
      const hexPattern = /^#[0-9A-F]{6}$/i;
      expect(hexPattern.test(color)).toBe(true);
    });
  });

  describe("randomness", () => {
    it("generates different colors on multiple calls", () => {
      const colors = Array.from({ length: 20 }, () => generateRandomColor());
      const uniqueColors = new Set(colors);

      // With 20 random colors, we should have multiple unique values
      // (probability of all being the same is extremely low)
      expect(uniqueColors.size).toBeGreaterThan(1);
    });

    it("can generate a wide range of colors", () => {
      const colors = Array.from({ length: 100 }, () => generateRandomColor());
      const uniqueColors = new Set(colors);

      // With 100 colors, we should have significant variety
      expect(uniqueColors.size).toBeGreaterThan(50);
    });
  });

  describe("specific color examples", () => {
    it("can generate valid color examples", () => {
      // Mock Math.random to generate specific colors
      const mockRandom = vi.spyOn(Math, "random");

      // Generate #000000 (all zeros)
      mockRandom.mockReturnValue(0);
      expect(generateRandomColor()).toBe("#000000");

      // Generate #FFFFFF (all F's) - Math.random returns values < 1
      mockRandom.mockReturnValue(0.9999);
      expect(generateRandomColor()).toBe("#FFFFFF");

      // Generate #888888 (middle values)
      mockRandom.mockReturnValue(0.5);
      expect(generateRandomColor()).toBe("#888888");

      mockRandom.mockRestore();
    });
  });

  describe("edge cases", () => {
    it("handles Math.random edge cases", () => {
      const mockRandom = vi.spyOn(Math, "random");

      // Test with minimum possible value (0)
      mockRandom.mockReturnValue(0);
      const minColor = generateRandomColor();
      expect(minColor).toBe("#000000");

      // Test with value close to 1 (but less than 1)
      mockRandom.mockReturnValue(0.99999999);
      const maxColor = generateRandomColor();
      expect(maxColor).toMatch(/^#[0-9A-F]{6}$/i);

      mockRandom.mockRestore();
    });

    it("generates consistent format regardless of random values", () => {
      const mockRandom = vi.spyOn(Math, "random");

      // Test various random values
      const testValues = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.999];

      testValues.forEach((value) => {
        mockRandom.mockReturnValue(value);
        const color = generateRandomColor();
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
        expect(color).toHaveLength(7);
      });

      mockRandom.mockRestore();
    });
  });

  describe("performance and reliability", () => {
    it("generates colors quickly and reliably", () => {
      const startTime = performance.now();

      // Generate many colors
      for (let i = 0; i < 1000; i++) {
        const color = generateRandomColor();
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete quickly (less than 100ms for 1000 colors)
      expect(duration).toBeLessThan(100);
    });

    it("never returns invalid colors", () => {
      // Generate many colors and verify all are valid
      for (let i = 0; i < 100; i++) {
        const color = generateRandomColor();
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
        expect(color).toHaveLength(7);
        expect(color.charAt(0)).toBe("#");
      }
    });
  });

  describe("character distribution", () => {
    it("uses all valid hex characters over many generations", () => {
      const colors = Array.from({ length: 500 }, () => generateRandomColor());
      const allCharacters = colors.join("").replace(/#/g, "");

      // Check if we've used most hex characters (0-9, A-F)
      const usedChars = new Set(allCharacters.toUpperCase());

      // We should see most hex characters in 500 random colors
      expect(usedChars.size).toBeGreaterThan(10);
    });
  });
});
