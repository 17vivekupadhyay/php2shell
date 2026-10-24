import type { Metadata } from "next";
import { VulnerabilityList } from "@/components/VulnerabilityList";

export const metadata: Metadata = {
  title: "Vulnerability Database — PHP → Shell Academy",
  description: "Searchable database of real-world PHP vulnerability patterns with vulnerable/secure code comparisons.",
};

export default function VulnerabilitiesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Vulnerability Database</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Search and filter real-world PHP vulnerability patterns. Each entry includes vulnerable
        and secure code side by side, an explanation of why it&apos;s exploitable, and concrete
        mitigations.
      </p>
      <VulnerabilityList />
    </div>
  );
}
