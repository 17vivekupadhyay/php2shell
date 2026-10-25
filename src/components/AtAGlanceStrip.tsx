import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";

export function AtAGlanceStrip() {
  const a = REAL_WORLD_ALERT;
  const items = [
    { label: "CVEs", value: "2" },
    { label: "Auth required", value: "None" },
    { label: "Deployment modes hit", value: "5" },
    { label: "Fixed versions", value: "4" },
    { label: "CVSS", value: a.cvss.split(" ")[0] },
  ];

  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-5xl overflow-x-auto px-4">
        <div className="flex divide-x divide-border">
          {items.map((item) => (
            <div key={item.label} className="flex min-w-[110px] flex-1 flex-col gap-0.5 px-3 py-3 sm:px-4">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="font-heading text-lg font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
