import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Calendar, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PlannerResponse } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export function PlannerMode() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<PlannerResponse | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const result = await apiRequest("POST", "/api/ai/planner", { input: text });
      return result as PlannerResponse;
    },
    onSuccess: (data) => {
      setResponse(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create plan",
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
          data-testid="input-tasks"
          placeholder="List your tasks and goals... (e.g., Write report, gym workout, call dentist, grocery shopping, study for exam)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-32 text-base resize-none focus-visible:ring-2 focus-visible:ring-primary"
          disabled={mutation.isPending}
        />
        <Button
          data-testid="button-create-plan"
          onClick={handleSubmit}
          disabled={!input.trim() || mutation.isPending}
          className="w-full md:w-auto md:min-w-[200px]"
          size="lg"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Planning...
            </>
          ) : (
            <>
              Create Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {mutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 md:p-6 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card data-testid="card-overview">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Plan Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed" data-testid="text-overview">
                  {response.overview}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Your Schedule</h3>
              <div className="space-y-3">
                {response.timeBlocks.map((block, index) => (
                  <Card
                    key={index}
                    className="hover-elevate transition-all"
                    data-testid={`card-timeblock-${index}`}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <Badge
                          variant="secondary"
                          className="w-fit flex items-center gap-1.5"
                          data-testid={`badge-time-${index}`}
                        >
                          <Clock className="h-3 w-3" />
                          {block.time}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium text-base" data-testid={`text-task-${index}`}>
                            {block.task}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="w-fit"
                          data-testid={`badge-duration-${index}`}
                        >
                          {block.duration}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
