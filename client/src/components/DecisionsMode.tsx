import { useState } from "react";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

async function getDecision(input: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("Missing VITE_OPENAI_API_KEY");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are BetterDay, a friendly life-decision assistant. Answer clearly and concisely.",
        },
        {
          role: "user",
          content: input,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch decision");
  }

  const data = await response.json();
  const text =
    data.choices?.[0]?.message?.content ||
    data.choices?.[0]?.text ||
    data.message ||
    "";

  return text.trim();
}

export default function DecisionsMode() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer("");

    try {
      const result = await getDecision(input.trim());
      setAnswer(result || "I couldn't come up with an answer.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while getting a recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What decision are you trying to make today?"
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "0.75rem",
          fontSize: "1rem",
          borderRadius: 8,
          border: "1px solid #ddd",
          resize: "vertical",
        }}
      />
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Thinking..." : "Get Recommendation"}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: "1rem", color: "#e53935", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      {answer && !error && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: 8,
            border: "1px solid #eee",
            background: "#fafafa",
            whiteSpace: "pre-wrap",
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}
