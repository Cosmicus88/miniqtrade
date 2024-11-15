import dotenv from "dotenv";
dotenv.config();
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

export async function getStockData(ticker: string) {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${POLYGON_API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from Polygon.io:", error);
    throw error;
  }
}
