export async function getPlan(input: string) {
  const API_BASE_URL = "/api";

  const response = await fetch(`${API_BASE_URL}/planner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: input }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch plan");
  }

  const data = await response.json();
  return data.answer || data.text || data.message || data.data || "";
}
