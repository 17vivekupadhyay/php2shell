import { ExternalLink, ShieldAlert } from "lucide-react";
import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";

export function Hero() {
  const a = REAL_WORLD_ALERT;
  const primarySource = a.sources.find((s) => s.primary);

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
        {/* Left: context */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-critical/40 bg-critical/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-critical">
              <ShieldAlert className="h-3 w-3" /> Critical incident · October 2026
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            PHP <span className="text-php">→</span> Shell
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            {a.name} is a pair of real, unauthenticated remote-code-execution bugs in core PHP, disclosed
            October 21, 2026. This is an interactive, sourced breakdown of what happened and how to verify you&apos;re patched.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {a.cves.map((cve) => (
              <span key={cve} className="rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-foreground">
                {cve}
              </span>
            ))}
            <span className="rounded-md border border-critical/30 bg-critical/10 px-2 py-1 font-mono text-[11px] text-critical">
              CVSS 9.2
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="label-console mr-1">Patched:</span>
            {a.patchedVersions.map((v) => (
              <span key={v} className="rounded-md border border-safe/30 bg-safe/10 px-2 py-0.5 font-mono text-[11px] text-safe">
                {v}
              </span>
            ))}
          </div>

          {primarySource && (
            <a
              href={primarySource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-source/40 bg-source/10 px-4 py-2.5 text-sm font-medium text-source transition-colors hover:bg-source/15"
            >
              Read PHP&apos;s official advisory
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Right: architecture preview */}
        <div className="min-w-0 rounded-xl border border-border bg-card/50 p-4">
          <div className="mb-3 label-console">Two affected paths</div>
          <ArchitectureDiagram compact />
        </div>
      </div>
    </section>
  );
}
