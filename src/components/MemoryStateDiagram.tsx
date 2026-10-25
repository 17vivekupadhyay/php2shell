"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEP_MS = 1300;

const STEPS = [
  { label: "Memory allocated", detail: "A piece of request state is set aside", color: "var(--color-muted-foreground)" },
  { label: "Marked “ready” too early", detail: "Counted as usable before setup finishes", color: "var(--color-php)" },
  { label: "OOM interrupts initialization", detail: "A fatal hits in that exact window", color: "var(--color-critical)" },
  { label: "Cleanup trusts the unsafe state", detail: "The half-built value is used as real", color: "var(--color-vulnerable)" },
];

function MemoryStateDiagramInner({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [active]);

  const current = STEPS[step];
  const pct = (step / (STEPS.length - 1)) * 100;

  return (
    <div className="py-2">
      {/* rail with the morphing token */}
      <div className="relative mb-6 h-2">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-border" />
        <motion.div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: current.color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        {STEPS.map((s, i) => (
          <div
            key={s.label}
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background transition-colors duration-300"
            style={{ left: `${(i / (STEPS.length - 1)) * 100}%`, borderColor: i <= step ? current.color : "var(--color-border)" }}
          />
        ))}
        <motion.div
          className="absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-lg"
          style={{ borderColor: current.color, backgroundColor: current.color }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* step labels */}
      <div className="grid grid-cols-4 gap-1.5">
        {STEPS.map((s, i) => {
          const isCurrent = i === step;
          const isPast = i < step;
          return (
            <div key={s.label} className={cn("text-center transition-opacity", !isCurrent && !isPast && "opacity-40")}>
              <div
                className="text-[10px] font-semibold leading-tight"
                style={isCurrent ? { color: s.color } : undefined}
              >
                {s.label}
              </div>
              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-0.5 text-[9px] leading-tight text-muted-foreground"
                >
                  {s.detail}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A single state token morphing through the shared root-cause pattern behind
 * both CVEs — a genuine state transition, not four static icons. Purely
 * conceptual, not a reproduction of the actual exploit or source code.
 * `runKey` remounts the inner component so each replay starts clean.
 */
export function MemoryStateDiagram({ active, runKey }: { active: boolean; runKey: string | number }) {
  return <MemoryStateDiagramInner key={runKey} active={active} />;
}
