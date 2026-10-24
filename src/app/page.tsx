import Link from "next/link";
import { ShieldAlert, Terminal, Wrench, ListChecks, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AttackChainVisualizer } from "@/components/AttackChainVisualizer";
import { vulnerabilities } from "@/lib/vulnerabilities";
import { getTotalChecklistItems } from "@/lib/checklist";

const FEATURES = [
  {
    href: "/vulnerabilities",
    icon: ShieldAlert,
    title: "Vulnerability Database",
    description: `${vulnerabilities.length} real-world PHP vulnerability patterns with vulnerable/secure code side by side.`,
  },
  {
    href: "/simulator",
    icon: Terminal,
    title: "Payload Simulator",
    description: "Build an injection-point + sink scenario and see an illustrative, fully simulated payload and output.",
  },
  {
    href: "/defense",
    icon: ListChecks,
    title: "Defense Checklist",
    description: `${getTotalChecklistItems()} hardening steps across php.ini, uploads, web server, and least-privilege setup.`,
  },
  {
    href: "/resources",
    icon: Wrench,
    title: "Resources",
    description: "Curated links to OWASP, CWE, and further reading for defenders and auditors.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-slate-950 to-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
            <ShieldAlert className="h-3.5 w-3.5" /> For defenders, auditors &amp; students
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-white">
            PHP <span className="text-red-500">→</span> Shell Academy
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Understand how PHP code-execution bugs escalate into full shell access — and exactly
            how to stop every stage of that chain.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/vulnerabilities" />}>
              Explore Vulnerabilities <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/defense" />}>
              View Defense Checklist
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold mb-2">The Attack Chain</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Most real-world PHP compromises follow the same five stages. Click through each one to
          see the techniques attackers use — and where defenders should focus.
        </p>
        <AttackChainVisualizer />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 border-t border-border">
        <h2 className="text-2xl font-semibold mb-8">What&apos;s inside</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href}>
              <Card className="h-full transition-colors hover:border-foreground/30">
                <CardContent className="pt-6">
                  <f.icon className="h-6 w-6 text-red-500 mb-3" aria-hidden />
                  <h3 className="font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
