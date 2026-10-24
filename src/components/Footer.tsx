import { ShieldAlert } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/SocialIcons";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <ShieldAlert className="h-3.5 w-3.5 text-red-500" aria-hidden />
          For security education and authorized testing only. © 2026 {SITE_NAME}.
        </div>
        <div className="flex gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <GitHubIcon className="h-4 w-4" /> GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LinkedInIcon className="h-4 w-4" /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
