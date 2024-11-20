import { Request, Response, NextFunction } from "express";
import { getAggregatePriceTicker } from "../utils/poly-api-aggregates-model";

export const getAggregatePriceTickerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ticker, multiplier, timespan, from, to } = req.body;

    // Validate required query parameters
    if (!ticker || !multiplier || !timespan || !from || !to) {
      res.status(400).json({
        error:
          "Missing required query parameters: ticker, multiplier, timespan, from, and to",
      });
      return;
    }

    // Call the model function with validated parameters
    const closingPrices = await getAggregatePriceTicker(
      ticker as string,
      parseInt(multiplier as string, 10),
      timespan as string,
      from as string,
      to as string
    );

    // Return the closing prices as the response
    res.status(200).json({
      ticker,
      closingPrices,
    });
  } catch (error) {
    console.error("Error in getAggregatePriceTickerController:", error);
    res.status(500).json({
      error: "Failed to retrieve aggregate prices. Please try again later.",
    });
  }
};
