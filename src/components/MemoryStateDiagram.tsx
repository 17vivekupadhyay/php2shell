"use client";

import { motion } from "framer-motion";
import { Database, CircleCheck, Zap, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: Database, label: "Allocate memory" },
  { icon: CircleCheck, label: "Mark “ready”" },
  { icon: Zap, label: "OOM interrupts" },
  { icon: AlertOctagon, label: "Stale state reused" },
];

/**
 * A small abstract visualization of the shared root-cause pattern behind
 * both CVEs — purely conceptual (generic allocate/mark/interrupt/reuse
 * states), not a reproduction of the actual exploit or source code.
 */
export function MemoryStateDiagram({
  active,
  accentColor,
  runKey,
}: {
  active: boolean;
  accentColor: string;
  runKey: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-1 overflow-x-auto py-2">
      {STEPS.map((step, i) => {
        const isInterrupt = i === 2;
        return (
          <div key={`${step.label}-${runKey}`} className="flex shrink-0 items-center gap-1">
            <div className="flex w-[4.5rem] flex-col items-center gap-1.5 sm:w-20">
              <motion.div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  isInterrupt ? "border-red-500/70" : "border-border"
                )}
                style={!isInterrupt && active ? { borderColor: accentColor } : undefined}
                animate={
                  active
                    ? { scale: [1, isInterrupt ? 1.3 : 1.08, 1], opacity: [0.6, 1, 0.6] }
                    : { scale: 1, opacity: 1 }
                }
                transition={{
                  duration: 0.5,
                  delay: i * 0.45,
                  repeat: active ? Infinity : 0,
                  repeatDelay: STEPS.length * 0.45,
                }}
              >
                <step.icon className={cn("h-4 w-4", isInterrupt ? "text-red-400" : "text-muted-foreground")} />
              </motion.div>
              <span className="text-center text-[10px] leading-tight text-muted-foreground">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="h-px w-4 shrink-0 bg-border sm:w-6" />}
          </div>
        );
      })}
    </div>
  );
}
