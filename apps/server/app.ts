import express from "express";
import {
  getSicCodeController,
  getTickersBySicCodeController,
  getRandomTickersBySicCodeController,
} from "./controllers/polygon-api-controller";
const app = express();

app.get("/api/stock/:ticker", getSicCodeController);
app.get("/api/stock/sort/:sicCode", getTickersBySicCodeController);
app.get("/api/stock/random/:sicCode", getRandomTickersBySicCodeController);

export default app;
