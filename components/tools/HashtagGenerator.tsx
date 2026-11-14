"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { parseKeywords } from "@/lib/bio-generator";
import { copyToClipboard } from "@/lib/clipboard";
import {
  PLATFORMS,
  REGIONS,
  TOPIC_MAX,
  generateHashtags,
  validateHashtagInput,
  type HashtagGroup,
  type Platform,
  type Region,
} from "@/lib/hashtag-generator";

export default function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [keywordText, setKeywordText] = useState("");
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [region, setRegion] = useState<Region>("Global");
  const [groups, setGroups] = useState<HashtagGroup[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const allTags = groups.flatMap((group) => group.tags);
  const selectedTags = allTags.filter((tag) => selected.has(tag));

  const run = () => {
    const problem = validateHashtagInput(topic);
    if (problem) {
      setError(problem);
      setNotice(null);
      return;
    }
    setError(null);
    const next = generateHashtags({ topic, keywords: parseKeywords(keywordText), platform, region });
    setGroups(next);
    setSelected(new Set(next.flatMap((group) => group.tags)));
    setCopied(false);
    setNotice(next.length === 0 ? "We couldn’t build hashtags from that topic. Try different words." : null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run();
  };

  const toggle = (tag: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
    setCopied(false);
  };

  const onCopy = async () => {
    const ok = await copyToClipboard(selectedTags.map((tag) => `#${tag}`).join(" "));
    if (timer.current) clearTimeout(timer.current);
    if (ok) {
      setCopied(true);
      setNotice(null);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } else {
      setNotice("Copy isn’t available in this browser. Select the text and copy it manually.");
    }
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
      active ? "border-violet-400/60 bg-violet-500/20 text-white" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
    }`;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 lg:col-span-2" aria-label="Hashtag generator inputs">
        <div>
          <label htmlFor="topic" className="label">
            Topic
          </label>
          <input
            id="topic"
            className="input"
            value={topic}
            maxLength={TOPIC_MAX}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. home workouts, street food"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "topic-error" : undefined}
            autoComplete="off"
          />
          {error && (
            <p id="topic-error" role="alert" className="mt-1.5 text-sm text-rose-400">
              {error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="hashtag-keywords" className="label">
            Extra keywords <span className="font-normal text-slate-500">(optional, comma separated)</span>
          </label>
          <input
            id="hashtag-keywords"
            className="input"
            value={keywordText}
            onChange={(event) => setKeywordText(event.target.value)}
            placeholder="e.g. nutrition, yoga"
            autoComplete="off"
          />
        </div>

        <fieldset>
          <legend className="label">Platform</legend>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((item) => (
              <button key={item} type="button" aria-pressed={platform === item} onClick={() => setPlatform(item)} className={chip(platform === item)}>
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Audience</legend>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((item) => (
              <button key={item} type="button" aria-pressed={region === item} onClick={() => setRegion(item)} className={chip(region === item)}>
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn-primary w-full">
          <Icon name="hash" size={16} /> Generate hashtags
        </button>
      </form>

      <section className="lg:col-span-3" aria-label="Generated hashtags">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Hashtag ideas</h2>
          {groups.length > 0 && (
            <button type="button" onClick={run} className="btn-secondary !px-4 !py-2">
              <Icon name="refresh" size={16} /> Regenerate
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-4 space-y-3">
          {notice && <p className="card p-4 text-sm text-amber-300">{notice}</p>}

          {groups.length === 0 && !notice && (
            <div className="card p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon name="hash" />
              </span>
              <p className="mt-4 font-medium text-white">Your hashtags will appear here</p>
              <p className="mt-1 text-sm text-slate-400">Enter a topic and hit “Generate hashtags”.</p>
            </div>
          )}

          {groups.length > 0 && (
            <>
              <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <p className="text-sm text-slate-300">
                  {selectedTags.length} of {allTags.length} selected. Tap a hashtag to include or remove it.
                </p>
                <div className="flex gap-2">
                  <button type="button" className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => setSelected(new Set(allTags))}>
                    Select all
                  </button>
                  <button type="button" className="btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => setSelected(new Set())}>
                    Clear
                  </button>
                  <button type="button" className="btn-primary !px-4 !py-1.5 !text-xs" onClick={onCopy} disabled={selectedTags.length === 0}>
                    <Icon name={copied ? "check" : "copy"} size={14} /> {copied ? "Copied" : "Copy selected"}
                  </button>
                </div>
              </div>

              {groups.map((group) => (
                <article key={group.id} className="card animate-fade-up p-5">
                  <h3 className="text-sm font-semibold text-slate-200">{group.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={selected.has(tag)}
                        onClick={() => toggle(tag)}
                        className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                          selected.has(tag)
                            ? "border-violet-400/50 bg-violet-500/15 text-violet-100"
                            : "border-white/10 text-slate-500 line-through hover:text-slate-300"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </article>
              ))}

              <p className="px-1 text-xs text-slate-500">
                These ideas are built from your keywords. Popularity isn’t measured here, so check each hashtag’s reach in the platform’s search, and check the platform’s current hashtag limits before posting.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
