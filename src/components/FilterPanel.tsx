"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { Severity, VulnType } from "@/types";
import { getAllCwes } from "@/lib/vulnerabilities";

const TYPE_LABELS: Record<VulnType, string> = {
  [VulnType.FILE_UPLOAD]: "File Upload",
  [VulnType.INJECTION]: "Code Injection",
  [VulnType.COMMAND_INJECTION]: "Command Injection",
  [VulnType.DESERIALIZATION]: "Deserialization",
  [VulnType.TEMPLATE_INJECTION]: "Template Injection",
  [VulnType.LFI_RFI]: "LFI / RFI",
  [VulnType.SQL_INJECTION]: "SQL Injection",
  [VulnType.PATH_TRAVERSAL]: "Path Traversal",
  [VulnType.MISCONFIGURATION]: "Misconfiguration",
  [VulnType.SSRF]: "SSRF",
  [VulnType.XXE]: "XXE",
};

export function FilterPanel() {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const clearFilters = useStore((s) => s.clearFilters);

  const hasFilters = Boolean(filters.severity || filters.type || filters.cwe || searchQuery);
  const cwes = getAllCwes();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, description, tag, or CWE…"
          className="pl-8"
        />
      </div>

      <Select
        value={filters.severity ?? "all"}
        onValueChange={(v) => setFilters({ ...filters, severity: v === "all" ? undefined : (v as Severity) })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All severities</SelectItem>
          {Object.values(Severity).map((s) => (
            <SelectItem key={s} value={s} className="capitalize">
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type ?? "all"}
        onValueChange={(v) => setFilters({ ...filters, type: v === "all" ? undefined : (v as VulnType) })}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {Object.values(VulnType).map((t) => (
            <SelectItem key={t} value={t}>
              {TYPE_LABELS[t]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.cwe ? String(filters.cwe) : "all"}
        onValueChange={(v) => setFilters({ ...filters, cwe: v === "all" ? undefined : Number(v) })}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="CWE" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All CWEs</SelectItem>
          {cwes.map((c) => (
            <SelectItem key={c} value={String(c)}>
              CWE-{c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0">
          <X className="h-3.5 w-3.5 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}
