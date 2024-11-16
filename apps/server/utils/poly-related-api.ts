import dotenv from "dotenv";
dotenv.config();
import { restClient } from "@polygon.io/client-js";

const rest = restClient(process.env.POLYGON_API_KEY);

//Retrieve 10 x Stock Ticker for a given Standard Industrial Classification (SIC) Code

export const getRandomTickersBySicCode = async (
  sicCode: string
): Promise<string[]> => {
  try {
    const response = await rest.reference.tickers({ sic_code: sicCode });
    if (!response || !response.results || response.results.length === 0) {
      throw new Error(`No tickers found for SIC code ${sicCode}`);
    }

    const tickers = response.results.map((result: any) => result.ticker);

    // Shuffle the array to ensure randomness
    for (let i = tickers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tickers[i], tickers[j]] = [tickers[j], tickers[i]];
    }

    // Return the first 10 from the shuffled array
    return tickers.slice(0, 10);
  } catch (error) {
    console.error("Error fetching tickers by SIC code:", error);
    throw new Error("Failed to retrieve random tickers for the given SIC code");
  }
};

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
