import type { ChecklistSection } from "@/types";

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "php-ini",
    title: "php.ini Hardening",
    description: "Reduce the PHP runtime's attack surface at the configuration level.",
    items: [
      { id: "disable-functions", label: "Set disable_functions for exec, shell_exec, system, passthru, popen, proc_open", description: "Blocks the most common OS command-execution sinks application-wide. Pair with open_basedir — see note below.", priority: "critical", category: "php-ini" },
      { id: "disable-classes", label: "Set disable_classes for unneeded dangerous classes", description: "Restrict reflection-based or filesystem-heavy classes not used by the application.", priority: "medium", category: "php-ini" },
      { id: "open-basedir", label: "Set open_basedir to the application's own directory tree", description: "Confines all filesystem functions to an explicit path, limiting LFI/path-traversal impact even if a flaw exists.", priority: "critical", category: "php-ini" },
      { id: "expose-php-off", label: "Set expose_php = Off", description: "Removes the X-Powered-By header disclosing the PHP version to attackers.", priority: "low", category: "php-ini" },
      { id: "display-errors-off", label: "Set display_errors = Off in production", description: "Prevents stack traces and absolute paths from leaking to end users.", priority: "high", category: "php-ini" },
      { id: "allow-url-include-off", label: "Set allow_url_include = Off", description: "Prevents remote file inclusion (RFI) even if an include()/require() path is attacker-influenced.", priority: "critical", category: "php-ini" },
      { id: "allow-url-fopen-review", label: "Review allow_url_fopen; disable if the app never fetches remote URLs", description: "Reduces SSRF surface area for apps with no legitimate need to open remote streams.", priority: "medium", category: "php-ini" },
      { id: "user-ini-off", label: "Disable .user.ini processing (user_ini.filename = \"\")", description: "Stops attacker-writable directories from overriding php.ini directives per-directory.", priority: "high", category: "php-ini" },
      { id: "session-cookie-flags", label: "Set session.cookie_secure, session.cookie_httponly, session.cookie_samesite", description: "Hardens session cookies against theft via XSS and transmission over plaintext HTTP.", priority: "high", category: "php-ini" },
    ],
  },
  {
    id: "input-validation",
    title: "Input Validation Rules",
    description: "Treat every external input as hostile until proven otherwise.",
    items: [
      { id: "allow-list-validation", label: "Validate against allow-lists, not blacklists", description: "Enumerate what is permitted (known routes, known file extensions, known formats) rather than trying to block every bad pattern.", priority: "critical", category: "input-validation" },
      { id: "parameterized-queries", label: "Use parameterized queries / prepared statements everywhere", description: "Eliminates SQL injection regardless of what characters appear in user input.", priority: "critical", category: "input-validation" },
      { id: "escape-shell-args", label: "Wrap any shell argument with escapeshellarg()", description: "Required whenever shelling out is unavoidable; never trust string concatenation.", priority: "critical", category: "input-validation" },
      { id: "type-strict-compare", label: "Use === and hash_equals() for sensitive comparisons", description: "Avoids PHP type-juggling bypasses on tokens, hashes, and auth checks.", priority: "high", category: "input-validation" },
      { id: "json-not-serialize", label: "Prefer json_encode/decode over serialize/unserialize for untrusted data", description: "Removes the PHP Object Injection attack surface entirely for that data path.", priority: "high", category: "input-validation" },
      { id: "validate-redirects", label: "Validate redirect/forward targets against an allow-list", description: "Prevents open-redirect and SSRF-via-redirect issues.", priority: "medium", category: "input-validation" },
    ],
  },
  {
    id: "file-upload",
    title: "File Upload Restrictions",
    description: "Treat every uploaded file as executable until proven otherwise.",
    items: [
      { id: "validate-content-not-name", label: "Validate file content (magic bytes), not client-supplied name/MIME", description: "The client-supplied filename and Content-Type header are both fully attacker-controlled.", priority: "critical", category: "file-upload" },
      { id: "random-filenames", label: "Generate random server-side filenames on store", description: "Removes attacker control over the stored path and extension entirely.", priority: "critical", category: "file-upload" },
      { id: "store-outside-webroot", label: "Store uploads outside the webroot, or in a no-execute directory", description: "Even a successfully uploaded script can't be requested and executed by the web server.", priority: "critical", category: "file-upload" },
      { id: "cap-upload-size", label: "Enforce strict size and rate limits on uploads", description: "Limits resource-exhaustion and bulk-upload abuse.", priority: "medium", category: "file-upload" },
      { id: "scan-uploads", label: "Scan uploaded files with an AV/heuristic engine where feasible", description: "Adds a detection layer for known web-shell signatures.", priority: "low", category: "file-upload" },
    ],
  },
  {
    id: "webserver",
    title: "Web Server Configuration (nginx / Apache)",
    description: "Make sure the server in front of PHP can't be tricked into executing attacker files.",
    items: [
      { id: "no-php-execute-uploads", label: "Disable PHP execution in uploads/ and any writable directory", description: "nginx: don't map .php to the PHP handler under that location; Apache: php_admin_flag engine off or RemoveHandler in that directory's config.", priority: "critical", category: "webserver" },
      { id: "deny-dotfiles", label: "Deny access to dotfiles (.env, .git, .user.ini)", description: "Prevents direct disclosure of secrets and configuration via the web server.", priority: "high", category: "webserver" },
      { id: "least-priv-process", label: "Run the PHP-FPM/Apache worker as a dedicated, low-privilege user", description: "Limits the blast radius of any successful command execution.", priority: "high", category: "webserver" },
      { id: "readonly-webroot", label: "Mount the webroot read-only; keep writable paths separate", description: "A read-only deployment root means even a successful RCE can't persist a web shell inside it.", priority: "high", category: "webserver" },
      { id: "disable-directory-listing", label: "Disable directory listing (Options -Indexes / autoindex off)", description: "Prevents trivial discovery of unlinked backup files, config dumps, or leftover scripts.", priority: "medium", category: "webserver" },
    ],
  },
  {
    id: "headers",
    title: "Security Headers",
    description: "Defense-in-depth at the HTTP layer.",
    items: [
      { id: "csp-header", label: "Set a restrictive Content-Security-Policy", description: "Limits the damage of any XSS that does slip through, and can restrict egress for injected scripts.", priority: "medium", category: "headers" },
      { id: "x-content-type-options", label: "Set X-Content-Type-Options: nosniff", description: "Stops browsers from MIME-sniffing uploaded files into an executable context.", priority: "medium", category: "headers" },
      { id: "strict-transport-security", label: "Set Strict-Transport-Security with includeSubDomains", description: "Forces HTTPS, protecting session cookies and credentials in transit.", priority: "high", category: "headers" },
      { id: "cors-allow-list", label: "Explicitly allow-list CORS origins; never reflect Origin with credentials", description: "Prevents cross-origin credentialed reads of authenticated API responses.", priority: "high", category: "headers" },
    ],
  },
  {
    id: "least-privilege",
    title: "Least Privilege Setup",
    description: "Assume any single layer can fail; limit what that failure can reach.",
    items: [
      { id: "db-least-priv", label: "Grant the application's DB account only the privileges it needs (no FILE, no SUPER)", description: "Prevents SQL injection from escalating to arbitrary file writes.", priority: "critical", category: "least-privilege" },
      { id: "no-root-cron", label: "Never run application cron jobs or workers as root", description: "Limits the impact of a compromised background job.", priority: "high", category: "least-privilege" },
      { id: "network-segmentation", label: "Segment the app server from internal services it doesn't need to reach", description: "Reduces SSRF and lateral-movement impact if the app server is compromised.", priority: "high", category: "least-privilege" },
      { id: "secrets-outside-webroot", label: "Keep secrets/config (.env, credentials) outside the webroot and out of version control", description: "Limits damage from path traversal or accidental repo exposure.", priority: "critical", category: "least-privilege" },
      { id: "patch-cadence", label: "Maintain a regular patch cadence for PHP, extensions, and dependencies", description: "Most real-world RCE chains rely on a known, already-patched gadget or CVE.", priority: "high", category: "least-privilege" },
    ],
  },
];

export function getTotalChecklistItems(): number {
  return CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0);
}
