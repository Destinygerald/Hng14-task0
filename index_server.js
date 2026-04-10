import express from "express";
import cors from "cors";
import { simpleGet } from "./controllers/index.js";

export const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

app.get("/api/classify", simpleGet);
