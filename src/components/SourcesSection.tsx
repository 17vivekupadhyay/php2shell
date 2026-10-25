import { ExternalLink, BadgeCheck } from "lucide-react";
import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";

export function SourcesSection() {
  const a = REAL_WORLD_ALERT;

  return (
    <ul className="space-y-1.5">
      {a.sources.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-source hover:underline"
          >
            {s.primary ? <BadgeCheck className="h-3.5 w-3.5 shrink-0" /> : <ExternalLink className="h-3 w-3 shrink-0" />}
            {s.title} <span className="text-muted-foreground">— {s.publisher}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
