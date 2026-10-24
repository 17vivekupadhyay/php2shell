/**
 * Factual summary of the real October 2026 "PHP2Shell" vulnerability disclosure
 * (CVE-2026-109618 / CVE-2026-109619), cross-checked directly against PHP's own
 * security advisory (php.net/archive/2026.php#2026-10-21-5) plus the original
 * researchers' public write-up (calif.io/php2shell) and vendor coverage. The
 * mechanism described here is paraphrased at a conceptual/architectural level,
 * not copied from any source — and deliberately stops short of the researchers'
 * own exploit-construction detail (heap grooming, ASLR bypass, final RCE
 * primitive), since both CVEs were under active in-the-wild exploitation at
 * time of writing. Read the full technical build-up at the cited sources.
 */

export interface RealWorldSource {
  title: string;
  publisher: string;
  url: string;
  /** True for the vulnerability's own authoritative source (not secondary coverage). */
  primary?: boolean;
}

export const REAL_WORLD_ALERT = {
  name: "PHP2Shell",
  cves: ["CVE-2026-109618", "CVE-2026-109619"],
  ghsa: ["GHSA-w8hw-w9fx-j79w", "GHSA-6wmf-4rv5-p3rp"],
  cvss: "9.2 (CVSS 4.0) — both unauthenticated remote code execution",
  disclosedDate: "October 21, 2026, 14:00 UTC",
  atRisk:
    "All PHP installations serving web requests — PHP-FPM, Apache with mod_php, php-cgi, FrankenPHP, and LiteSpeed. Risk is highest for mod_php: PHP's own advisory describes a demonstrated exploit where an unauthenticated request triggers the attack before any application code runs.",
  summary:
    "On October 21, 2026, the PHP project shipped emergency fixes for two critical, unauthenticated remote-code-execution vulnerabilities, found by security firm Calif working with OpenAI and Wiz alongside the PHP Foundation. Both bugs trace back to the same root cause — PHP marking internal memory as ready-to-use before fully initializing it, exploitable when an out-of-memory error interrupts that exact window — expressed two different ways against Apache/mod_php and PHP-FPM respectively. Both were reported as under active exploitation shortly after disclosure, part of a wider cluster of October 2026 incidents the industry nicknamed \"Black October.\" Multiple governments and major sites took services offline as a precaution while patching.",
  patchedVersions: ["PHP 8.5.12", "PHP 8.4.27", "PHP 8.3.36", "PHP 8.2.35"],
  guidance: [
    "Upgrade to a patched release immediately — PHP's own advisory is explicit that only an update is a complete fix; everything else below just narrows exposure.",
    "PHP 8.1 and earlier no longer receive regular updates, but given the severity, the PHP security team released minimal source-backports for 7.4, 8.0, and 8.1 — if you're on an unsupported branch, ask your distro/LTS vendor or build from those backports rather than assuming you have no option but a full migration.",
    "PHP 8.2 specifically reaches end-of-life on December 31, 2026 — plan that migration now regardless of this incident.",
    "Treat any host that was internet-facing and unpatched between Oct 21–24, 2026 as potentially compromised, not just vulnerable — audit it, don't just patch it.",
  ],
  sources: [
    {
      title: "Security advisory: Critical remote code execution vulnerabilities, update now",
      publisher: "php.net (official)",
      url: "https://www.php.net/archive/2026.php#2026-10-21-5",
      primary: true,
    },
    { title: "PHP2Shell: A tale of two PHP remote vulnerabilities (original research)", publisher: "Calif Research", url: "https://calif.io/php2shell/" },
    { title: "PHP2Shell explained in 10 minutes (technical analysis)", publisher: "Aikido Security & PinkDraconian", url: "https://www.youtube.com/watch?v=K8EXJIDk-K4" },
    { title: "PHP2Shell: Critical PHP RCE Flaws, Affected Versions, and How to Fix Them", publisher: "SOCRadar", url: "https://socradar.io/blog/php2shell-cve-2026-109618-cve-2026-109619/" },
    { title: "PHP2Shell CVE-2026-109618 and CVE-2026-109619 PHP RCE Patch Guide", publisher: "TuxCare", url: "https://tuxcare.com/blog/php2shell-cve/" },
    { title: "Responding to core PHP vulnerabilities CVE-2026-109618 and CVE-2026-109619", publisher: "Google Cloud", url: "https://cloud.google.com/blog/products/identity-security/responding-to-core-php-vulnerabilities-cve-2026-109618-cve-2026-109619" },
    { title: "Critical PHP RCE Vulnerabilities: Patch Now", publisher: "DigitalOcean", url: "https://www.digitalocean.com/blog/critical-php-rce-vulnerabilities-patch-now" },
    { title: "PHP2Shell FAQ: CVE-2026-109618 & CVE-2026-109619 Fixes", publisher: "watchTowr", url: "https://watchtowr.com/intelligence/php-cve-2026-109618-faq/" },
  ] satisfies RealWorldSource[],
};
