/**
 * Factual summary of the real October 2026 "PHP2Shell" vulnerability disclosure
 * (CVE-2026-109618 / CVE-2026-109619), compiled from the original researchers'
 * public write-up (calif.io/php2shell) plus vendor advisories and news coverage.
 * The mechanism described here is paraphrased at a conceptual/architectural
 * level, not copied from the source — and deliberately stops short of the
 * source's own exploit-construction detail (heap grooming, ASLR bypass, final
 * RCE primitive), since both CVEs were under active in-the-wild exploitation
 * at time of writing. Read the full technical build-up at the cited source.
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
    "On October 21, 2026, the PHP project shipped emergency fixes for two critical, unauthenticated remote-code-execution vulnerabilities, found by security firm Calif working with OpenAI and Wiz alongside the PHP Foundation. Both bugs trace back to the same root cause — PHP marking internal memory as ready-to-use before fully initializing it, exploitable when an out-of-memory error interrupts that exact window — expressed two different ways against Apache/mod_php and PHP-FPM respectively. Both were reported as under active exploitation shortly after disclosure, part of a wider cluster of October 2026 incidents the industry nicknamed \"Black October.\" Multiple governments and major sites took services offline as a precaution while patching.",
  patchedVersions: ["PHP 8.5.12", "PHP 8.4.27", "PHP 8.3.36", "PHP 8.2.35"],
  guidance: [
    "Upgrade to a patched release immediately — there is no configuration-only mitigation for either CVE.",
    "PHP 8.1 and earlier are end-of-life and did not receive an official upstream fix; if you're still on one, you need to migrate to a supported branch, not just patch.",
    "Check your hosting provider / distro package manager for backports if you can't upgrade the PHP branch itself right away.",
    "Treat any host that was internet-facing and unpatched between Oct 21–24, 2026 as potentially compromised, not just vulnerable — audit it, don't just patch it.",
  ],
  sources: [
    { title: "PHP2Shell: A tale of two PHP remote vulnerabilities (original research)", publisher: "Calif Research", url: "https://calif.io/php2shell/" },
    { title: "PHP2Shell explained in 10 minutes (technical analysis)", publisher: "Aikido Security & PinkDraconian", url: "https://www.youtube.com/watch?v=K8EXJIDk-K4" },
    { title: "PHP2Shell: Critical PHP RCE Flaws, Affected Versions, and How to Fix Them", publisher: "SOCRadar", url: "https://socradar.io/blog/php2shell-cve-2026-109618-cve-2026-109619/" },
    { title: "PHP2Shell CVE-2026-109618 and CVE-2026-109619 PHP RCE Patch Guide", publisher: "TuxCare", url: "https://tuxcare.com/blog/php2shell-cve/" },
    { title: "Responding to core PHP vulnerabilities CVE-2026-109618 and CVE-2026-109619", publisher: "Google Cloud", url: "https://cloud.google.com/blog/products/identity-security/responding-to-core-php-vulnerabilities-cve-2026-109618-cve-2026-109619" },
    { title: "Critical PHP RCE Vulnerabilities: Patch Now", publisher: "DigitalOcean", url: "https://www.digitalocean.com/blog/critical-php-rce-vulnerabilities-patch-now" },
    { title: "PHP2Shell FAQ: CVE-2026-109618 & CVE-2026-109619 Fixes", publisher: "watchTowr", url: "https://watchtowr.com/intelligence/php-cve-2026-109618-faq/" },
  ] satisfies RealWorldSource[],
};
