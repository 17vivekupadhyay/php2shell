import { Hero } from "@/components/Hero";
import { AtAGlanceStrip } from "@/components/AtAGlanceStrip";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { RealWorldKillChain } from "@/components/RealWorldKillChain";
import { MemoryStateDiagram } from "@/components/MemoryStateDiagram";
import { PatchResponseSection } from "@/components/PatchResponseSection";
import { PatchChecklist } from "@/components/PatchChecklist";
import { UnderstandingCheck } from "@/components/UnderstandingCheck";
import { SourcesSection } from "@/components/SourcesSection";
import { Section } from "@/components/Section";
import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";

export default function HomePage() {
  const a = REAL_WORLD_ALERT;

  return (
    <div>
      <Hero />
      <AtAGlanceStrip />

      <Section eyebrow="Architecture" title="Two affected paths" description={a.atRisk}>
        <div className="border border-border p-5">
          <ArchitectureDiagram />
        </div>
      </Section>

      <Section eyebrow="Incident timeline" title="What actually happened" description={a.summary}>
        <div className="border border-border p-4 sm:p-5">
          <RealWorldKillChain />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This timeline covers public events and the conceptual mechanism only — no exploit trigger or payload
          details are included, since both CVEs were under active exploitation at the time this was written.
        </p>
      </Section>

      <Section eyebrow="Root cause" title="How the state becomes unsafe">
        <div className="border border-border p-5">
          <MemoryStateDiagram active runKey="root-cause" />
        </div>
      </Section>

      <Section eyebrow="Response" title="What should I do?">
        <PatchResponseSection />
      </Section>

      <Section eyebrow="Verification" title="Am I actually patched?">
        <PatchChecklist />
      </Section>

      <Section eyebrow="Knowledge check" title="Check your understanding">
        <UnderstandingCheck />
      </Section>

      <Section eyebrow="References" title="Sources & further reading">
        <SourcesSection />
      </Section>
    </div>
  );
}
