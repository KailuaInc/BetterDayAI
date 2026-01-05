export async function getDecision(input: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

  const response = await fetch(`${baseUrl}/decisions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch decision");
  }

  const data = await response.json();
  return data.result as string;
}
