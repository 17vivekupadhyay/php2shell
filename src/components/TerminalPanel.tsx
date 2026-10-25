"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED_MS = 14;

/**
 * Types out `text` character by character when `enabled`. Each stage passes a
 * different `text`, and the parent remounts this (via `key`) per stage, so the
 * initial state below only ever needs to compute the state for a fresh mount —
 * no reset-via-effect needed when the stage changes.
 */
function useTypewriter(text: string, enabled: boolean) {
  const [shown, setShown] = useState<string>(() => (enabled ? "" : text));
  const [done, setDone] = useState<boolean>(() => !enabled);

  useEffect(() => {
    if (!enabled) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(id);
      }
    }, TYPE_SPEED_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { shown, done };
}

function TerminalBody({ lines, live, accentColor }: { lines: string[]; live: boolean; accentColor: string }) {
  const fullText = lines.join("\n");
  const { shown, done } = useTypewriter(fullText, live);

  return (
    <>
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 font-mono text-[11px] text-white/40">attacker@kali:~</span>
        {!done && (
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px]" style={{ color: accentColor }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: accentColor }} />
            RUNNING
          </span>
        )}
      </div>
      <pre className="min-h-[108px] whitespace-pre-wrap p-4 font-mono text-[12.5px] leading-relaxed text-green-400/90">
        {shown}
        <span
          className="ml-0.5 inline-block h-[14px] w-[7px] align-middle animate-pulse"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        />
      </pre>
    </>
  );
}

export function TerminalPanel({
  lines,
  live,
  accentColor,
  runKey,
}: {
  lines: string[];
  /** Whether to animate the typing (true during autoplay / stage changes) or show instantly. */
  live: boolean;
  accentColor: string;
  /** Bump this (e.g. on every "Run the attack" press) to force a fresh type-out even on the same stage. */
  runKey: string | number;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-[#1a1a1a]">
      {/* key forces a fresh mount per stage/run, so the typewriter's lazy initial state recomputes cleanly */}
      <TerminalBody key={`${lines.join("|")}-${runKey}`} lines={lines} live={live} accentColor={accentColor} />
    </div>
  );
}
