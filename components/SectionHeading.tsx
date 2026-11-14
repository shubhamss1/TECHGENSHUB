interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-400">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
    </div>
  );
}
