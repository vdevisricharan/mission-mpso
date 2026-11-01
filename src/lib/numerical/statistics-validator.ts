/**
 * Deterministic Numerical Statistics Validator for MISSION MPSO
 * Validates quantitative questions and answers against mathematical ground truth.
 */

export interface ValidationResult {
  isValid: boolean;
  expectedValue: number | string;
  calculatedValue: number | string;
  errorMargin?: number;
  explanationTe: string;
  stepsTe: string[];
}

export class StatisticsValidator {
  /**
   * Calculate Arithmetic Mean of numbers
   */
  static mean(numbers: number[]): number {
    if (!numbers || numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return sum / numbers.length;
  }

  /**
   * Calculate Median
   */
  static median(numbers: number[]): number {
    if (!numbers || numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
  }

  /**
   * Calculate Population Variance
   */
  static variance(numbers: number[], isSample: boolean = false): number {
    if (!numbers || numbers.length <= 1) return 0;
    const m = this.mean(numbers);
    const sumSqDiff = numbers.reduce((acc, val) => acc + Math.pow(val - m, 2), 0);
    const divisor = isSample ? numbers.length - 1 : numbers.length;
    return sumSqDiff / divisor;
  }

  /**
   * Calculate Standard Deviation
   */
  static standardDeviation(numbers: number[], isSample: boolean = false): number {
    return Math.sqrt(this.variance(numbers, isSample));
  }

  /**
   * Calculate Coefficient of Variation (CV = (sigma / mean) * 100)
   */
  static coefficientOfVariation(numbers: number[]): number {
    const m = this.mean(numbers);
    if (m === 0) return 0;
    const sd = this.standardDeviation(numbers, false);
    return (sd / m) * 100;
  }

  /**
   * Empirical Mode: Mode = 3*Median - 2*Mean
   */
  static empiricalMode(mean: number, median: number): number {
    return 3 * median - 2 * mean;
  }

  /**
   * Factorial calculation
   */
  static factorial(n: number): number {
    if (n < 0) return 0;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  /**
   * Combinations nCr = n! / (r! * (n-r)!)
   */
  static combinations(n: number, r: number): number {
    if (r < 0 || r > n) return 0;
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  }

  /**
   * Binomial probability: P(X = k) = nCk * p^k * (1-p)^(n-k)
   */
  static binomialProbability(n: number, k: number, p: number): number {
    const comb = this.combinations(n, k);
    const q = 1 - p;
    return comb * Math.pow(p, k) * Math.pow(q, n - k);
  }

  /**
   * Poisson probability: P(X = k) = (e^-lambda * lambda^k) / k!
   */
  static poissonProbability(lambda: number, k: number): number {
    return (Math.exp(-lambda) * Math.pow(lambda, k)) / this.factorial(k);
  }

  /**
   * Correlation coefficient from regression coefficients: r = sign * sqrt(byx * bxy)
   */
  static correlationFromRegression(byx: number, bxy: number): number {
    if ((byx > 0 && bxy < 0) || (byx < 0 && bxy > 0)) {
      throw new Error("Both regression coefficients must have the same algebraic sign.");
    }
    const product = byx * bxy;
    if (product > 1.00001) {
      throw new Error("Product of regression coefficients byx * bxy (r^2) cannot exceed 1.");
    }
    const sign = byx >= 0 ? 1 : -1;
    return sign * Math.sqrt(Math.abs(product));
  }

  /**
   * Fisher's Ideal Index: sqrt(Laspeyres * Paasche)
   */
  static fisherIndex(laspeyres: number, paasche: number): number {
    return Math.sqrt(laspeyres * paasche);
  }

  /**
   * Validate a question's numerical option against deterministic expectation
   */
  static validateAnswer(
    calculated: number,
    candidateAnswer: number | string,
    tolerance: number = 0.05
  ): ValidationResult {
    const numericAns = typeof candidateAnswer === "number" ? candidateAnswer : parseFloat(candidateAnswer);
    const diff = Math.abs(calculated - numericAns);
    const isValid = diff <= tolerance;

    return {
      isValid,
      expectedValue: Number(calculated.toFixed(4)),
      calculatedValue: numericAns,
      errorMargin: diff,
      explanationTe: isValid
        ? `గణన సరిగ్గా ధృవీకరించబడింది. అంచనా విలువ: ${calculated.toFixed(4)}, ఎంపిక విలువ: ${numericAns}`
        : `గణనలో తేడా ఉంది! సూత్రం ప్రకారం రావాల్సిన విలువ: ${calculated.toFixed(4)}, కానీ ఎంపిక చేసిన విలువ: ${numericAns}`,
      stepsTe: [
        `సూత్రం ప్రకారం ఖచ్చితమైన విలువ: ${calculated.toFixed(4)}`,
        `అంగీకార పరిమితి (Tolerance): ±${tolerance}`,
        `వాస్తవ తేడా: ${diff.toFixed(4)}`,
      ],
    };
  }
}
