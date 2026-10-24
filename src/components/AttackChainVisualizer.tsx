"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ArrowDown } from "lucide-react";
import { ATTACK_STAGES } from "@/lib/attack-chain";
import { cn } from "@/lib/utils";

export function AttackChainVisualizer() {
  const [activeId, setActiveId] = useState<string>(ATTACK_STAGES[0].id);
  const activeStage = ATTACK_STAGES.find((s) => s.id === activeId) ?? ATTACK_STAGES[0];

  return (
    <div className="w-full">
      {/* Desktop: horizontal chain */}
      <div className="hidden md:flex items-center justify-between gap-2">
        {ATTACK_STAGES.map((stage, idx) => (
          <div key={stage.id} className="flex items-center flex-1">
            <motion.button
              onClick={() => setActiveId(stage.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className={cn(
                "relative flex-1 rounded-xl border p-4 text-left transition-all",
                activeId === stage.id
                  ? "border-transparent shadow-lg"
                  : "border-border bg-card hover:border-foreground/30"
              )}
              style={
                activeId === stage.id
                  ? { background: `linear-gradient(135deg, ${stage.colorFrom}, ${stage.colorTo})` }
                  : undefined
              }
              aria-pressed={activeId === stage.id}
            >
              <span
                className={cn(
                  "text-xs font-mono uppercase tracking-wider",
                  activeId === stage.id ? "text-white/80" : "text-muted-foreground"
                )}
              >
                Stage {stage.order}
              </span>
              <div className={cn("mt-1 font-semibold", activeId === stage.id ? "text-white" : "text-foreground")}>
                {stage.title}
              </div>
              <div className={cn("mt-1 text-xs", activeId === stage.id ? "text-white/80" : "text-muted-foreground")}>
                {stage.description}
              </div>
            </motion.button>
            {idx < ATTACK_STAGES.length - 1 && (
              <ChevronRight className="h-5 w-5 mx-1 text-muted-foreground shrink-0" aria-hidden />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical chain */}
      <div className="flex md:hidden flex-col gap-2">
        {ATTACK_STAGES.map((stage, idx) => (
          <div key={stage.id}>
            <motion.button
              onClick={() => setActiveId(stage.id)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-all",
                activeId === stage.id ? "border-transparent shadow-lg" : "border-border bg-card"
              )}
              style={
                activeId === stage.id
                  ? { background: `linear-gradient(135deg, ${stage.colorFrom}, ${stage.colorTo})` }
                  : undefined
              }
            >
              <span className={cn("text-xs font-mono uppercase", activeId === stage.id ? "text-white/80" : "text-muted-foreground")}>
                Stage {stage.order}
              </span>
              <div className={cn("mt-1 font-semibold", activeId === stage.id ? "text-white" : "text-foreground")}>
                {stage.title}
              </div>
            </motion.button>
            {idx < ATTACK_STAGES.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-6 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-10 rounded-full"
              style={{ background: `linear-gradient(90deg, ${activeStage.colorFrom}, ${activeStage.colorTo})` }}
            />
            <h3 className="text-lg font-semibold">{activeStage.title}</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{activeStage.detail}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeStage.techniques.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
