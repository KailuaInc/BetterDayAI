// client/src/components/ui/AdvisorMode.tsx
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export default function AdvisorMode() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setAnswer("");

    try {
      const response = await fetch(`${API_BASE_URL}/advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch advice (${response.status})`);
      }

      const data = await response.json();

      const text =
        data.response ??
        data.answer ??
        data.text ??
        data.message ??
        data.data ??
        "";

      setAnswer(text || "I couldn’t come up with an answer.");
    } catch (err: any) {
      console.error("Error in AdvisorMode:", err);
      setError(err?.message || "Something went wrong while getting clarity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mode-root">
      <form onSubmit={handleSubmit} className="mode-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want advice on today?"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Get Clarity"}
        </button>
      </form>

      {error && <div className="mode-error">{error}</div>}

      {answer && !error && <div className="mode-result">{answer}</div>}
    </div>
  );
}
