import dotenv from "dotenv";
dotenv.config();
import { restClient } from "@polygon.io/client-js";

const rest = restClient(process.env.POLYGON_API_KEY);

// Retrieve 10 random stock tickers from a pool of 1000 for a given exchange
export const getRandomTickersFromExchange = async (
  exchange: string
): Promise<string[]> => {
  try {
    // Fetch up to 1000 tickers using the limit parameter and primary_exchange
    const response = await rest.reference.tickers({
      type: "CS", // Common stock
      market: "stocks", // Stock market
      primary_exchange: exchange, // Specify the exchange
      limit: 1000, // Maximum tickers to fetch
    });

    if (!response || !response.results || response.results.length === 0) {
      throw new Error(`No tickers found for exchange ${exchange}`);
    }

    console.log(`Total Tickers Retrieved: ${response.results.length}`);

    // Extract tickers from the results
    const tickers = response.results.map((result: any) => result.ticker);

    // Randomly select 10 tickers from the pool
    const selectedTickers: string[] = [];
    const tickersCopy = [...tickers]; // Copy array to avoid mutating the original

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * tickersCopy.length);
      selectedTickers.push(tickersCopy[randomIndex]);
      tickersCopy.splice(randomIndex, 1); // Remove selected ticker to avoid duplicates
    }

    return selectedTickers;
  } catch (error) {
    console.error("Error fetching tickers from exchange:", error);
    throw new Error("Failed to retrieve random tickers for the given exchange");
  }
};

// export const getRandomTickersBySicCode = async (
//   sicCode: string
// ): Promise<string[]> => {
//   try {
//     const response = await rest.reference.tickers({ sic_code: sicCode });
//     if (!response || !response.results || response.results.length === 0) {
//       throw new Error(`No tickers found for SIC code ${sicCode}`);
//     }

//     const tickers = response.results.map((tickers: any) => tickers.ticker);

//     // Shuffle the array to ensure randomness
//     for (let i = tickers.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [tickers[i], tickers[j]] = [tickers[j], tickers[i]];
//     }

//     // Return the first 10 from the shuffled array
//     return tickers.slice(0, 10);
//   } catch (error) {
//     console.error("Error fetching tickers by SIC code:", error);
//     throw new Error("Failed to retrieve random tickers for the given SIC code");
//   }
// };

export const getTickersBySicCode = async (
  sicCode: string
): Promise<string[]> => {
  try {
    const response = await rest.reference.tickers({ sic_code: sicCode });
    if (!response || !response.results || response.results.length === 0) {
      throw new Error(`No tickers found for SIC code ${sicCode}`);
    }

    // Extract the first 10 tickers
    const tickers = response.results
      .slice(0, 10)
      .map((result: any) => result.ticker);
    return tickers;
  } catch (error) {
    console.error("Error fetching tickers by SIC code:", error);
    throw new Error("Failed to retrieve tickers for the given SIC code");
  }
};

//Retrieve SIC code for a chosen stock ticker
export const getSicCode = async (ticker: string) => {
  try {
    const response = await rest.reference.tickerDetails(ticker);
    if (!response || !response.results || !response.results.sic_code) {
      throw new Error(`SIC code not found for ${ticker}`);
    }
    return response.results.sic_code;
  } catch (error) {
    throw error;
  }
};
