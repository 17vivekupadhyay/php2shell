import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";

export function PatchResponseSection() {
  const a = REAL_WORLD_ALERT;

  return (
    <ol className="space-y-3">
      {a.guidance.map((g, i) => (
        <li key={i} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
          <span className="font-mono text-sm text-php">{String(i + 1).padStart(2, "0")}</span>
          <p className="text-sm leading-relaxed text-muted-foreground">{g}</p>
        </li>
      ))}
    </ol>
  );
}
