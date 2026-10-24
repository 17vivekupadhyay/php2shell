export interface IncidentTechnique {
  id: string;
  name: string;
  detail: string;
  defense: string;
}

export interface IncidentStage {
  id: string;
  order: number;
  title: string;
  shortLabel: string;
  detail: string;
  /** Narrated log-style lines — events and conceptual mechanism, never a reproducible trigger/payload. */
  logLines: string[];
  colorFrom: string;
  colorTo: string;
  /** The two CVEs broken out as individually expandable cards, at this stage. */
  techniques?: IncidentTechnique[];
  /** Honest, non-exploit code: what being unpatched vs. patched actually looks like in your infra. */
  example?: {
    vulnerable: string;
    secure: string;
    language?: string;
  };
}

export const REAL_WORLD_STAGES: IncidentStage[] = [
  {
    id: "disclosure",
    order: 1,
    title: "Emergency Disclosure",
    shortLabel: "Disclosure",
    detail:
      "On October 21, 2026, the PHP project shipped out-of-band patches for two critical core vulnerabilities after reports that exploitation was already happening in the wild. Security teams worldwide moved into emergency-patch mode within hours.",
    logLines: [
      "[2026-10-21 09:14 UTC] php.net: emergency release — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35",
      "[2026-10-21 11:02 UTC] first public reports of active exploitation attempts",
      "[2026-10-21 14:30 UTC] Cloudflare: inbound probe traffic spikes across edge network",
      "[2026-10-22 02:00 UTC] NSA / UK NCSC issue joint advisory",
    ],
    colorFrom: "#f87171",
    colorTo: "#dc2626",
  },
  {
    id: "the-flaw",
    order: 2,
    title: "Two Unauthenticated RCEs",
    shortLabel: "The Flaw",
    detail:
      "Two distinct bugs, patched together because both sit inside core PHP itself rather than application code — meaning no framework, CMS, or app-level fix can close either one. Tap each CVE below for what's actually known about it.",
    logLines: [
      "[analysis] CVE-2026-109618 — OOM-path memory corruption → RCE (CVSS 9.2)",
      "[analysis] CVE-2026-109619 — stale global-state reuse → RCE (CVSS 9.2)",
      "[note] exploit trigger details withheld — both under active exploitation at disclosure",
    ],
    colorFrom: "#fb923c",
    colorTo: "#ea580c",
    techniques: [
      {
        id: "cve-109618",
        name: "CVE-2026-109618 — OOM-path memory corruption",
        detail:
          "When core PHP's memory allocator hits an out-of-memory condition along a specific internal code path, the cleanup/error-handling logic itself corrupts memory rather than failing safely. That corruption can be steered to redirect program execution — unauthenticated, over the network, no application code involved.",
        defense: "No app-level mitigation exists. Upgrade to 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 — this is a core interpreter fix, not a config change.",
      },
      {
        id: "cve-109619",
        name: "CVE-2026-109619 — stale global-state reuse",
        detail:
          "PHP-FPM keeps long-lived worker processes alive across many requests for performance. This bug lets state left behind by one request — in global/static memory — be reached and manipulated by a completely unrelated later request on the same worker.",
        defense: "Same fix as above: upgrade PHP. Restarting workers between requests is not a realistic mitigation at scale and isn't officially endorsed as one.",
      },
    ],
  },
  {
    id: "blast-radius",
    order: 3,
    title: "Why It Spread So Fast",
    shortLabel: "Blast Radius",
    detail:
      "There is no configuration-only workaround — upgrading PHP itself is the only fix. PHP powers roughly 70–77% of server-side websites, and because the bug lives in the interpreter rather than a plugin or library, it hit WordPress installs, custom enterprise apps, and everything between at the same time. Multiple governments and major platforms took services offline as a precaution while patching.",
    logLines: [
      "[impact] ~70-77% of public web servers run PHP",
      "[impact] Wikipedia, Internet Archive briefly taken offline as a precaution",
      "[impact] 300+ government sites audited in Pakistan alone",
      "[impact] advisories issued: NSA, UK NCSC, Japan PM's office",
    ],
    colorFrom: "#fbbf24",
    colorTo: "#d97706",
  },
  {
    id: "the-fix",
    order: 4,
    title: "Patch Status",
    shortLabel: "The Fix",
    detail:
      "Fixes landed the same day across every supported branch. PHP 8.1 and earlier — already end-of-life — did not get an official upstream patch, so hosts still running those need to migrate to a supported branch, not just apply a patch. The only real fix is the version itself; here's what that looks like in practice.",
    logLines: [
      "[fix] PHP 8.5.12 — patched",
      "[fix] PHP 8.4.27 — patched",
      "[fix] PHP 8.3.36 — patched",
      "[fix] PHP 8.2.35 — patched",
      "[eol] PHP ≤8.1 — no upstream fix; migrate off end-of-life branches",
    ],
    colorFrom: "#4ade80",
    colorTo: "#16a34a",
    example: {
      language: "dockerfile",
      vulnerable: `# Dockerfile
FROM php:8.3-fpm
# Floating tag — silently rebuilds on whatever 8.3.x patch
# release existed when the image was last pulled. If that
# was before Oct 21 2026, you're still exposed.`,
      secure: `# Dockerfile
FROM php:8.3.36-fpm
# Pinned to the patched release (or newer). Rebuild and
# redeploy — a floating tag alone does not retroactively
# patch a container that's already running.

# composer.json
# "config": { "platform": { "php": "8.3.36" } }
# forces CI/local installs to match, catching drift early.`,
    },
  },
];
