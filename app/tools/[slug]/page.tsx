import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { TOOL_COMPONENTS } from "@/components/tools";
import { TOOL_GUIDES } from "@/lib/tool-guides";
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
  return {
    title: tool.name,
    description: tool.description,
    // "Coming soon" pages have little content, so keep them out of search results.
    robots: tool.status === "live" ? undefined : { index: false, follow: true },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = TOOL_COMPONENTS[tool.slug];
  const guide = TOOL_GUIDES[tool.slug];

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

      {ToolComponent && guide && (
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-2">
          <section className="card p-6">
            <h2 className="text-xl font-semibold">How to use the {tool.name}</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-300">
              {guide.howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold">Tips for better results</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-300">
              {guide.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="card p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-white/10">
              {guide.faq.map((item) => (
                <details key={item.q} className="group py-3">
                  <summary className="cursor-pointer list-none font-medium text-white marker:content-none">
                    <span className="mr-2 text-electric-400 group-open:hidden">+</span>
                    <span className="mr-2 hidden text-electric-400 group-open:inline">−</span>
                    {item.q}
                  </summary>
                  <p className="mt-2 pl-5 text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
