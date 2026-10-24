"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/hooks/useTheme";
import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
  variant?: "vulnerable" | "secure" | "neutral";
  className?: string;
}

const VARIANT_BORDER: Record<string, string> = {
  vulnerable: "border-red-500/40",
  secure: "border-green-500/40",
  neutral: "border-border",
};

const VARIANT_BADGE: Record<string, string> = {
  vulnerable: "bg-red-600 text-white",
  secure: "bg-green-600 text-white",
  neutral: "bg-muted text-muted-foreground",
};

export function CodeBlock({ code, language = "php", label, variant = "neutral", className }: CodeBlockProps) {
  const { theme } = useTheme();

  return (
    <div className={cn("overflow-hidden rounded-lg border", VARIANT_BORDER[variant], className)}>
      <div className="flex items-center justify-between bg-[#0f172a] px-3 py-1.5">
        {label ? (
          <span className={cn("rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide", VARIANT_BADGE[variant])}>
            {label}
          </span>
        ) : (
          <span className="text-[11px] uppercase tracking-wide text-slate-400">{language}</span>
        )}
        <CopyButton text={code} className="text-slate-300 hover:text-white" />
      </div>
      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? vscDarkPlus : vs}
        showLineNumbers
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.8125rem",
          background: theme === "dark" ? "#0f172a" : "#f8fafc",
        }}
        lineNumberStyle={{ color: theme === "dark" ? "#475569" : "#94a3b8", minWidth: "2.25em" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
