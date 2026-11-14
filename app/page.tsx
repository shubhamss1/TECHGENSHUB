import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Icon, type IconName } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { ToolDirectory } from "@/components/ToolDirectory";
import { TOOLS } from "@/lib/tools";

const VALUES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "sparkles",
    title: "Free to start",
    body: "Core tools are free to use. Free tools are supported by advertising.",
  },
  {
    icon: "check",
    title: "Private by design",
    body: "The Instagram Bio Generator runs entirely in your browser. What you type is not sent to a server.",
  },
  {
    icon: "play",
    title: "Premium on the way",
    body: "A premium membership is planned for creators who want more. Details will be shared on the pricing page.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="tools" className="container-page scroll-mt-20 py-16">
        <SectionHeading
          eyebrow="Tool directory"
          title="Find the right tool"
          subtitle="Search by name or filter by platform. One tool is live today and more are on the way."
        />
        <div className="mt-10">
          <ToolDirectory tools={TOOLS} />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((item) => (
            <div key={item.title} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-8">
        <div className="card relative overflow-hidden p-8 text-center sm:p-12">
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-transparent to-electric-500/15" />
          <h2 className="relative text-3xl font-bold">Ready to write a better bio?</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-slate-400">Pick a tone, add a few keywords and get ideas in seconds.</p>
          <Link href="/tools/instagram-bio-generator" className="btn-primary relative mt-6">
            Open the Bio Generator <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
