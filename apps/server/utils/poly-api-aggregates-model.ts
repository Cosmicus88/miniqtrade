// import dotenv from "dotenv";
// dotenv.config();
// import { restClient } from "@polygon.io/client-js";

// const rest = restClient(process.env.POLYGON_API_KEY);

// export const getAggregatePriceTicker = async (
//   ticker: string,
//   multiplier: number,
//   timespan: string,
//   from: string,
//   to: string
// ): Promise<number[]> => {
//   try {
//     // Fetch aggregate data from the API
//     const response = await rest.stocks.aggregates(
//       ticker,
//       multiplier,
//       timespan,
//       from,
//       to
//     );

//     // Ensure the response is valid and has data
//     if (!response || !response.results || response.results.length === 0) {
//       throw new Error(`No data found for ticker ${ticker}`);
//     }

//     // Extract the "results" array from the response
//     const rawPrices = response.results;

//     // Map the closing prices (c) from the "results" array
//     const closingPrices: number[] = rawPrices
//       ? rawPrices.map((element: any) => element.c as number)
//       : [];

//     return closingPrices; // Return the array of closing prices
//   } catch (error) {
//     console.error("Error fetching aggregate prices for ticker:", error);
//     throw new Error("Failed to retrieve aggregate prices for the given ticker");
//   }
// };
import { restClient } from "@polygon.io/client-js"; // Assuming you use Polygon.io
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.POLYGON_API_KEY;
if (!apiKey) {
  throw new Error(
    "POLYGON_API_KEY is not defined in the environment variables"
  );
}

const rest = restClient(process.env.POLYGON_API_KEY);

export const getAggregatePriceTicker = async (
  ticker: string,
  multiplier: number,
  timespan: string,
  from: string,
  to: string
): Promise<{ t: number; c: number }[]> => {
  try {
    // Fetch aggregate data from Polygon.io API
    const response = await rest.stocks.aggregates(
      ticker,
      multiplier,
      timespan,
      from,
      to
    );

    if (!response || !response.results || response.results.length === 0) {
      throw new Error(`No data found for ticker ${ticker}`);
    }

    // Map the results to include only timestamp (t) and closing price (c)
    const formattedResults = response.results.map((result: any) => ({
      t: result.t, // Timestamp in milliseconds
      c: result.c, // Closing price
    }));

    return formattedResults;
  } catch (error) {
    console.error("Error in getAggregatePriceTicker model:", error);
    throw new Error("Failed to fetch aggregate prices from the Polygon.io API");
  }
};
