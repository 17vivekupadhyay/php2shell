import type { Metadata } from "next";
import { PayloadSimulator } from "@/components/PayloadSimulator";

export const metadata: Metadata = {
  title: "Payload Simulator — PHP → Shell Academy",
  description: "Build an injection-point and sink scenario and see a fully simulated, illustrative payload and output.",
};

export default function SimulatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Payload Simulator</h1>
      <p className="text-muted-foreground mb-8">
        Pick an injection point and a target function to see how an attack chain comes together
        — and what a vulnerable snippet, generated payload, and resulting output would look like.
      </p>
      <PayloadSimulator />
    </div>
  );
}
