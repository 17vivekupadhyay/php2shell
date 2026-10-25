import { ArrowUpCircle, PackageSearch, Calendar, ShieldQuestion } from "lucide-react";
import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";

const ICONS = [ArrowUpCircle, PackageSearch, Calendar, ShieldQuestion];

export function PatchResponseSection() {
  const a = REAL_WORLD_ALERT;

  return (
    <div className="space-y-2">
      {a.guidance.map((g, i) => {
        const Icon = ICONS[i] ?? ArrowUpCircle;
        return (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-php/30 bg-php/10 font-mono text-xs font-semibold text-php">
              {i + 1}
            </div>
            <Icon className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">{g}</p>
          </div>
        );
      })}
    </div>
  );
}
