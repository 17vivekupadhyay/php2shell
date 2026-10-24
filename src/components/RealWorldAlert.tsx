import { AlertTriangle, ExternalLink, ShieldAlert } from "lucide-react";
import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";
import { RealWorldKillChain } from "@/components/RealWorldKillChain";

export function RealWorldAlert() {
  const a = REAL_WORLD_ALERT;

  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/[0.06] overflow-hidden">
      <div className="flex items-start gap-3 p-5 border-b border-red-500/20">
        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading font-semibold text-red-200">{a.name} — what actually happened</h2>
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-mono text-red-300">
              {a.cves.join(" · ")}
            </span>
          </div>
          <p className="mt-1 text-xs text-red-300/80">
            {a.disclosedDate} · CVSS {a.cvss}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{a.summary}</p>

        <div className="rounded-xl border border-border bg-card/50 p-4">
          <RealWorldKillChain />
          <p className="text-xs text-muted-foreground">
            This timeline covers public events and the conceptual mechanism only — no exploit trigger or payload
            details are included, since both CVEs were under active exploitation at the time this was written.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-green-500" /> If you run PHP, do this now
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            {a.guidance.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Patched: <span className="font-mono text-foreground">{a.patchedVersions.join(" · ")}</span>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Sources</h3>
          <ul className="space-y-1">
            {a.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:underline"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  {s.title} <span className="text-muted-foreground">— {s.publisher}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
