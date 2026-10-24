import { AlertTriangle, ExternalLink, ShieldAlert, BadgeCheck } from "lucide-react";
import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";
import { RealWorldKillChain } from "@/components/RealWorldKillChain";
import { UnderstandingCheck } from "@/components/UnderstandingCheck";

export function RealWorldAlert() {
  const a = REAL_WORLD_ALERT;
  const primarySource = a.sources.find((s) => s.primary);
  const otherSources = a.sources.filter((s) => !s.primary);

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
        {primarySource && (
          <a
            href={primarySource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3.5 py-2.5 text-sm transition-colors hover:bg-green-500/15"
          >
            <BadgeCheck className="h-4 w-4 shrink-0 text-green-400" />
            <span className="text-green-200">
              Read PHP&apos;s own official advisory <span className="text-green-300/70">— {primarySource.title}</span>
            </span>
            <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-green-400" />
          </a>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">{a.summary}</p>

        <div className="rounded-lg border border-border bg-card/50 p-3">
          <h3 className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wide">Who&apos;s at risk</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{a.atRisk}</p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4">
          <RealWorldKillChain />
          <p className="text-xs text-muted-foreground">
            This timeline covers public events and the conceptual mechanism only — no exploit trigger or payload
            details are included, since both CVEs were under active exploitation at the time this was written.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4">
          <UnderstandingCheck />
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
            {otherSources.map((s) => (
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
