import { ShieldAlert } from "lucide-react";
import { RealWorldAlert } from "@/components/RealWorldAlert";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
          <ShieldAlert className="h-3.5 w-3.5" /> Live incident · October 2026
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
          PHP <span className="text-red-500">→</span> Shell
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          An interactive walkthrough of PHP2Shell — the real, critical PHP vulnerability
          (CVE-2026-109618 / CVE-2026-109619) behind this month&apos;s &quot;Black October&quot;
          incident. Play the timeline, break down each CVE, and see exactly what patching
          it actually takes.
        </p>
      </div>

      <RealWorldAlert />
    </div>
  );
}
