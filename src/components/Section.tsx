import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  description,
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="border-b border-border py-10 sm:py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-5 max-w-2xl">
          <div className="label-console mb-1.5">{eyebrow}</div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">{title}</h2>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
