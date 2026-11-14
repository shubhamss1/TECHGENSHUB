import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description: "About TECHGENSHUB and the Creator Toolkit.",
};

const PRINCIPLES = [
  {
    title: "Useful first",
    body: "Each tool should save a creator real time, and work without a sign-up.",
  },
  {
    title: "Respect your data",
    body: "The Instagram Bio Generator runs in your browser with local templates. Nothing you type is sent to a server or an AI service.",
  },
  {
    title: "Built for everyone",
    body: "TECHGENSHUB is designed for creators in India and around the world.",
  },
];

export default function AboutPage() {
  return (
    <section className="container-page py-16">
      <SectionHeading eyebrow="About" title="TECHGENSHUB Creator Toolkit" subtitle="Free tools to help creators publish more and grow faster." />

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
        {PRINCIPLES.map((item) => (
          <div key={item.title} className="card p-6">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="card mx-auto mt-8 max-w-4xl p-8">
        <h3 className="text-lg font-semibold">What’s next</h3>
        <p className="mt-2 text-sm text-slate-400">
          More tools for Instagram, YouTube and content planning are on the roadmap, along with a premium membership. The tool directory shows what is live and what is coming soon.
        </p>
        <Link href="/tools" className="btn-primary mt-6">
          Browse tools
        </Link>
      </div>
    </section>
  );
}
