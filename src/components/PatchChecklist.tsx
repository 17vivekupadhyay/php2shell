"use client";

import { useState } from "react";
import { CheckSquare, Square, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  command?: string;
  isWarning?: boolean;
}

const ITEMS: ChecklistItem[] = [
  {
    id: "inventory",
    label: "Inventory every PHP runtime — not just the obvious ones",
    detail: "Web servers, CLI cron jobs, queue workers, CI runners, and any container image that embeds PHP. A missed worker is still exposed.",
  },
  {
    id: "confirm-version",
    label: "Confirm a fixed upstream version or vendor backport for each one",
    detail: "Must be ≥ 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 — or, if on an unsupported branch, a vendor/LTS backport specifically for CVE-2026-109618 and CVE-2026-109619.",
  },
  {
    id: "rebuild-redeploy",
    label: "Rebuild and redeploy — don't assume a config change is enough",
    detail: "A floating Docker tag doesn't retroactively patch a container that's already running. Rebuild the image and restart the processes actually serving traffic.",
  },
  {
    id: "verify-live",
    label: "Verify the live, traffic-serving runtime — not only the CLI",
    command: "php -v",
    detail: "This only checks the CLI binary. It can report a patched version while your PHP-FPM pool or Apache mod_php is still running the old one — check the actual worker/pool version too.",
    isWarning: true,
  },
  {
    id: "check-containers",
    label: "Check container and scheduled-job images separately from your main app",
    detail: "Background workers and cron containers are frequently built from older, unpatched base images even after the main app is fixed.",
  },
  {
    id: "audit-if-exposed",
    label: "Flag any previously internet-facing, unpatched system for incident review",
    detail: "If a host was reachable and unpatched between Oct 21–24, 2026, treat it as a compromise concern, not just a patching task — patching alone doesn't undo a prior breach.",
  },
];

export function PatchChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div className="rounded-lg border border-border bg-card/50 p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="label-console">Verification checklist</h3>
        <span className="label-console">
          {done}/{ITEMS.length} verified
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted mb-3">
        <div
          className="h-full rounded-full bg-safe transition-all duration-300"
          style={{ width: `${(done / ITEMS.length) * 100}%` }}
        />
      </div>
      <div className="space-y-1">
        {ITEMS.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent/50"
            >
              {isChecked ? (
                <CheckSquare className="h-4 w-4 shrink-0 mt-0.5 text-safe" />
              ) : (
                <Square className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <div className={cn("text-xs font-medium", isChecked && "text-muted-foreground line-through")}>
                  {item.label}
                </div>
                {item.command && (
                  <code className="mt-1 inline-block rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-safe">
                    {item.command}
                  </code>
                )}
                {item.detail && (
                  <div
                    className={cn(
                      "mt-1 flex items-start gap-1 text-[11px] leading-relaxed",
                      item.isWarning ? "text-vulnerable" : "text-muted-foreground"
                    )}
                  >
                    {item.isWarning && <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />}
                    <span>{item.detail}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
