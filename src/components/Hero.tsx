import { ExternalLink } from "lucide-react";
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
          <p className="text-sm font-semibold text-critical">Critical incident · October 2026</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            PHP <span className="text-php">→</span> Shell
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            {a.name} is a pair of real, unauthenticated remote-code-execution bugs in core PHP, disclosed
            October 21, 2026. This is an interactive, sourced breakdown of what happened and how to verify you&apos;re patched.
          </p>

          <p className="mt-5 font-mono text-sm text-muted-foreground">
            {a.cves.join(" · ")} · <span className="text-critical">CVSS 9.2</span>
          </p>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            Patched: <span className="text-foreground">{a.patchedVersions.join(" · ")}</span>
          </p>

          {primarySource && (
            <a
              href={primarySource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-php px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-php-light"
            >
              Read PHP&apos;s official advisory
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Right: architecture preview */}
        <div className="min-w-0 border border-border p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Two affected paths</p>
          <ArchitectureDiagram compact />
        </div>
      </div>
    </section>
  );
}
