import express from "express";
import cors from "cors";
import { getRandomTickersController } from "./controllers/poly-api-tickers-controller";
import { getAggregatePriceTickerController } from "./controllers/poly-api-aggregates-controller";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/stock/random/:exchange", getRandomTickersController);
app.get("/api/stock/aggregates/prices/", getAggregatePriceTickerController);

("https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/2024-11-14/2024-11-15?adjusted=false&sort=asc");

export default app;
