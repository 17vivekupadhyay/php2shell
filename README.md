# PHP → Shell Academy

A single-page, interactive teaching tool: how a PHP code-execution bug becomes full
shell access, stage by stage — built for defenders, security auditors, and students.

> **For security education and authorized testing only.**

## What it is

One page, one tool — no tabs to dig through:

- **Run the attack** to autoplay through the 5-stage kill chain (injection → function
  detection → shell execution → privilege escalation → persistence), or click any
  stage to jump straight there.
- Each stage shows **what went wrong**, **a real vulnerable-vs-secure PHP code
  example**, and the specific **techniques attackers use** — tap one to see how to
  defend against it.
- Keyboard: arrow keys to move between stages, space to play/pause.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- React 19 + TypeScript (strict mode)
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (Base UI primitives)
- Framer Motion for the kill-chain animation
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
├── app/                  # Single route: /
├── components/
│   ├── KillChain.tsx      # The interactive tool
│   ├── CodeComparison.tsx # Vulnerable/secure split view
│   └── ui/                # shadcn/ui primitives (button, tooltip)
├── hooks/useTheme.ts
├── lib/attack-chain.ts   # All stage/technique/code-example content
└── types/index.ts
```

## License

MIT
