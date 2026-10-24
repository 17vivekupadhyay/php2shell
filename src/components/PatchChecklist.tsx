"use client";

import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  command?: string;
}

const ITEMS: ChecklistItem[] = [
  {
    id: "check-version",
    label: "Check your actual running PHP version",
    command: "php -v",
    detail: "Must be ≥ 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 — matching the branch you're on.",
  },
  {
    id: "check-fpm-version",
    label: "If behind PHP-FPM, check the pool's version too — not just the CLI",
    command: "php-fpm -v",
    detail: "CLI and FPM can silently drift to different versions on the same host.",
  },
  {
    id: "check-docker",
    label: "If containerized, confirm the base image tag is pinned and rebuilt",
    command: "docker image inspect <image> | grep -i php",
    detail: "A floating tag like php:8.3-fpm doesn't retroactively patch an already-running container — you have to rebuild and redeploy.",
  },
  {
    id: "check-composer",
    label: "Check composer.json/composer.lock isn't pinning an old platform PHP version",
    command: "composer show -i php",
    detail: "A platform override can mask the real runtime version in CI checks.",
  },
  {
    id: "check-hosting",
    label: "On shared/managed hosting, verify with your host's control panel directly",
    detail: "What's \"configured\" and what's actually serving requests aren't always the same thing.",
  },
  {
    id: "mitigate-interim",
    label: "If you truly can't patch yet, apply PHP's own interim mitigations",
    detail: "memory_limit=-1 (via php_admin_value) + a sane post_max_size, and session.upload_progress.enabled=0 in php.ini/pool config — not a substitute for patching, but narrows exposure.",
  },
  {
    id: "check-eol",
    label: "If you're on PHP ≤8.1, don't assume \"no option\" — check the backports",
    detail: "PHP released minimal source-backports for 7.4 / 8.0 / 8.1 given the severity, in addition to planning a real migration.",
  },
  {
    id: "audit-if-exposed",
    label: "If this host was internet-facing and unpatched Oct 21–24, 2026 — audit it",
    detail: "Treat it as potentially compromised, not just vulnerable. Patching alone doesn't undo a prior compromise.",
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
        <h3 className="text-sm font-semibold">Am I patched? Verification checklist</h3>
        <span className="text-xs text-muted-foreground">
          {done}/{ITEMS.length} verified
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted mb-3">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
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
                <CheckSquare className="h-4 w-4 shrink-0 mt-0.5 text-green-400" />
              ) : (
                <Square className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <div className={cn("text-xs font-medium", isChecked && "text-muted-foreground line-through")}>
                  {item.label}
                </div>
                {item.command && (
                  <code className="mt-1 inline-block rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-green-400">
                    {item.command}
                  </code>
                )}
                {item.detail && <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.detail}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
