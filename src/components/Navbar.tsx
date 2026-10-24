"use client";

import Link from "next/link";
import { Terminal, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/SocialIcons";
import { SITE_NAME, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";
import { useTheme } from "@/hooks/useTheme";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-4xl items-center gap-2 px-4">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold tracking-tight">
          <Terminal className="h-5 w-5 text-php" aria-hidden />
          {SITE_NAME}
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="GitHub"
            nativeButton={false}
            render={<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" />}
          >
            <GitHubIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="LinkedIn"
            nativeButton={false}
            render={<a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" />}
          >
            <LinkedInIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
