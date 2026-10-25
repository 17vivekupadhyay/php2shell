"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "What actually triggers the vulnerable state behind both CVEs?",
    options: [
      "A SQL injection in the session table",
      "An out-of-memory error interrupting PHP mid-initialization",
      "A weak session cookie secret",
      "A buffer overflow in regex parsing",
    ],
    correctIndex: 1,
    explanation:
      "Both bugs share one root cause: PHP marks a piece of memory as ready-to-use before fully setting it up. If an out-of-memory fatal hits in that exact window, PHP's own cleanup code ends up trusting that half-built state.",
  },
  {
    id: "q2",
    prompt: "Why does PHP-FPM's version need two requests, while mod_php's version can work in one?",
    options: [
      "FPM has no memory limit at all",
      "FPM workers always run as root",
      "A PHP-FPM worker survives a post-startup fatal and can serve another request; mod_php's worker was already going to stay alive regardless",
      "mod_php doesn't support file uploads",
    ],
    correctIndex: 2,
    explanation:
      "PHP-FPM kills a worker outright if startup itself fails — but if the fatal happens after startup succeeds, the worker survives, letting a second, unrelated request reach the dangling state the first one left behind.",
  },
  {
    id: "q3",
    prompt: "According to PHP's own advisory, what's the only complete fix?",
    options: [
      "Disabling file uploads",
      "Restarting PHP-FPM workers nightly",
      "Enabling a WAF rule for multipart requests",
      "Upgrading to a patched PHP version",
    ],
    correctIndex: 3,
    explanation:
      "PHP's advisory is explicit: there are no complete mitigations. The config changes (memory_limit, post_max_size, disabling session.upload_progress) only narrow exposure to specific paths — upgrading is the only thing that actually closes the hole.",
  },
];

export function UnderstandingCheck() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  function select(qId: string, idx: number) {
    if (revealed[qId]) return;
    setAnswers((a) => ({ ...a, [qId]: idx }));
    setRevealed((r) => ({ ...r, [qId]: true }));
  }

  const answeredCount = Object.keys(revealed).length;
  const correctCount = QUESTIONS.filter((q) => answers[q.id] === q.correctIndex).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="label-console flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5" /> Three questions
        </h3>
        {answeredCount > 0 && !allAnswered && (
          <span className="label-console">
            {correctCount}/{answeredCount} correct
          </span>
        )}
      </div>

      {QUESTIONS.map((q, qi) => {
        const selected = answers[q.id];
        const isRevealed = revealed[q.id];
        return (
          <div key={q.id} className="border border-border p-3.5">
            <p className="mb-2.5 text-sm font-medium">
              {qi + 1}. {q.prompt}
            </p>
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.correctIndex;
                const isSelected = oi === selected;
                return (
                  <button
                    key={oi}
                    onClick={() => select(q.id, oi)}
                    disabled={isRevealed}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors",
                      !isRevealed && "border-border hover:bg-accent/50",
                      isRevealed && isCorrect && "border-safe/50 bg-safe/10 text-safe",
                      isRevealed && isSelected && !isCorrect && "border-critical/50 bg-critical/10 text-critical",
                      isRevealed && !isCorrect && !isSelected && "border-border opacity-50"
                    )}
                  >
                    {isRevealed && isCorrect && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-safe" />}
                    {isRevealed && isSelected && !isCorrect && <XCircle className="h-3.5 w-3.5 shrink-0 text-critical" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {isRevealed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 text-xs leading-relaxed text-muted-foreground"
                >
                  {q.explanation}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <AnimatePresence>
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "flex items-center gap-2 rounded-lg border p-3 text-sm",
              correctCount === QUESTIONS.length
                ? "border-safe/40 bg-safe/10 text-safe"
                : "border-vulnerable/40 bg-vulnerable/10 text-vulnerable"
            )}
          >
            <Trophy className="h-4 w-4 shrink-0" />
            {correctCount === QUESTIONS.length
              ? `${correctCount}/${QUESTIONS.length} — you've got the mechanism down.`
              : `${correctCount}/${QUESTIONS.length} — review the explanations above for the ones you missed.`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
