// client/src/hooks/useAdvisor.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Call the Advisor API and return the advice text.
 */
export async function getAdvice(input: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/advisor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch advice (${response.status})`);
  }

  const data = await response.json();

  // Try several possible response shapes, just in case
  const text =
    data.response ??
    data.answer ??
    data.text ??
    data.message ??
    data.data ??
    "";

  return text as string;
}
