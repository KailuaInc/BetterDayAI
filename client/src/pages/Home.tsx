import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RisingSun } from "@/components/RisingSun";
import { DecisionsMode } from "@/components/DecisionsMode";
import { PlannerMode } from "@/components/PlannerMode";
import { AdvisorMode } from "@/components/AdvisorMode";
import { motion } from "framer-motion";
import type { AIMode } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState<AIMode>("decisions");

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            BetterDay
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            AI-powered guidance for your life's decisions, plans, and questions
          </p>
        </motion.div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AIMode)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6" data-testid="tabs-navigation">
            <TabsTrigger
              value="decisions"
              className="text-xs sm:text-sm"
              data-testid="tab-decisions"
            >
              Decisions
            </TabsTrigger>
            <TabsTrigger
              value="planner"
              className="text-xs sm:text-sm"
              data-testid="tab-planner"
            >
              Planner
            </TabsTrigger>
            <TabsTrigger
              value="advisor"
              className="text-xs sm:text-sm"
              data-testid="tab-advisor"
            >
              Advisor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="decisions" className="space-y-6">
            <RisingSun key="decisions-sun" />
            <DecisionsMode />
          </TabsContent>

          <TabsContent value="planner" className="space-y-6">
            <RisingSun key="planner-sun" />
            <PlannerMode />
          </TabsContent>

          <TabsContent value="advisor" className="space-y-6">
            <RisingSun key="advisor-sun" />
            <AdvisorMode />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
