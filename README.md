# PHP → Shell Academy

An interactive, educational web app explaining how PHP code-execution vulnerabilities
escalate into full shell access — built for defenders, security auditors, and students.

> **For security education and authorized testing only.** The payload simulator never
> executes anything; it only generates illustrative text and hard-coded example output.

## Features

- **Attack Chain Visualizer** — an animated, interactive 5-stage flowchart from injection
  to persistence.
- **Vulnerability Database** — 21 real-world PHP vulnerability patterns (CWE-tagged) with
  searchable/filterable vulnerable-vs-secure code comparisons, explanations, and mitigations.
- **Code Comparison** — syntax-highlighted split-pane view with line numbers and copy buttons.
- **Payload Simulator** — pick an injection point + target function + shell to see a fully
  simulated (never executed) example payload and output.
- **Defense Checklist** — 34 hardening steps across php.ini, input validation, uploads, web
  server config, security headers, and least-privilege setup, with progress saved locally
  and exportable as Markdown.
- **Resources** — curated links to OWASP, CWE, and further reading.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- React 19 + TypeScript (strict mode)
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (Base UI primitives)
- Framer Motion for animation
- Zustand (with persisted checklist state)
- react-syntax-highlighter (Prism)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/                  # Routes: /, /vulnerabilities, /simulator, /defense, /resources
├── components/           # UI components (AttackChainVisualizer, VulnerabilityCard, …)
│   ├── icons/             # Inline brand icons (GitHub/LinkedIn)
│   └── ui/                 # shadcn/ui primitives
├── hooks/                # useVulnerabilities, usePayload, useTheme
├── lib/                  # Static data: vulnerabilities, payloads, attack-chain, checklist
├── store/                # Zustand store
└── types/                # Shared TypeScript types
```

## License

MIT
