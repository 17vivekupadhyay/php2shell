/**
 * Factual summary of the real October 2026 "PHP2Shell" vulnerability disclosure
 * (CVE-2026-109618 / CVE-2026-109619), compiled from vendor security advisories
 * and news coverage. This is NOT a technical reproduction of the exploit — no
 * trigger conditions or payload details are included, since both CVEs were
 * under active in-the-wild exploitation at time of writing. It exists to give
 * accurate, sourced context, clearly separated from this site's illustrative
 * teaching simulation below.
 */

export interface RealWorldSource {
  title: string;
  publisher: string;
  url: string;
}

export const REAL_WORLD_ALERT = {
  name: "PHP2Shell",
  cves: ["CVE-2026-109618", "CVE-2026-109619"],
  cvss: "9.2 (CVSS 4.0) — both unauthenticated remote code execution",
  disclosedDate: "October 21, 2026",
  summary:
    "On October 21, 2026, the PHP project shipped emergency fixes for two critical, unauthenticated remote-code-execution vulnerabilities: CVE-2026-109618 (memory corruption triggered during out-of-memory handling) and CVE-2026-109619 (remote code execution via stale global state). Both were reported as under active exploitation shortly after disclosure, part of a wider cluster of October 2026 incidents the industry nicknamed \"Black October.\" Multiple governments and major sites took services offline as a precaution while patching.",
  patchedVersions: ["PHP 8.5.12", "PHP 8.4.27", "PHP 8.3.36", "PHP 8.2.35"],
  guidance: [
    "Upgrade to a patched release immediately — there is no configuration-only mitigation for either CVE.",
    "PHP 8.1 and earlier are end-of-life and did not receive an official upstream fix; if you're still on one, you need to migrate to a supported branch, not just patch.",
    "Check your hosting provider / distro package manager for backports if you can't upgrade the PHP branch itself right away.",
    "Treat any host that was internet-facing and unpatched between Oct 21–24, 2026 as potentially compromised, not just vulnerable — audit it, don't just patch it.",
  ],
  sources: [
    { title: "PHP2Shell: Critical PHP RCE Flaws, Affected Versions, and How to Fix Them", publisher: "SOCRadar", url: "https://socradar.io/blog/php2shell-cve-2026-109618-cve-2026-109619/" },
    { title: "PHP2Shell CVE-2026-109618 and CVE-2026-109619 PHP RCE Patch Guide", publisher: "TuxCare", url: "https://tuxcare.com/blog/php2shell-cve/" },
    { title: "Responding to core PHP vulnerabilities CVE-2026-109618 and CVE-2026-109619", publisher: "Google Cloud", url: "https://cloud.google.com/blog/products/identity-security/responding-to-core-php-vulnerabilities-cve-2026-109618-cve-2026-109619" },
    { title: "Critical PHP RCE Vulnerabilities: Patch Now", publisher: "DigitalOcean", url: "https://www.digitalocean.com/blog/critical-php-rce-vulnerabilities-patch-now" },
    { title: "PHP2Shell FAQ: CVE-2026-109618 & CVE-2026-109619 Fixes", publisher: "watchTowr", url: "https://watchtowr.com/intelligence/php-cve-2026-109618-faq/" },
  ] satisfies RealWorldSource[],
};
