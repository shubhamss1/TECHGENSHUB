import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { Icon } from "./Icon";

export function ToolCard({ tool }: { tool: Tool }) {
  const live = tool.status === "live";
  return (
    <Link href={`/tools/${tool.slug}`} className="card card-hover group flex h-full flex-col p-5">
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-electric-500/20 text-violet-300 ring-1 ring-white/10">
          <Icon name={tool.icon} />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            live ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-slate-400"
          }`}
        >
          {live ? "Live" : "Coming soon"}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{tool.name}</h3>
      <p className="mt-1.5 flex-1 text-sm text-slate-400">{tool.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">{tool.category}</span>
        <span className="inline-flex items-center gap-1 font-medium text-electric-400 transition group-hover:gap-2">
          {live ? "Open tool" : "Learn more"} <Icon name="arrow-right" size={14} />
        </span>
      </div>
    </Link>
  );
}
