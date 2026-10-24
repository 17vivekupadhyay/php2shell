"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  Link2,
  Newspaper,
  ExternalLink,
} from "lucide-react";
import { ATTACK_STAGES } from "@/lib/attack-chain";
import { CodeComparison } from "@/components/CodeComparison";
import { TerminalPanel } from "@/components/TerminalPanel";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4200;

export function KillChain() {
  // Always starts at stage 1 on both server and client renders, so hydration
  // matches; a deep-linked ?stage=N is restored after mount, below.
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [openTechnique, setOpenTechnique] = useState<string | null>(null);
  const [justLanded, setJustLanded] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [runId, setRunId] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const stage = ATTACK_STAGES[activeIndex];
  const lastIndex = ATTACK_STAGES.length - 1;

  function goTo(i: number) {
    const clamped = Math.max(0, Math.min(lastIndex, i));
    setActiveIndex(clamped);
    setVisited((prev) => new Set(prev).add(clamped));
    setOpenTechnique(null);
  }

  // Restore a deep-linked stage once mounted (post-hydration), then keep the
  // URL in sync as the active stage changes, so the page is shareable mid-chain.
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("stage"));
    if (n >= 1 && n <= ATTACK_STAGES.length && n - 1 !== 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from the URL after hydration, not a derived-state sync
      goTo(n - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("stage", String(activeIndex + 1));
    window.history.replaceState(null, "", url);
  }, [activeIndex]);

  function togglePlay() {
    setPlaying((p) => {
      const next = !p;
      if (next) setRunId((r) => r + 1);
      return next;
    });
  }

  function copyShareLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    });
  }

  // Autoplay
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        if (next > lastIndex) {
          setPlaying(false);
          return prev;
        }
        setVisited((v) => new Set(v).add(next));
        setJustLanded(true);
        setTimeout(() => setJustLanded(false), 700);
        return next;
      });
      setOpenTechnique(null);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [playing, lastIndex]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        setPlaying(false);
        goTo(activeIndex + 1);
      } else if (e.key === "ArrowLeft") {
        setPlaying(false);
        goTo(activeIndex - 1);
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  function restart() {
    setPlaying(false);
    setActiveIndex(0);
    setVisited(new Set([0]));
    setOpenTechnique(null);
  }

  const progressPct = (activeIndex / lastIndex) * 100;
  const explored = visited.size;

  return (
    <div ref={containerRef} className="w-full select-none">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="inline-flex items-center gap-1.5 rounded-full bg-php hover:bg-php-light text-white text-sm font-medium px-4 py-2 transition-colors"
            aria-label={playing ? "Pause autoplay" : "Play attack chain"}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : activeIndex === 0 && explored <= 1 ? "Run the attack" : "Resume"}
          </button>
          <button
            onClick={restart}
            className="inline-flex items-center gap-1.5 rounded-full border border-border hover:bg-accent text-sm px-3 py-2 transition-colors"
            aria-label="Restart"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restart
          </button>
          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-1.5 rounded-full border border-border hover:bg-accent text-sm px-3 py-2 transition-colors"
            aria-label="Copy link to this stage"
          >
            {shareCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Link2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{shareCopied ? "Copied!" : "Share"}</span>
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-mono">
            Stage {activeIndex + 1} / {ATTACK_STAGES.length}
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{explored} explored</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-php-light via-php to-php-dark"
          animate={{ width: `${((activeIndex + 1) / ATTACK_STAGES.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Desktop node track */}
      <div className="hidden md:block relative mb-10">
        <div className="absolute left-0 right-0 top-7 h-0.5 bg-border" />
        <motion.div
          className="absolute left-0 top-7 h-0.5 bg-gradient-to-r from-php-light via-php to-php-dark"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {playing && (
          <motion.div
            key={activeIndex}
            className="absolute top-5 h-3 w-3 rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.8)]"
            initial={{ left: `${(activeIndex / lastIndex) * 100}%`, opacity: 0 }}
            animate={{
              left: `${(Math.min(activeIndex + 1, lastIndex) / lastIndex) * 100}%`,
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
          />
        )}

        <div className="relative flex justify-between">
          {ATTACK_STAGES.map((s, i) => {
            const isActive = i === activeIndex;
            const isVisited = visited.has(i);
            return (
              <button
                key={s.id}
                onClick={() => {
                  setPlaying(false);
                  goTo(i);
                }}
                className="flex flex-col items-center gap-2 group"
                style={{ width: `${100 / ATTACK_STAGES.length}%` }}
                aria-current={isActive}
              >
                <span
                  className={cn(
                    "relative flex h-14 w-14 items-center justify-center rounded-full border-2 font-heading font-semibold text-sm transition-all",
                    isActive
                      ? "scale-110 border-transparent text-white shadow-lg"
                      : isVisited
                        ? "border-transparent text-white/90"
                        : "border-border bg-card text-muted-foreground group-hover:border-foreground/40"
                  )}
                  style={
                    isActive || isVisited
                      ? { background: `linear-gradient(135deg, ${s.colorFrom}, ${s.colorTo})` }
                      : undefined
                  }
                >
                  {isVisited && !isActive ? <Check className="h-5 w-5" /> : s.order}
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ boxShadow: `0 0 0 4px ${s.colorFrom}33` }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                  {isActive && justLanded && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: s.colorFrom }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium text-center leading-tight",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile vertical track */}
      <div className="flex md:hidden flex-col gap-0 mb-8">
        {ATTACK_STAGES.map((s, i) => {
          const isActive = i === activeIndex;
          const isVisited = visited.has(i);
          return (
            <div key={s.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    setPlaying(false);
                    goTo(i);
                  }}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-heading font-semibold text-sm transition-all",
                    isActive
                      ? "border-transparent text-white scale-105"
                      : isVisited
                        ? "border-transparent text-white/90"
                        : "border-border bg-card text-muted-foreground"
                  )}
                  style={
                    isActive || isVisited
                      ? { background: `linear-gradient(135deg, ${s.colorFrom}, ${s.colorTo})` }
                      : undefined
                  }
                  aria-current={isActive}
                >
                  {isVisited && !isActive ? <Check className="h-4 w-4" /> : s.order}
                </button>
                {i < lastIndex && (
                  <div
                    className={cn("w-0.5 flex-1 min-h-8 my-1", isVisited ? "bg-gradient-to-b" : "bg-border")}
                    style={
                      isVisited ? { backgroundImage: `linear-gradient(${s.colorFrom}, ${ATTACK_STAGES[i + 1].colorFrom})` } : undefined
                    }
                  />
                )}
              </div>
              <button
                onClick={() => {
                  setPlaying(false);
                  goTo(i);
                }}
                className="pb-6 text-left"
              >
                <div className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {s.title}
                </div>
                {isActive && <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>}
              </button>
            </div>
          );
        })}
      </div>

      {/* Live terminal */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`terminal-${stage.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-3"
        >
          <TerminalPanel
            lines={stage.terminalLines}
            live={playing || justLanded}
            accentColor={stage.colorFrom}
            runKey={runId}
          />
        </motion.div>
      </AnimatePresence>
      <p className="mb-8 text-center text-xs text-muted-foreground">
        Simulated terminal output — illustrative only, nothing here is executed.
      </p>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="p-6" style={{ background: `linear-gradient(135deg, ${stage.colorFrom}14, transparent 60%)` }}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg font-heading font-bold text-white text-sm shrink-0"
                style={{ background: `linear-gradient(135deg, ${stage.colorFrom}, ${stage.colorTo})` }}
              >
                {stage.order}
              </span>
              <h2 className="text-xl font-heading font-semibold">{stage.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{stage.detail}</p>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-500/10 border border-green-500/30 p-3">
              <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm text-green-200/90 leading-relaxed">{stage.defenderNote}</p>
            </div>

            {stage.reference && (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                <span className="font-mono font-semibold" style={{ color: stage.colorFrom }}>
                  {stage.reference.label}
                </span>
                <span className="text-muted-foreground max-w-md">{stage.reference.summary}</span>
                <a
                  href={stage.reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3 w-3" /> Source
                </a>
                <a
                  href={`https://news.google.com/search?q=${encodeURIComponent(stage.reference.label)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Newspaper className="h-3 w-3" /> News coverage
                </a>
              </div>
            )}
          </div>

          {stage.example && (
            <div className="border-t border-border p-6">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                What it looks like
              </h3>
              <CodeComparison
                vulnerableCode={stage.example.vulnerable}
                secureCode={stage.example.secure}
                language={stage.example.language ?? "php"}
              />
            </div>
          )}

          <div className="border-t border-border p-6">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Techniques at this stage — tap for the defense
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {stage.techniques.map((t) => {
                const open = openTechnique === t.id;
                return (
                  <div key={t.id} className="rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setOpenTechnique(open ? null : t.id)}
                      className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left hover:bg-accent/50 transition-colors"
                      aria-expanded={open}
                    >
                      <span className="text-sm font-medium">{t.name}</span>
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-3.5 pb-3.5 space-y-2"
                        >
                          <p className="text-xs text-muted-foreground leading-relaxed">{t.detail}</p>
                          <div className="flex items-start gap-1.5 text-xs text-green-400">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{t.defense}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => {
            setPlaying(false);
            goTo(activeIndex - 1);
          }}
          disabled={activeIndex === 0}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            goTo(activeIndex + 1);
          }}
          disabled={activeIndex === lastIndex}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
