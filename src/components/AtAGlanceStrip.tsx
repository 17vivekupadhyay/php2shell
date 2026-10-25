import { REAL_WORLD_ALERT } from "@/lib/real-world-alert";

const ITEMS = [
  { label: "CVEs", value: "2", tone: "critical" as const },
  { label: "Auth required", value: "None", tone: "critical" as const },
  { label: "Deployment modes hit", value: "5", tone: "vulnerable" as const },
  { label: "Fixed versions", value: "4", tone: "safe" as const },
];

export function AtAGlanceStrip() {
  const a = REAL_WORLD_ALERT;

  return (
    <div className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-5xl overflow-x-auto px-4">
        <div className="flex divide-x divide-border">
          {ITEMS.map((item) => (
            <div key={item.label} className="flex min-w-[110px] flex-1 flex-col gap-0.5 px-3 py-3 sm:px-4">
              <span className="label-console">{item.label}</span>
              <span
                className={
                  "font-heading text-lg font-bold " +
                  (item.tone === "critical" ? "text-critical" : item.tone === "vulnerable" ? "text-vulnerable" : "text-safe")
                }
              >
                {item.value}
              </span>
            </div>
          ))}
          <div className="flex min-w-[160px] flex-1 flex-col gap-0.5 px-3 py-3 sm:px-4">
            <span className="label-console">CVSS</span>
            <span className="font-heading text-lg font-bold text-critical">{a.cvss.split(" ")[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
