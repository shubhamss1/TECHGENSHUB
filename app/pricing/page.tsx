import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free creator tools today, with a premium membership planned.",
};

const FREE = [
  "Access to every live tool",
  "No account required",
  "Supported by advertising",
];

const PREMIUM = [
  "Ad-free experience",
  "Higher usage limits",
  "Saved history",
  "Early access to new tools",
];

export default function PricingPage() {
  return (
    <section className="container-page py-16">
      <SectionHeading
        eyebrow="Pricing"
        title="Free today. Premium planned."
        subtitle="Use the tools for free now. Premium membership features below are planned, not yet available."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="card flex flex-col p-8">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-1 text-sm text-slate-400">Everything that is live today.</p>
          <p className="mt-6 font-display text-4xl font-bold text-white">₹0</p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {FREE.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Icon name="check" size={16} className="text-emerald-400" /> {item}
              </li>
            ))}
          </ul>
          <Link href="/tools" className="btn-primary mt-8">
            Start with free tools
          </Link>
        </div>

        <div className="card relative flex flex-col border-violet-400/30 p-8">
          <span className="absolute right-6 top-6 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-200">
            Coming soon
          </span>
          <h3 className="text-xl font-semibold">Premium</h3>
          <p className="mt-1 text-sm text-slate-400">Planned membership for power users.</p>
          <p className="mt-6 font-display text-2xl font-bold text-white">Pricing to be announced</p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {PREMIUM.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Icon name="sparkles" size={16} className="text-violet-300" /> {item}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn-secondary mt-8">
            Read our plans
          </Link>
        </div>
      </div>
    </section>
  );
}
