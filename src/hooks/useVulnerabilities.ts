"use client";

import { useMemo } from "react";
import { vulnerabilities } from "@/lib/vulnerabilities";
import { useStore } from "@/store/useStore";
import type { Vulnerability } from "@/types";

export function useVulnerabilities(): Vulnerability[] {
  const searchQuery = useStore((s) => s.searchQuery);
  const filters = useStore((s) => s.filters);

  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return vulnerabilities.filter((v) => {
      if (filters.severity && v.severity !== filters.severity) return false;
      if (filters.type && v.type !== filters.type) return false;
      if (filters.cwe && v.cwe !== filters.cwe) return false;
      if (filters.tag && !v.tags.includes(filters.tag)) return false;

      if (!q) return true;

      const haystack = [
        v.name,
        v.description,
        v.explanation,
        ...v.tags,
        String(v.cwe),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [searchQuery, filters]);
}
