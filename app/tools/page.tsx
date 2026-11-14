import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ToolDirectory } from "@/components/ToolDirectory";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools",
  description: "Browse free creator tools for Instagram, YouTube and content planning.",
};

export default function ToolsPage() {
  return (
    <section className="container-page py-16">
      <SectionHeading eyebrow="Tools" title="Creator tools" subtitle="Search the full directory and open a tool to get started." />
      <div className="mt-10">
        <ToolDirectory tools={TOOLS} />
      </div>
    </section>
  );
}
