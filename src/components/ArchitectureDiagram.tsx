"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Server, AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const PULSE_MS = 1400;

function Node({
  icon: Icon,
  label,
  compact,
  danger,
}: {
  icon: typeof Globe;
  label: string;
  compact?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: compact ? 72 : 92 }}>
      <div
        className={cn(
          "flex items-center justify-center rounded-md border",
          compact ? "h-9 w-9" : "h-11 w-11",
          danger ? "border-critical text-critical" : "border-border text-muted-foreground"
        )}
      >
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </div>
      <span className={cn("text-center leading-tight", compact ? "text-[9px]" : "text-[10px]")}>{label}</span>
    </div>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className="relative h-px flex-1 min-w-[16px] bg-border overflow-visible">
      <AnimatePresence>
        {active && (
          <motion.div
            key="pulse"
            className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-php"
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
        {!compact && <p className="mb-2 text-xs font-semibold text-muted-foreground">Apache + mod_php — highest risk</p>}
        <div className="flex items-center overflow-x-auto pb-1" key={`row1-${tick}`}>
          <Node icon={Globe} label="Web request" compact={compact} />
          <Connector active />
          <Node icon={Server} label="Apache / mod_php" compact={compact} />
          <Connector active />
          <Node icon={AlertTriangle} label="Unsafe cleanup state" danger compact={compact} />
        </div>
      </div>

      <div>
        {!compact && <p className="mb-2 text-xs font-semibold text-muted-foreground">PHP-FPM — two-request path</p>}
        <div className="flex items-center overflow-x-auto pb-1" key={`row2-${tick}`}>
          <Node icon={Globe} label="Request A" compact={compact} />
          <Connector active />
          <Node icon={Server} label="FPM worker" compact={compact} />
          <Connector active />
          <Node icon={RotateCcw} label="Stale state" danger compact={compact} />
          <Connector active />
          <Node icon={Globe} label="Request B" compact={compact} />
        </div>
      </div>
    </div>
  );
}
