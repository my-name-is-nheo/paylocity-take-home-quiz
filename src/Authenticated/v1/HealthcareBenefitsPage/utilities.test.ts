import { isEligibleForDiscount } from "./utilities";

describe("isEligibleForDiscount", () => {
  it('returns true for first names starting with "a"', () => {
    expect(isEligibleForDiscount("Alice")).toBe(true);
    expect(isEligibleForDiscount("Anna")).toBe(true);
  });

  it('returns false for first names not starting with "a"', () => {
    expect(isEligibleForDiscount("Bob")).toBe(false);
    expect(isEligibleForDiscount("Charlie")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isEligibleForDiscount("aBcDe")).toBe(true);
    expect(isEligibleForDiscount("AcE")).toBe(true);
    expect(isEligibleForDiscount("zYxW")).toBe(false);
  });

  it("handles empty string", () => {
    expect(isEligibleForDiscount("")).toBe(false);
  });

  // Add more test cases as needed
});
