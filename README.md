# php2shell

An interactive breakdown of **PHP2Shell** — the real, critical PHP vulnerability
(CVE-2026-109618 / CVE-2026-109619) behind the October 2026 "Black October"
incident.

> This is an independent educational write-up, not the original research. It is
> not affiliated with the team that discovered or named the vulnerability.

## What it is

A single page, one interactive timeline — not a multi-tab demo:

- **Play the timeline** to autoplay through 4 stages (Disclosure → The Flaw →
  Blast Radius → The Fix), or click any stage to jump straight there.
- **The Flaw** breaks the two CVEs into individually expandable cards, each with
  an animated, redacted request-sequence visualization showing the shape of the
  exploit (method, path, what happens server-side) without reproducing a working
  trigger.
- **The Fix** shows a real vulnerable-vs-secure comparison of what being
  unpatched vs. patched actually looks like in a Dockerfile/composer.json.
- Every claim is sourced — see the citations list at the bottom of the page.

### What this deliberately does *not* include

Both CVEs were under active in-the-wild exploitation at the time this was
built. The technical mechanism described here is paraphrased at a conceptual
level from the original researchers' public write-up (linked in-app), not
copied from it — and it stops short of the source's own exploit-construction
detail (heap grooming, ASLR bypass, the final RCE primitive). This is an
explainer, not a working proof-of-concept.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- React 19 + TypeScript (strict mode)
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (Base UI primitives)
- Framer Motion for the animated terminal, request sequences, and diagrams
- react-syntax-highlighter (Prism) for the code comparisons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/                           # Single route: /
├── components/
│   ├── RealWorldAlert.tsx          # Top-level summary + sources + guidance
│   ├── RealWorldKillChain.tsx      # The 4-stage interactive timeline
│   ├── TerminalPanel.tsx           # Typewriter-animated terminal
│   ├── ExploitFlowDiagram.tsx      # Attacker → server packet animation
│   ├── MemoryStateDiagram.tsx      # Abstract 4-step bug-pattern visualization
│   ├── RequestExploitAnimation.tsx # Animated, redacted request sequence
│   ├── CodeComparison.tsx          # Vulnerable/secure split view
│   └── ui/                         # shadcn/ui primitives (button, tooltip)
├── hooks/useTheme.ts
└── lib/
    ├── real-world-kill-chain.ts    # All stage/technique/request content
    └── real-world-alert.ts         # Summary, patch guidance, citations
```

## License

MIT
