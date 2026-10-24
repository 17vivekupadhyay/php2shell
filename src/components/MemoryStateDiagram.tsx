"use client";

import { motion } from "framer-motion";
import { CircleCheck, Zap, AlertOctagon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: CircleCheck, label: "Allocated, marked ready", caption: "PHP marks it usable before setup finishes" },
  { icon: Zap, label: "OOM interrupts initialization", caption: "A fatal hits exactly mid-setup", danger: true },
  { icon: AlertOctagon, label: "Unsafe state", caption: "Cleanup trusts the half-built value anyway" },
];

/**
 * A small abstract visualization of the shared root-cause pattern behind
 * both CVEs — purely conceptual (generic allocate/interrupt/unsafe-state
 * steps), not a reproduction of the actual exploit or source code.
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
    <div className="flex flex-col items-stretch gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
      {STEPS.map((step, i) => (
        <div key={`${step.label}-${runKey}`} className="flex items-center gap-2 sm:flex-1">
          <div className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2.5">
            <motion.div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
                step.danger ? "border-red-500/70" : "border-border"
              )}
              style={!step.danger && active ? { borderColor: accentColor } : undefined}
              animate={
                active
                  ? { scale: [1, step.danger ? 1.25 : 1.08, 1], opacity: [0.6, 1, 0.6] }
                  : { scale: 1, opacity: 1 }
              }
              transition={{
                duration: 0.5,
                delay: i * 0.55,
                repeat: active ? Infinity : 0,
                repeatDelay: STEPS.length * 0.55,
              }}
            >
              <step.icon className={cn("h-4 w-4", step.danger ? "text-red-400" : "text-muted-foreground")} />
            </motion.div>
            <div className="min-w-0">
              <div className={cn("text-xs font-semibold leading-tight", step.danger && "text-red-300")}>{step.label}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{step.caption}</div>
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <ArrowRight
              className="h-4 w-4 shrink-0 self-center text-muted-foreground sm:rotate-0 rotate-90"
              style={active ? { color: accentColor } : undefined}
            />
          )}
        </div>
      ))}
    </div>
  );
}
