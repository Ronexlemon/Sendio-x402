import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

const app: Application = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ---------- Health Check ---------- */
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------- Error Handler ---------- */
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
);

export default app;
