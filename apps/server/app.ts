import express from "express";
import { getAPIdataController } from "./controllers/polygon-api-controller";
const app = express();

app.get("/api/stock/:ticker", getAPIdataController);

export default app;
