import express from "express";
import cors from "cors";
import { getRandomTickersController } from "./controllers/polygon-api-controller";
const app = express();
app.use(cors());
app.use(express.json());

// app.get("/api/stock/:ticker", getSicCodeController);
// app.get("/api/stock/sort/:sicCode", getTickersBySicCodeController);
app.get("/api/stock/random/:exchange", getRandomTickersController);

export default app;
