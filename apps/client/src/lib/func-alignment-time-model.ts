// src/utils/alignByTimestamps.ts

/**
 * Aligns two datasets by their shared timestamps.
 *
 * @param data1 - First dataset with timestamps and closing prices.
 * @param data2 - Second dataset with timestamps and closing prices.
 * @returns Object containing aligned closing prices for both datasets.
 */
export const alignByTimestamps = (
  data1: { t: number; c: number }[], // First dataset with timestamps and closing prices
  data2: { t: number; c: number }[] // Second dataset
) => {
  // Step 1: Extract timestamps into a Set for quick lookups
  const timestamps1 = new Set(data1.map((d) => d.t));
  const timestamps2 = new Set(data2.map((d) => d.t));

  // Step 2: Find the intersection of timestamps
  const sharedTimestamps = [...timestamps1].filter((t) => timestamps2.has(t));

  // Step 3: Filter both datasets to only include the shared timestamps
  const alignedData1 = data1.filter((d) => sharedTimestamps.includes(d.t));
  const alignedData2 = data2.filter((d) => sharedTimestamps.includes(d.t));

  // Step 4: Extract closing prices for aligned data
  const closingPrices1 = alignedData1.map((d) => d.c);
  const closingPrices2 = alignedData2.map((d) => d.c);

  return { closingPrices1, closingPrices2 };
};
