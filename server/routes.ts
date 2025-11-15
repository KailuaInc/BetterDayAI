import type { Express } from "express";
import { createServer, type Server } from "http";
import { aiRequestSchema } from "@shared/schema";
import { getDecisionRecommendation, createPlan, getAdvisoryGuidance } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // BetterDay Decisions endpoint
  app.post("/api/ai/decisions", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== "string" || input.trim().length === 0) {
        return res.status(400).json({ error: "Please enter your question or task" });
      }

      const response = await getDecisionRecommendation(input);
      res.json(response);
    } catch (error: any) {
      console.error("Error in decisions endpoint:", error);
      if (error?.status === 429 || error?.code === 'insufficient_quota') {
        return res.status(429).json({ error: "OpenAI API quota exceeded. Please check your API key billing and quota at platform.openai.com" });
      }
      res.status(500).json({ error: "Failed to get recommendation. Please try again." });
    }
  });

  // BetterDay Planner endpoint
  app.post("/api/ai/planner", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== "string" || input.trim().length === 0) {
        return res.status(400).json({ error: "Please enter your tasks and goals" });
      }

      const response = await createPlan(input);
      res.json(response);
    } catch (error: any) {
      console.error("Error in planner endpoint:", error);
      if (error?.status === 429 || error?.code === 'insufficient_quota') {
        return res.status(429).json({ error: "OpenAI API quota exceeded. Please check your API key billing and quota at platform.openai.com" });
      }
      res.status(500).json({ error: "Failed to create plan. Please try again." });
    }
  });

  // BetterDay Advisor endpoint
  app.post("/api/ai/advisor", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== "string" || input.trim().length === 0) {
        return res.status(400).json({ error: "Please enter your question" });
      }

      const response = await getAdvisoryGuidance(input);
      res.json(response);
    } catch (error: any) {
      console.error("Error in advisor endpoint:", error);
      if (error?.status === 429 || error?.code === 'insufficient_quota') {
        return res.status(429).json({ error: "OpenAI API quota exceeded. Please check your API key billing and quota at platform.openai.com" });
      }
      res.status(500).json({ error: "Failed to get guidance. Please try again." });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
