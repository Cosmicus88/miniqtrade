import express from "express";
import cors from "cors";
import { getRandomTickersController } from "./controllers/poly-api-tickers-controller";
import { getAggregatePriceTickerController } from "./controllers/poly-api-aggregates-controller";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/stock/random/:exchange", getRandomTickersController);
app.get("/api/stock/aggregates/prices", getAggregatePriceTickerController);

export default app;
