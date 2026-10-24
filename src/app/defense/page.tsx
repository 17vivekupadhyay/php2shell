import type { Metadata } from "next";
import { DefenseChecklist } from "@/components/DefenseChecklist";

export const metadata: Metadata = {
  title: "Defense Checklist — PHP → Shell Academy",
  description: "Interactive hardening checklist covering php.ini, input validation, uploads, web server config, and least privilege.",
};

export default function DefensePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Defense Checklist</h1>
      <p className="text-muted-foreground mb-8">
        Work through each section to harden a PHP deployment. Your progress is saved on this
        device, and you can export a markdown hardening report at any time.
      </p>
      <DefenseChecklist />
    </div>
  );
}
