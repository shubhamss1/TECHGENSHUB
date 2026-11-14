import type { ReactNode } from "react";
import { POLICY_UPDATED } from "@/lib/site";

interface Props {
  title: string;
  intro?: string;
  showUpdated?: boolean;
  children: ReactNode;
}

/** Shared layout for text-heavy pages (privacy, terms, contact). */
export function LegalPage({ title, intro, showUpdated = true, children }: Props) {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {showUpdated && <p className="mt-2 text-sm text-slate-500">Last updated: {POLICY_UPDATED}</p>}
        {intro && <p className="mt-4 text-slate-400">{intro}</p>}
        <div className="mt-8 space-y-4 leading-relaxed text-slate-300 [&_a]:text-electric-400 [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </section>
  );
}
