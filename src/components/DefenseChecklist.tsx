"use client";

import { useMemo } from "react";
import { Download, RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHECKLIST_SECTIONS, getTotalChecklistItems } from "@/lib/checklist";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const PRIORITY_COLOR: Record<string, string> = {
  critical: "bg-red-600",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

export function DefenseChecklist() {
  const checkedItems = useStore((s) => s.checkedItems);
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem);
  const resetChecklist = useStore((s) => s.resetChecklist);

  const total = getTotalChecklistItems();
  const completed = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems]
  );
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  function exportMarkdown() {
    const lines: string[] = [`# Hardening Report (${completed}/${total} complete)`, ""];
    for (const section of CHECKLIST_SECTIONS) {
      lines.push(`## ${section.title}`, "");
      for (const item of section.items) {
        const mark = checkedItems[item.id] ? "x" : " ";
        lines.push(`- [${mark}] **${item.label}** (${item.priority}) — ${item.description}`);
      }
      lines.push("");
    }

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "php-hardening-report.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Progress: {completed}/{total} completed
            </span>
            <span className="text-sm text-muted-foreground">{pct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={exportMarkdown}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export Report
            </Button>
            <Button size="sm" variant="outline" onClick={resetChecklist}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {CHECKLIST_SECTIONS.map((section) => {
        const sectionCompleted = section.items.filter((i) => checkedItems[i.id]).length;
        return (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{section.title}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {sectionCompleted}/{section.items.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={!!checkedItems[item.id]}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full shrink-0", PRIORITY_COLOR[item.priority])}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          checkedItems[item.id] && "line-through text-muted-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
