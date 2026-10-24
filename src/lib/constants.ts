export const SITE_NAME = "PHP → Shell Academy";
export const SITE_TAGLINE =
  "Understanding how PHP code execution escalates to shell access — for defenders, auditors, and students.";

export const NAV_LINKS = [
  { href: "/", label: "Overview" },
  { href: "/vulnerabilities", label: "Vulnerabilities" },
  { href: "/simulator", label: "Simulator" },
  { href: "/defense", label: "Defense" },
  { href: "/resources", label: "Resources" },
] as const;

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-600 text-white border-red-700",
  high: "bg-orange-500 text-white border-orange-600",
  medium: "bg-yellow-500 text-black border-yellow-600",
  low: "bg-blue-500 text-white border-blue-600",
};

export const SEVERITY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

export const COLORS = {
  primary: "#1e293b",
  danger: "#dc2626",
  success: "#16a34a",
  codeBg: "#0f172a",
};
