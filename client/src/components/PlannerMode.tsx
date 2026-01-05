import { useState } from "react";
import { getPlan } from "../hooks/usePlanner";

export default function PlannerMode() {
  const [input, setInput] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPlan("");
    if (!input.trim()) return;

    setLoading(true);
    try {
      const result = await getPlan(input);
      setPlan(result);
    } catch (err) {
      console.error("Error in PlannerMode:", err);
      setError("Something went wrong while getting your plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mode-root">
      <form onSubmit={handleSubmit} className="mode-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you need a plan for today?"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Planning..." : "Get Plan"}
        </button>
      </form>

      {error && (
        <div className="mode-error">
          {error}
        </div>
      )}

      {plan && !error && (
        <div className="mode-result">
          {plan}
        </div>
      )}
    </div>
  );
}
