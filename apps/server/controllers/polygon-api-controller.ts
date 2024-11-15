import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { getStockData } from "../utils/polygon-api";

export const getAPIdataController = async (
  req: ExpressRequest,
  res: ExpressResponse
): Promise<void> => {
  const { ticker } = req.params;

  try {
    const data = await getStockData(ticker);
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Error fetching data from Polygon.io",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred",
      });
    }
  }
};
