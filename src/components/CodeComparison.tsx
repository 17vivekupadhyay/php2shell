"use client";

import { CodeBlock } from "@/components/CodeBlock";

interface CodeComparisonProps {
  vulnerableCode: string;
  secureCode: string;
  language?: string;
}

export function CodeComparison({ vulnerableCode, secureCode, language = "php" }: CodeComparisonProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CodeBlock code={vulnerableCode} language={language} label="Vulnerable" variant="vulnerable" />
      <CodeBlock code={secureCode} language={language} label="Secure" variant="secure" />
    </div>
  );
}
