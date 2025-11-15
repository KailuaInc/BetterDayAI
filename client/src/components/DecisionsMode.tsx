import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Lightbulb, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DecisionResponse } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export function DecisionsMode() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<DecisionResponse | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const result = await apiRequest("POST", "/api/ai/decisions", { input: text });
      return result as DecisionResponse;
    },
    onSuccess: (data) => {
      setResponse(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get recommendation",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (input.trim()) {
      mutation.mutate(input);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea
          data-testid="input-decision"
          placeholder="Describe your decision... (e.g., Should I switch careers? Should I buy a house now or wait?)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-32 text-base resize-none focus-visible:ring-2 focus-visible:ring-primary"
          disabled={mutation.isPending}
        />
        <Button
          data-testid="button-get-recommendation"
          onClick={handleSubmit}
          disabled={!input.trim() || mutation.isPending}
          className="w-full md:w-auto md:min-w-[200px]"
          size="lg"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Get Recommendation
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card data-testid="card-recommendation">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed" data-testid="text-recommendation">
                  {response.recommendation}
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card data-testid="card-pros">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {response.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2" data-testid={`text-pro-${index}`}>
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card data-testid="card-cons">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {response.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2" data-testid={`text-con-${index}`}>
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/30 bg-primary/5" data-testid="card-what-matters">
              <CardHeader>
                <CardTitle className="text-lg">What Matters Most</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed font-medium" data-testid="text-what-matters">
                  {response.whatMatters}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-next-steps">
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {response.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`text-step-${index}`}>
                      <Badge className="mt-0.5 flex-shrink-0">{index + 1}</Badge>
                      <span className="text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
