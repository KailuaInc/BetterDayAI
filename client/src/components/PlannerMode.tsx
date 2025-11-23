import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";

type TimeBlock = {
  time: string;
  task: string;
  duration: string;
};

export type PlannerResponse = {
  overview: string;
  timeBlocks: TimeBlock[];
};

type PlannerModeProps = {
  response?: PlannerResponse;
};

const fallbackResponse: PlannerResponse = {
  overview: "Sample plan for debugging. Replace with real data.",
  timeBlocks: [
    { time: "9:00 AM", task: "Coffee & planning", duration: "30 min" },
    { time: "9:30 AM", task: "Deep work block", duration: "2 hours" },
    { time: "11:30 AM", task: "Walk / stretch", duration: "15 min" },
  ],
};

export function PlannerMode({ response }: PlannerModeProps) {
  const [plan, setPlan] = useState<PlannerResponse>(
    response ?? fallbackResponse,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response) return;

    async function loadPlan() {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
        const res = await fetch(`${API_BASE_URL}/api/plan`);

        if (!res.ok) return;
        const data = (await res.json()) as PlannerResponse;

        setPlan(data);
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [response]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{loading ? "Loading plan..." : plan.overview}</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Your Schedule</h3>

        <div className="space-y-3">
          {plan.timeBlocks.map((block, index) => (
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
                    <p
                      className="font-medium text-base"
                      data-testid={`text-task-${index}`}
                    >
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
    </div>
  );
}
