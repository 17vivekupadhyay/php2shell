import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Resources — PHP → Shell Academy",
  description: "Curated links to OWASP, CWE, and further reading on PHP security.",
};

const RESOURCE_GROUPS = [
  {
    title: "Standards & Classification",
    links: [
      { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
      { title: "CWE Top 25 Most Dangerous Software Weaknesses", url: "https://cwe.mitre.org/top25/" },
      { title: "CWE — Common Weakness Enumeration", url: "https://cwe.mitre.org/" },
      { title: "CVE — Common Vulnerabilities and Exposures", url: "https://www.cve.org/" },
    ],
  },
  {
    title: "OWASP Cheat Sheets",
    links: [
      { title: "Input Validation Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html" },
      { title: "File Upload Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" },
      { title: "Deserialization Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html" },
      { title: "SSRF Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html" },
      { title: "XXE Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html" },
      { title: "Session Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" },
    ],
  },
  {
    title: "PHP Official Documentation",
    links: [
      { title: "PHP Manual: Security", url: "https://www.php.net/manual/en/security.php" },
      { title: "PHP Manual: disable_functions", url: "https://www.php.net/manual/en/ini.core.php#ini.disable-functions" },
      { title: "PHP Manual: escapeshellarg()", url: "https://www.php.net/manual/en/function.escapeshellarg.php" },
      { title: "PHP Manual: random_bytes()", url: "https://www.php.net/manual/en/function.random-bytes.php" },
    ],
  },
  {
    title: "Further Reading",
    links: [
      { title: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
      { title: "PayloadsAllTheThings (GitHub)", url: "https://github.com/swisskyrepo/PayloadsAllTheThings" },
      { title: "WPScan Vulnerability Database", url: "https://wpscan.com/vulnerabilities/" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Resources</h1>
      <p className="text-muted-foreground mb-8">
        External references for going deeper on any topic covered in this academy.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {RESOURCE_GROUPS.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="text-base">{group.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 text-sm text-blue-500 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
