import { z } from "zod";

export type AIMode = "decisions" | "planner" | "advisor";

export const aiRequestSchema = z.object({
  mode: z.enum(["decisions", "planner", "advisor"]),
  input: z.string().min(1, "Please enter your question or task"),
});

export type AIRequest = z.infer<typeof aiRequestSchema>;

export interface DecisionResponse {
  recommendation: string;
  pros: string[];
  cons: string[];
  whatMatters: string;
  nextSteps: string[];
}

export interface PlannerResponse {
  timeBlocks: {
    time: string;
    task: string;
    duration: string;
  }[];
  overview: string;
}

export interface AdvisorResponse {
  explanation: string;
  keyPoints: string[];
  guidance: string;
}

export type AIResponse = DecisionResponse | PlannerResponse | AdvisorResponse;
