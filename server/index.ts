import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });
  app.get("/", (_req, res) => {
    res.send("BetterDay AI server is running 👍");
  });

  app.get("/api/plan", (_req, res) => {
    res.json({
      overview: "Here’s a focused plan for your day.",
      timeBlocks: [
        {
          time: "8:00 AM",
          task: "Wake-up + light stretch",
          duration: "15 min",
        },
        {
          time: "8:15 AM",
          task: "Coffee + review today’s top 3 priorities",
          duration: "20 min",
        },
        {
          time: "8:35 AM",
          task: "Deep work block (no phone, no email)",
          duration: "90 min",
        },
        {
          time: "10:05 AM",
          task: "Short walk / water break",
          duration: "10 min",
        },
        {
          time: "10:15 AM",
          task: "Follow-ups, email, and quick tasks",
          duration: "45 min",
        },
        {
          time: "11:00 AM",
          task: "Client / project work block",
          duration: "60 min",
        },
        {
          time: "12:00 PM",
          task: "Lunch away from screens",
          duration: "30–45 min",
        },
        {
          time: "1:00 PM",
          task: "Creative / strategic work (planning, writing, ideas)",
          duration: "60 min",
        },
        {
          time: "2:00 PM",
          task: "Admin + organizing (files, calendar, tasks)",
          duration: "30 min",
        },
        {
          time: "2:30 PM",
          task: "Wrap-up: review wins, set 3 priorities for tomorrow",
          duration: "20 min",
        },
      ],
    });
  });

  // importantly only setup vite in development and after

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
