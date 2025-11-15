import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageCircle, Key, Heart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AdvisorResponse } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export function AdvisorMode() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<AdvisorResponse | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const result = await apiRequest("POST", "/api/ai/advisor", { input: text });
      return result as AdvisorResponse;
    },
    onSuccess: (data) => {
      setResponse(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get guidance",
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
          data-testid="input-question"
          placeholder="What would you like to understand? (e.g., How does compound interest work? What is imposter syndrome? How can I be more productive?)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-32 text-base resize-none focus-visible:ring-2 focus-visible:ring-primary"
          disabled={mutation.isPending}
        />
        <Button
          data-testid="button-get-clarity"
          onClick={handleSubmit}
          disabled={!input.trim() || mutation.isPending}
          className="w-full md:w-auto md:min-w-[200px]"
          size="lg"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              Get Clarity
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
            <Card data-testid="card-explanation">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {response.explanation.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed mb-4 last:mb-0" data-testid={`text-explanation-${index}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5" data-testid="card-key-points">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {response.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2" data-testid={`text-keypoint-${index}`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="card-guidance">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Friendly Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed" data-testid="text-guidance">
                  {response.guidance}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
