import { mean, standardDeviation } from "simple-statistics";

/**
 * Computes the Augmented Dickey-Fuller (ADF) test for stationarity of a time series (spread).
 * @param spread - The spread time series (array of residuals) to test.
 * @returns ADF test statistic, p-value, and stationarity result.
 */
export const adfTest = (spread: number[]) => {
  if (spread.length < 2) {
    throw new Error("The spread series must have at least two data points.");
  }

  const n = spread.length;

  // Step 1: Compute first differences (∆y_t = y_t - y_t-1)
  const firstDifferences = spread
    .slice(1)
    .map((value, index) => value - spread[index]);

  // Step 2: Create lagged series (y_t-1)
  const laggedSeries = spread.slice(0, -1); // Series shifted by one time point

  // Step 3: Perform regression to estimate φ (slope)
  const dependentVariable = firstDifferences; // ∆y_t
  const independentVariable = laggedSeries; // y_t-1

  // Compute the regression coefficients
  const meanLagged = mean(independentVariable);
  const meanDifferences = mean(dependentVariable);
  const numerator = dependentVariable.reduce(
    (sum, diff, i) =>
      sum + (independentVariable[i] - meanLagged) * (diff - meanDifferences),
    0
  );
  const denominator = independentVariable.reduce(
    (sum, lag) => sum + Math.pow(lag - meanLagged, 2),
    0
  );
  const phi = numerator / denominator; // Slope (φ coefficient)

  // Step 4: Calculate the residuals
  const residuals = dependentVariable.map(
    (diff, i) => diff - phi * independentVariable[i]
  );
  const residualStd = standardDeviation(residuals);

  // Step 5: Calculate ADF statistic (t-statistic for φ = 0)
  const tStatistic = phi / (residualStd / Math.sqrt(n - 1));

  // Step 6: Simplified p-value computation (use critical values table for precise results)
  const pValue = Math.exp(-Math.abs(tStatistic)); // Simplified estimation for small-scale use

  return {
    adfStatistic: tStatistic,
    pValue,
    isStationary: pValue < 0.05, // Null hypothesis: Non-stationary
  };
};
