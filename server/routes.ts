import { Router } from "express";
import { askOpenAI } from "./openai";

const router = Router();

function wrapPayload(text: string) {
  return {
    text,
    message: text,
    answer: text,
    data: text,
  };
}

// DECISIONS
router.post("/api/decisions", async (req, res) => {
  try {
    const { input } = req.body;

    const prompt =
      "You are BetterDay, a friendly life-decision assistant. Answer clearly and concisely.\n\nQuestion: " +
      input;

    const text = await askOpenAI(prompt);
    res.json(wrapPayload(text));
  } catch (err) {
    console.error("Error in /api/decisions", err);
    res.status(500).json({ error: "Failed to get decision." });
  }
});

// PLANNER
router.post("/api/planner", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt =
      "You are BetterDay, a planning assistant. Create a short numbered plan.\n\nRequest: " +
      question;

    const text = await askOpenAI(prompt);
    res.json(wrapPayload(text));
  } catch (err) {
    console.error("Error in /api/planner", err);
    res.status(500).json({ error: "Failed to get plan." });
  }
});

// ADVISOR
router.post("/api/advisor", async (req, res) => {
  try {
    const { input } = req.body;

    const prompt =
      "You are BetterDay, a friendly life advisor. Give practical, concise guidance.\n\nQuestion: " +
      input;

    const text = await askOpenAI(prompt);
    res.json(wrapPayload(text));
  } catch (err) {
    console.error("Error in /api/advisor", err);
    res.status(500).json({ error: "Failed to get advisor response." });
  }
});

export default router;
