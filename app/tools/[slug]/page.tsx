import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { TOOL_COMPONENTS } from "@/components/tools";
import { TOOLS, getToolBySlug } from "@/lib/tools";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool not found" };
  return { title: tool.name, description: tool.description };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = TOOL_COMPONENTS[tool.slug];

  return (
    <div className="container-page py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <Icon name="arrow-right" size={14} className="rotate-180" /> All tools
      </Link>

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-400">{tool.category}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{tool.name}</h1>
        <p className="mt-3 text-slate-400">{tool.description}</p>
      </header>

      <div className="mt-10">
        {ToolComponent ? (
          <ToolComponent />
        ) : (
          <div className="card mx-auto max-w-xl p-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
              <Icon name={tool.icon} />
            </span>
            <h2 className="mt-4 text-xl font-semibold">Coming soon</h2>
            <p className="mt-2 text-slate-400">This tool is not available yet. In the meantime, try the Instagram Bio Generator.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/tools/instagram-bio-generator" className="btn-primary">
                Try the Bio Generator
              </Link>
              <Link href="/tools" className="btn-secondary">
                Browse all tools
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
