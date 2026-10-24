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
      "Both bugs were found by security firm Calif, working with OpenAI and Wiz as part of OpenAI's \"Patch the Planet\" initiative — an AI-assisted audit effort the PHP Foundation (via Volker Dusch) opted into. On October 21, 2026, PHP shipped out-of-band patches for both, coordinated with disclosure. Exploitation in the wild began within hours regardless.",
    logLines: [
      "[2026-07-30 UTC] Calif + OpenAI + Wiz begin coordinated PHP audit w/ PHP Foundation",
      "[2026-08-01 UTC] first exploitable OOM-fatal surfaced within days of starting",
      "[2026-10-21 09:14 UTC] php.net: emergency release — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35",
      "[2026-10-21 11:02 UTC] first public reports of active exploitation attempts",
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
      "The root cause is one general pattern, exploited two different ways. Deep in PHP's internals, some operations mark a piece of memory as \"ready to use\" before they've actually finished setting it up. If an out-of-memory error interrupts that exact window, PHP's own cleanup code — which runs even during a fatal — ends up trusting and acting on a half-built, not-fully-initialized piece of state. That's the whole bug, expressed two ways against two different PHP deployment modes. Tap each one below.",
    logLines: [
      "[analysis] root cause — a value is marked 'ready' before it's fully initialized",
      "[analysis] an out-of-memory fatal at that exact moment skips the rest of setup",
      "[analysis] PHP's own cleanup code still trusts and acts on the half-built value",
      "[note] exploitation specifics withheld — see cited research for the full technical writeup",
    ],
    colorFrom: "#fb923c",
    colorTo: "#ea580c",
    techniques: [
      {
        id: "modphp-path",
        name: "Apache / mod_php — dangling request-variable entry",
        detail:
          "A specially crafted file-upload request can push PHP's memory usage past its configured limit while the request body itself stays small, by exploiting how PHP expands deeply nested form-field names into many internal lookup-table entries. If that memory limit is hit at exactly the moment PHP is registering one of those entries, the entry is left half-built — but PHP's internal bookkeeping already counted it as valid. When the request ends, PHP's normal teardown logic processes that half-built entry as if it were real, which an attacker can turn into code execution.",
        defense: "No app-level mitigation exists — this is inside the interpreter. Upgrade to 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35.",
      },
      {
        id: "fpm-path",
        name: "PHP-FPM — stale session state reused across requests",
        detail:
          "PHP-FPM keeps worker processes alive across many requests for performance, and its \"upload progress\" feature can start tracking a session before the rest of PHP has finished initializing for that request. If a request is interrupted at just the right point, PHP frees that request's memory but leaves global pointers still referencing it — and because the worker survives, a second, unrelated request can reach those dangling pointers through the same upload-progress feature and cause PHP to treat freed memory as live data again.",
        defense: "Same fix: upgrade PHP. Disabling session.upload_progress may reduce exposure to the related issue, but the researchers are clear it isn't a substitute for patching.",
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
