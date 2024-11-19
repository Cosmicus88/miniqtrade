import { NextFunction, Request, Response } from "express";
import { getRandomTickersFromExchange } from "../utils/polygon-api-model";

export const getRandomTickersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { exchange } = req.params;

    if (!exchange) {
      res.status(400).json({ error: "Exchange is required" });
      return;
    }

    const tickers = await getRandomTickersFromExchange(exchange);

    res.status(200).json({
      exchange,
      tickers,
    });
  } catch (error) {
    console.error("Error fetching random tickers:", error);
    res.status(500).json({
      error: "Unable to retrieve random tickers. Please try again later.",
    });
  }
};

// export const getSicCodeController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { ticker } = req.params;

//     if (!ticker) {
//       res.status(400).json({ error: "Ticker is required" });
//     }

//     const sicCode = await getSicCode(ticker);
//     res.status(200).json({ ticker, sic_code: sicCode });
//   } catch (error) {
//     console.error("Error fetching SIC code:", error);
//     next(error);
//     res.status(500).json({
//       error: "Unable to retrieve SIC code. Please try again later.",
//     });
//   }
// };

// export const getTickersBySicCodeController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { sicCode } = req.params;

//     if (!sicCode) {
//       res.status(400).json({ error: "SIC code is required" });
//       return;
//     }

//     const tickers = await getTickersBySicCode(sicCode);
//     res.status(200).json({ sic_code: sicCode, tickers });
//   } catch (error) {
//     console.error("Error fetching tickers by SIC code:", error);
//     res
//       .status(500)
//       .json({ error: "Unable to retrieve tickers. Please try again later." });
//   }
// };
