import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());

// all API routes mounted under /api
app.use("/api", routes);

export default app;
