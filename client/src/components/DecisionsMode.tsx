import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DecisionResponse } from "@/shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export default function DecisionsMode() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<DecisionResponse | null>(null);
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/ai/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = (await res.json()) as DecisionResponse;
      return data;
    },

    onSuccess: (data) => {
      setResponse(data);
    },

    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!input.trim()) return;
    mutation.mutate(input);
  };

  const isLoading = mutation.isPending;

  return (
    <div className="space-y-6">
      {/* Input card */}
      <Card data-testid="card-input">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Decisions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Describe your decision..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="w-full"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Get Recommendation
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {/* Loading state */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thinking…</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyzing options…</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results state */}
        {response && !isLoading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {" "}
            {/* DEBUG: show raw response */}
            <pre className="col-span-2 text-xs whitespace-pre-wrap border p-2 rounded">
              {JSON.stringify(response, null, 2)}
            </pre>
            {/* Recommendation */}
            <Card data-testid="card-recommendation">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-base leading-relaxed font-medium"
                  data-testid="text-recommendation"
                >
                  {response.recommendation}
                </p>
              </CardContent>
            </Card>
            {/* What matters most */}
            <Card data-testid="card-what-matters">
              <CardHeader>
                <CardTitle className="text-lg">What Matters Most</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-sm leading-relaxed"
                  data-testid="text-what-matters"
                >
                  {response.whatMatters}
                </p>
              </CardContent>
            </Card>
            {/* Pros */}
            <Card data-testid="card-pros">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Pros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(response?.pros ?? []).map((pro: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-2"
                      data-testid={`text-pro-${index}`}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {/* Cons */}
            <Card data-testid="card-cons">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Cons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(response?.cons ?? []).map((con: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-2"
                      data-testid={`text-con-${index}`}
                    >
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {/* Next steps */}
            <Card data-testid="card-next-steps">
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {(response?.nextSteps ?? []).map(
                    (step: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3"
                        data-testid={`text-step-${index}`}
                      >
                        <Badge className="mt-0.5 flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-sm leading-relaxed">{step}</span>
                      </li>
                    ),
                  )}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
