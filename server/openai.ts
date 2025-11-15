import OpenAI from "openai";

// This is using OpenAI's API, which points to OpenAI's API servers and requires your own API key.
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getDecisionRecommendation(input: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a thoughtful decision advisor. Analyze the user's decision and provide a clear recommendation with pros, cons, what matters most, and actionable next steps. Respond with JSON in this exact format:
{
  "recommendation": "A clear, concise recommendation (2-3 sentences)",
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "whatMatters": "The most important factor to consider (1-2 sentences)",
  "nextSteps": ["Action step 1", "Action step 2", "Action step 3"]
}`,
      },
      {
        role: "user",
        content: input,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function createPlan(input: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a realistic task planner. Create a practical, time-blocked schedule from the user's tasks and goals. Be realistic about time estimates and prioritize effectively. Respond with JSON in this exact format:
{
  "overview": "A brief summary of the plan approach (2-3 sentences)",
  "timeBlocks": [
    {
      "time": "9:00 AM - 10:30 AM",
      "task": "Task description",
      "duration": "1.5 hours"
    }
  ]
}
Include 4-8 time blocks. Use realistic time estimates. Consider breaks and transitions.`,
      },
      {
        role: "user",
        content: input,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function getAdvisoryGuidance(input: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a friendly, clear advisor. Explain concepts in plain language and provide supportive guidance. Respond with JSON in this exact format:
{
  "explanation": "A clear, friendly explanation with natural paragraph breaks using \\n\\n for separation (3-5 paragraphs)",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
  "guidance": "Friendly, supportive next steps or encouragement (2-3 sentences)"
}`,
      },
      {
        role: "user",
        content: input,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}
