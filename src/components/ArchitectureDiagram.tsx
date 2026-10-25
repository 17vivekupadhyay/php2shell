"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Server, AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const PULSE_MS = 1400;

function Node({
  icon: Icon,
  label,
  sublabel,
  tone,
  compact,
}: {
  icon: typeof Globe;
  label: string;
  sublabel?: string;
  tone?: "neutral" | "vulnerable" | "critical";
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: compact ? 72 : 92 }}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border-2",
          compact ? "h-9 w-9" : "h-11 w-11",
          tone === "critical" && "border-critical/70 text-critical bg-critical/10",
          tone === "vulnerable" && "border-vulnerable/70 text-vulnerable bg-vulnerable/10",
          (!tone || tone === "neutral") && "border-border text-muted-foreground bg-card"
        )}
      >
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </div>
      <span className={cn("text-center font-medium leading-tight", compact ? "text-[9px]" : "text-[10px]")}>{label}</span>
      {sublabel && !compact && <span className="text-center text-[9px] leading-tight text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

function Connector({ active, tone = "neutral" as const }: { active: boolean; tone?: "neutral" | "vulnerable" | "critical" }) {
  const color = tone === "critical" ? "var(--color-critical)" : tone === "vulnerable" ? "var(--color-vulnerable)" : "var(--color-php)";
  return (
    <div className="relative h-0.5 flex-1 min-w-[16px] bg-border overflow-visible">
      <AnimatePresence>
        {active && (
          <motion.div
            key="pulse"
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 6px 1px ${color}` }}
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: PULSE_MS / 1000, ease: "linear" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The two affected request paths, shown as labeled flow diagrams — purely
 * conceptual architecture, no payloads or trigger conditions.
 */
export function ArchitectureDiagram({ compact = false }: { compact?: boolean }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), PULSE_MS + 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <div>
        {!compact && (
          <div className="mb-2 flex items-center gap-1.5 label-console">
            <span className="h-1.5 w-1.5 rounded-full bg-critical" /> Apache + mod_php — highest risk
          </div>
        )}
        <div className="flex items-center overflow-x-auto pb-1" key={`row1-${tick}`}>
          <Node icon={Globe} label="Web request" compact={compact} />
          <Connector active tone="critical" />
          <Node icon={Server} label="Apache / mod_php" compact={compact} />
          <Connector active tone="critical" />
          <Node icon={AlertTriangle} label="Unsafe cleanup state" tone="critical" compact={compact} />
        </div>
      </div>

      <div>
        {!compact && (
          <div className="mb-2 flex items-center gap-1.5 label-console">
            <span className="h-1.5 w-1.5 rounded-full bg-vulnerable" /> PHP-FPM — two-request path
          </div>
        )}
        <div className="flex items-center overflow-x-auto pb-1" key={`row2-${tick}`}>
          <Node icon={Globe} label="Request A" compact={compact} />
          <Connector active tone="vulnerable" />
          <Node icon={Server} label="FPM worker" compact={compact} />
          <Connector active tone="vulnerable" />
          <Node icon={RotateCcw} label="Stale state" tone="vulnerable" compact={compact} />
          <Connector active tone="vulnerable" />
          <Node icon={Globe} label="Request B" compact={compact} />
        </div>
      </div>
    </div>
  );
}
