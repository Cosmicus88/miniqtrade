import dotenv from "dotenv";
dotenv.config();
import { restClient } from "@polygon.io/client-js";

const rest = restClient(process.env.POLYGON_API_KEY);

interface PolygonTicker {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik: string;
  composite_figi: string;
  share_class_figi: string;
  last_updated_utc: string;
}

interface Ticker {
  ticker: string;
  name: string;
  type: string;
  market: string;
}

// Retrieve 10 random stock tickers from a pool of 1000 for a given exchange
export const getRandomTickersFromExchange = async (
  exchange: string
): Promise<Ticker[]> => {
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
    console.log({ results: JSON.stringify(response.results) });

    const rawTickers = response.results as PolygonTicker[];

    // Extract tickers from the results
    const tickers: Ticker[] = rawTickers.map((rawTicker) => ({
      ticker: rawTicker.ticker,
      name: rawTicker.name,
      type: rawTicker.type,
      market: rawTicker.market,
    }));

    // Randomly select 10 tickers from the pool

    return pick10RandomTickers(tickers);
  } catch (error) {
    console.error("Error fetching tickers from exchange:", error);
    throw new Error("Failed to retrieve random tickers for the given exchange");
  }
};

function pick10RandomTickers(tickers: Ticker[]): Ticker[] {
  const selectedTickers: Ticker[] = [];
  const tickersCopy = [...tickers]; // Copy array to avoid mutating the original

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * tickersCopy.length);
    selectedTickers.push(tickersCopy[randomIndex]);
    tickersCopy.splice(randomIndex, 1); // Remove selected ticker to avoid duplicates
  }
  return selectedTickers;
}
