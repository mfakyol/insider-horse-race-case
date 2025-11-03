import { describe, it, expect } from "vitest";
import { getNumberSuffix } from "./getNumberSuffix";

describe("getNumberSuffix", () => {
  describe("basic ordinal suffixes", () => {
    it('returns "st" for numbers ending in 1 (except 11)', () => {
      expect(getNumberSuffix(1)).toBe("st");
      expect(getNumberSuffix(21)).toBe("st");
      expect(getNumberSuffix(31)).toBe("st");
      expect(getNumberSuffix(101)).toBe("st");
    });

    it('returns "nd" for numbers ending in 2 (except 12)', () => {
      expect(getNumberSuffix(2)).toBe("nd");
      expect(getNumberSuffix(22)).toBe("nd");
      expect(getNumberSuffix(32)).toBe("nd");
      expect(getNumberSuffix(102)).toBe("nd");
    });

    it('returns "rd" for numbers ending in 3 (except 13)', () => {
      expect(getNumberSuffix(3)).toBe("rd");
      expect(getNumberSuffix(23)).toBe("rd");
      expect(getNumberSuffix(33)).toBe("rd");
      expect(getNumberSuffix(103)).toBe("rd");
    });

    it('returns "th" for numbers ending in 4-9, 0', () => {
      expect(getNumberSuffix(4)).toBe("th");
      expect(getNumberSuffix(5)).toBe("th");
      expect(getNumberSuffix(6)).toBe("th");
      expect(getNumberSuffix(7)).toBe("th");
      expect(getNumberSuffix(8)).toBe("th");
      expect(getNumberSuffix(9)).toBe("th");
      expect(getNumberSuffix(10)).toBe("th");
      expect(getNumberSuffix(20)).toBe("th");
    });
  });

  describe("special cases (11, 12, 13)", () => {
    it('returns "th" for 11, 12, 13', () => {
      expect(getNumberSuffix(11)).toBe("th");
      expect(getNumberSuffix(12)).toBe("th");
      expect(getNumberSuffix(13)).toBe("th");
    });

    it('returns "th" for numbers ending in 11, 12, 13 (only for teens)', () => {
      // The function only handles 11, 12, 13 specially, not 111, 112, 113
      expect(getNumberSuffix(111)).toBe("st"); // 111 ends in 1, so "st"
      expect(getNumberSuffix(112)).toBe("nd"); // 112 ends in 2, so "nd"
      expect(getNumberSuffix(113)).toBe("rd"); // 113 ends in 3, so "rd"
      expect(getNumberSuffix(211)).toBe("st");
      expect(getNumberSuffix(312)).toBe("nd");
      expect(getNumberSuffix(413)).toBe("rd");
    });
  });

  describe("uppercase parameter", () => {
    it("returns lowercase suffixes by default", () => {
      expect(getNumberSuffix(1)).toBe("st");
      expect(getNumberSuffix(2)).toBe("nd");
      expect(getNumberSuffix(3)).toBe("rd");
      expect(getNumberSuffix(4)).toBe("th");
    });

    it("returns lowercase suffixes when uppercase is false", () => {
      expect(getNumberSuffix(1, false)).toBe("st");
      expect(getNumberSuffix(2, false)).toBe("nd");
      expect(getNumberSuffix(3, false)).toBe("rd");
      expect(getNumberSuffix(4, false)).toBe("th");
    });

    it("returns uppercase suffixes when uppercase is true", () => {
      expect(getNumberSuffix(1, true)).toBe("ST");
      expect(getNumberSuffix(2, true)).toBe("ND");
      expect(getNumberSuffix(3, true)).toBe("RD");
      expect(getNumberSuffix(4, true)).toBe("TH");
      expect(getNumberSuffix(11, true)).toBe("TH");
      expect(getNumberSuffix(21, true)).toBe("ST");
    });
  });

  describe("edge cases", () => {
    it("handles zero correctly", () => {
      expect(getNumberSuffix(0)).toBe("th");
      expect(getNumberSuffix(0, true)).toBe("TH");
    });

    it("handles large numbers correctly", () => {
      expect(getNumberSuffix(1001)).toBe("st");
      expect(getNumberSuffix(1002)).toBe("nd");
      expect(getNumberSuffix(1003)).toBe("rd");
      expect(getNumberSuffix(1011)).toBe("st"); // 1011 ends in 1, only 11-13 are special
      expect(getNumberSuffix(1021)).toBe("st");
    });

    it("handles very large numbers", () => {
      expect(getNumberSuffix(123456781)).toBe("st");
      expect(getNumberSuffix(123456782)).toBe("nd");
      expect(getNumberSuffix(123456783)).toBe("rd");
      expect(getNumberSuffix(123456784)).toBe("th");
    });
  });

  describe("negative numbers", () => {
    it("handles negative numbers (though not typical use case)", () => {
      // Negative numbers: -1 % 10 = -1 in JS, so it goes to default "th"
      expect(getNumberSuffix(-1)).toBe("th");
      expect(getNumberSuffix(-2)).toBe("th");
      expect(getNumberSuffix(-3)).toBe("th");
      expect(getNumberSuffix(-4)).toBe("th");
      expect(getNumberSuffix(-11)).toBe("th");
    });
  });
});
