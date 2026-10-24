"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";
import { usePayload } from "@/hooks/usePayload";
import { INJECTION_POINTS, TARGET_FUNCTIONS } from "@/lib/payloads";
import { ShellType } from "@/types";

const SHELL_OPTIONS = [
  { id: ShellType.BASH, label: "bash" },
  { id: ShellType.SH, label: "sh" },
  { id: ShellType.ZSH, label: "zsh" },
  { id: ShellType.POWERSHELL, label: "PowerShell (Windows)" },
];

export function PayloadSimulator() {
  const {
    injectionPoint,
    setInjectionPoint,
    targetFunction,
    setTargetFunction,
    shell,
    setShell,
    command,
    setCommand,
    result,
    generate,
  } = usePayload();

  const selectedPoint = INJECTION_POINTS.find((p) => p.id === injectionPoint);
  const selectedFn = TARGET_FUNCTIONS.find((f) => f.id === targetFunction);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 flex gap-2 text-sm text-yellow-700 dark:text-yellow-300">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          This simulator only <strong>generates example payload text and explanatory, hard-coded output</strong> —
          it does not execute any command, real or otherwise. Nothing here runs against your system or anyone else&apos;s.
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Build a scenario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Injection point</label>
              <Select value={injectionPoint} onValueChange={(v) => setInjectionPoint(v as typeof injectionPoint)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INJECTION_POINTS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPoint && <p className="text-xs text-muted-foreground">{selectedPoint.description}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Target function</label>
              <Select value={targetFunction} onValueChange={(v) => setTargetFunction(v as typeof targetFunction)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_FUNCTIONS.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFn && <p className="text-xs text-muted-foreground font-mono">{selectedFn.signature}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Target shell</label>
              <Select value={shell} onValueChange={(v) => setShell(v as ShellType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHELL_OPTIONS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Example command to append</label>
              <Input value={command} onChange={(e) => setCommand(e.target.value)} placeholder="id" />
              <p className="text-xs text-muted-foreground">
                Illustrative only — try harmless examples like <code>id</code> or <code>whoami</code>.
              </p>
            </div>
          </div>

          <Button onClick={generate} className="w-full sm:w-auto">
            <Terminal className="h-4 w-4 mr-2" /> Generate Payload
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={JSON.stringify(result)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-sm font-semibold mb-2">Vulnerable PHP (illustrative)</h3>
              <CodeBlock code={result.vulnerablePhpSnippet} language="php" variant="vulnerable" />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Generated payload</h3>
              <CodeBlock code={result.generatedPayload} language="bash" variant="neutral" />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Simulated output</h3>
              <CodeBlock code={result.simulatedOutput} language="bash" variant="neutral" />
            </div>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.impactExplanation}</p>
                </div>
                {result.bypassNotes && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1.5">If disable_functions / a filter blocks this</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      {result.bypassNotes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
