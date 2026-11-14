"use client";

import { useMemo, useState } from "react";
import { TOOL_CATEGORIES, searchTools, type Tool, type ToolCategory } from "@/lib/tools";
import { Icon } from "./Icon";
import { ToolCard } from "./ToolCard";

export function ToolDirectory({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory | "All">("All");

  const results = useMemo(() => searchTools(tools, query, category), [tools, query, category]);
  const filters: (ToolCategory | "All")[] = ["All", ...TOOL_CATEGORIES];

  const reset = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="relative">
          <label htmlFor="tool-search" className="sr-only">
            Search tools
          </label>
          <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools, e.g. bio, hashtags, YouTube"
            className="input !py-3 pl-11"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                category === item
                  ? "border-violet-400/60 bg-violet-500/20 text-white"
                  : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500" aria-live="polite">
        {results.length} {results.length === 1 ? "tool" : "tools"} found
      </p>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="card mx-auto mt-6 max-w-md p-8 text-center">
          <p className="font-medium text-white">No tools match your search</p>
          <p className="mt-1 text-sm text-slate-400">Try a different keyword or clear the filters.</p>
          <button type="button" onClick={reset} className="btn-secondary mt-5">
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
