"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { parseKeywords } from "@/lib/bio-generator";
import { copyToClipboard } from "@/lib/clipboard";
import { TITLE_LIMIT, TITLE_STYLES, TOPIC_MAX, generateTitles, validateTitleInput, type TitleStyle } from "@/lib/youtube-title-generator";

const LONG_TITLE = 60;

const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
    active ? "border-violet-400/60 bg-violet-500/20 text-white" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
  }`;

export default function YouTubeTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<TitleStyle>("How-to");
  const [keywordText, setKeywordText] = useState("");
  const [includeYear, setIncludeYear] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const run = () => {
    const problem = validateTitleInput(topic);
    if (problem) {
      setError(problem);
      setNotice(null);
      return;
    }
    setError(null);
    const next = generateTitles({ topic, style, keywords: parseKeywords(keywordText), includeYear }, undefined, Math.random, titles);
    setTitles(next);
    setCopiedIndex(null);
    setNotice(next.length === 0 ? "We couldn’t build a title from that topic. Try different words." : null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run();
  };

  const onCopy = async (index: number) => {
    const ok = await copyToClipboard(titles[index]);
    if (timer.current) clearTimeout(timer.current);
    if (ok) {
      setCopiedIndex(index);
      setNotice(null);
      timer.current = setTimeout(() => setCopiedIndex(null), 1800);
    } else {
      setNotice("Copy isn’t available in this browser. Select the text and copy it manually.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 lg:col-span-2" aria-label="Title generator inputs">
        <div>
          <label htmlFor="title-topic" className="label">
            Video topic
          </label>
          <input
            id="title-topic"
            className="input"
            value={topic}
            maxLength={TOPIC_MAX}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. budget travel in India, learning guitar"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "title-topic-error" : undefined}
            autoComplete="off"
          />
          {error && (
            <p id="title-topic-error" role="alert" className="mt-1.5 text-sm text-rose-400">
              {error}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="label">Title style</legend>
          <div className="flex flex-wrap gap-2">
            {TITLE_STYLES.map((item) => (
              <button key={item} type="button" aria-pressed={style === item} onClick={() => setStyle(item)} className={chip(style === item)}>
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="title-keywords" className="label">
            Keywords <span className="font-normal text-slate-500">(optional, comma separated)</span>
          </label>
          <input
            id="title-keywords"
            className="input"
            value={keywordText}
            onChange={(event) => setKeywordText(event.target.value)}
            placeholder="e.g. solo travel, budget"
            autoComplete="off"
          />
        </div>

        <fieldset>
          <legend className="label">Options</legend>
          <button
            type="button"
            aria-pressed={includeYear}
            onClick={() => setIncludeYear((value) => !value)}
            className={`${chip(includeYear)} inline-flex items-center gap-1.5`}
          >
            {includeYear && <Icon name="check" size={14} />} Add the current year
          </button>
        </fieldset>

        <button type="submit" className="btn-primary w-full">
          <Icon name="play" size={16} /> Generate titles
        </button>
      </form>

      <section className="lg:col-span-3" aria-label="Generated titles">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Title ideas</h2>
          {titles.length > 0 && (
            <button type="button" onClick={run} className="btn-secondary !px-4 !py-2">
              <Icon name="refresh" size={16} /> Regenerate
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-4 space-y-3">
          {notice && <p className="card p-4 text-sm text-amber-300">{notice}</p>}

          {titles.length === 0 && !notice && (
            <div className="card p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon name="play" />
              </span>
              <p className="mt-4 font-medium text-white">Your titles will appear here</p>
              <p className="mt-1 text-sm text-slate-400">Enter a video topic, pick a style and hit “Generate titles”.</p>
            </div>
          )}

          {titles.map((title, index) => (
            <article key={title} className="card animate-fade-up p-4 sm:p-5" style={{ animationDelay: `${index * 40}ms` }}>
              <p className="break-words text-base font-medium leading-snug text-slate-100">{title}</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-xs text-slate-500">
                  {title.length}/{TITLE_LIMIT} characters
                  {title.length > LONG_TITLE && <span className="ml-2 text-amber-400/90">may be cut off in some places</span>}
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(index)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5"
                  aria-label={`Copy title ${index + 1}`}
                >
                  <Icon name={copiedIndex === index ? "check" : "copy"} size={14} className={copiedIndex === index ? "text-emerald-400" : ""} />
                  {copiedIndex === index ? "Copied" : "Copy"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
