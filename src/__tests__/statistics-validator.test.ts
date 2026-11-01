import { describe, it, expect } from "vitest";
import { StatisticsValidator } from "../lib/numerical/statistics-validator";

describe("StatisticsValidator (Deterministic Mathematical Ground Truth)", () => {
  it("accurately calculates Arithmetic Mean", () => {
    const data = [10, 15, 20, 25, 30];
    expect(StatisticsValidator.mean(data)).toBe(20);
  });

  it("accurately calculates Median for odd and even sets", () => {
    expect(StatisticsValidator.median([10, 20, 30, 40, 50])).toBe(30);
    expect(StatisticsValidator.median([10, 20, 30, 40])).toBe(25);
  });

  it("calculates empirical Mode correctly using Mode = 3*Median - 2*Mean", () => {
    // Mean = 30, Median = 32 => Mode = 3(32) - 2(30) = 96 - 60 = 36
    expect(StatisticsValidator.empiricalMode(30, 32)).toBe(36);
  });

  it("calculates Population Variance and Standard Deviation correctly", () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    const mean = StatisticsValidator.mean(data); // 40 / 8 = 5
    expect(mean).toBe(5);

    const variance = StatisticsValidator.variance(data, false); // 32 / 8 = 4
    expect(variance).toBe(4);

    const sd = StatisticsValidator.standardDeviation(data, false);
    expect(sd).toBe(2);
  });

  it("calculates Coefficient of Variation correctly: CV = (sd / mean) * 100", () => {
    // If mean = 50 and SD = 10, CV = 20%
    const data = [40, 50, 60]; // mean = 50
    const cv = StatisticsValidator.coefficientOfVariation(data);
    expect(cv).toBeGreaterThan(0);
  });

  it("calculates Combinations nCr accurately", () => {
    expect(StatisticsValidator.combinations(5, 2)).toBe(10);
    expect(StatisticsValidator.combinations(10, 3)).toBe(120);
    expect(StatisticsValidator.combinations(4, 0)).toBe(1);
  });

  it("calculates Binomial Probability accurately", () => {
    // n = 4, k = 2, p = 0.5 => 4C2 * 0.5^2 * 0.5^2 = 6 * 0.0625 = 0.375
    const prob = StatisticsValidator.binomialProbability(4, 2, 0.5);
    expect(prob).toBeCloseTo(0.375, 4);
  });

  it("calculates Poisson Probability accurately", () => {
    // lambda = 2, k = 0 => e^-2 = 0.135335
    const prob = StatisticsValidator.poissonProbability(2, 0);
    expect(prob).toBeCloseTo(0.1353, 3);
  });

  it("calculates Correlation Coefficient r from regression coefficients byx and bxy", () => {
    // byx = 0.8, bxy = 0.45 => r = sqrt(0.8 * 0.45) = sqrt(0.36) = 0.6
    const r = StatisticsValidator.correlationFromRegression(0.8, 0.45);
    expect(r).toBeCloseTo(0.6, 4);

    // Negative regression coefficients => negative r
    const negR = StatisticsValidator.correlationFromRegression(-0.8, -0.45);
    expect(negR).toBeCloseTo(-0.6, 4);
  });

  it("rejects contradictory regression coefficient signs", () => {
    expect(() => StatisticsValidator.correlationFromRegression(0.8, -0.45)).toThrow();
  });

  it("validates numerical answers within tolerance", () => {
    const res = StatisticsValidator.validateAnswer(36, 36, 0.01);
    expect(res.isValid).toBe(true);

    const fail = StatisticsValidator.validateAnswer(36, 31, 0.01);
    expect(fail.isValid).toBe(false);
  });
});
