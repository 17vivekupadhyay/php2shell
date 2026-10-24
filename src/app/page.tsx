import { ShieldAlert } from "lucide-react";
import { KillChain } from "@/components/KillChain";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-php/40 bg-php/10 px-3 py-1 text-xs font-medium text-php-light">
          <ShieldAlert className="h-3.5 w-3.5" /> For defenders, auditors &amp; students
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
          PHP <span className="text-php">→</span> Shell
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          How a PHP bug becomes full shell access, stage by stage. Hit play, or click
          straight to the stage you care about — each one has a real code example and
          the fix.
        </p>
      </div>

      <KillChain />
    </div>
  );
}
