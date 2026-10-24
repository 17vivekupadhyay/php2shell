import { Server, Repeat, XCircle, CheckCircle2 } from "lucide-react";

const MODELS = [
  {
    name: "Apache + mod_php",
    subtitle: "PHP embedded in each Apache worker",
    bullets: [
      "PHP runs inside the same process as the web server worker",
      "A fatal error runs request shutdown in that same worker — which then stays alive",
      "Risk: highest — PHP's advisory confirms an unauthenticated request can trigger this before any app code runs",
    ],
    riskLevel: "highest" as const,
  },
  {
    name: "PHP-FPM",
    subtitle: "A separate pool of long-lived workers",
    bullets: [
      "PHP runs in its own worker pool, usually behind nginx",
      "A fatal during startup kills that worker outright — no second request in the same process",
      "But a fatal after startup succeeds lets the worker survive and keep serving — that's what the second bug needs",
    ],
    riskLevel: "model-dependent" as const,
  },
];

export function DeploymentModelDiagram() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MODELS.map((m) => (
        <div key={m.name} className="rounded-lg border border-border bg-card/50 p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-semibold">{m.name}</div>
              <div className="text-[11px] text-muted-foreground">{m.subtitle}</div>
            </div>
          </div>
          <ul className="space-y-1.5">
            {m.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                {i === m.bullets.length - 1 ? (
                  m.riskLevel === "highest" ? (
                    <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-400" />
                  ) : (
                    <Repeat className="h-3.5 w-3.5 shrink-0 mt-0.5 text-yellow-400" />
                  )
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/50" />
                )}
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
