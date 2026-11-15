"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { TONES, parseKeywords, type Tone } from "@/lib/bio-generator";
import { CAPTION_GOALS, CAPTION_LIMIT, TOPIC_MAX, generateCaptions, validateCaptionInput, type CaptionGoal } from "@/lib/caption-generator";
import { copyToClipboard } from "@/lib/clipboard";

const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
    active ? "border-violet-400/60 bg-violet-500/20 text-white" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
  }`;

export default function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState<CaptionGoal>("Spark conversation");
  const [tone, setTone] = useState<Tone>("Friendly");
  const [keywordText, setKeywordText] = useState("");
  const [includeCta, setIncludeCta] = useState(true);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [captions, setCaptions] = useState<string[]>([]);
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
    const problem = validateCaptionInput(topic);
    if (problem) {
      setError(problem);
      setNotice(null);
      return;
    }
    setError(null);
    const next = generateCaptions(
      { topic, goal, tone, keywords: parseKeywords(keywordText), includeCta, includeEmoji },
      undefined,
      Math.random,
      captions,
    );
    setCaptions(next);
    setCopiedIndex(null);
    setNotice(next.length === 0 ? "We couldn’t build a caption from that topic. Try different words." : null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run();
  };

  const onCopy = async (index: number) => {
    const ok = await copyToClipboard(captions[index]);
    if (timer.current) clearTimeout(timer.current);
    if (ok) {
      setCopiedIndex(index);
      setNotice(null);
      timer.current = setTimeout(() => setCopiedIndex(null), 1800);
    } else {
      setNotice("Copy isn’t available in this browser. Select the text and copy it manually.");
    }
  };

  const toggle = (label: string, value: boolean, set: (next: boolean) => void) => (
    <button type="button" aria-pressed={value} onClick={() => set(!value)} className={`${chip(value)} inline-flex items-center gap-1.5`}>
      {value && <Icon name="check" size={14} />} {label}
    </button>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 lg:col-span-2" aria-label="Caption generator inputs">
        <div>
          <label htmlFor="caption-topic" className="label">
            What is your post about?
          </label>
          <input
            id="caption-topic"
            className="input"
            value={topic}
            maxLength={TOPIC_MAX}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. my new morning routine"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "caption-topic-error" : undefined}
            autoComplete="off"
          />
          {error && (
            <p id="caption-topic-error" role="alert" className="mt-1.5 text-sm text-rose-400">
              {error}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="label">Goal</legend>
          <div className="flex flex-wrap gap-2">
            {CAPTION_GOALS.map((item) => (
              <button key={item} type="button" aria-pressed={goal === item} onClick={() => setGoal(item)} className={chip(goal === item)}>
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Tone</legend>
          <div className="flex flex-wrap gap-2">
            {TONES.map((item) => (
              <button key={item} type="button" aria-pressed={tone === item} onClick={() => setTone(item)} className={chip(tone === item)}>
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="caption-keywords" className="label">
            Keywords <span className="font-normal text-slate-500">(optional, comma separated)</span>
          </label>
          <input
            id="caption-keywords"
            className="input"
            value={keywordText}
            onChange={(event) => setKeywordText(event.target.value)}
            placeholder="e.g. habits, energy"
            autoComplete="off"
          />
        </div>

        <fieldset>
          <legend className="label">Options</legend>
          <div className="flex flex-wrap gap-2">
            {toggle("Call to action", includeCta, setIncludeCta)}
            {toggle("Emoji", includeEmoji, setIncludeEmoji)}
          </div>
        </fieldset>

        <button type="submit" className="btn-primary w-full">
          <Icon name="message" size={16} /> Generate captions
        </button>
      </form>

      <section className="lg:col-span-3" aria-label="Generated captions">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Caption ideas</h2>
          {captions.length > 0 && (
            <button type="button" onClick={run} className="btn-secondary !px-4 !py-2">
              <Icon name="refresh" size={16} /> Regenerate
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-4 space-y-3">
          {notice && <p className="card p-4 text-sm text-amber-300">{notice}</p>}

          {captions.length === 0 && !notice && (
            <div className="card p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon name="message" />
              </span>
              <p className="mt-4 font-medium text-white">Your captions will appear here</p>
              <p className="mt-1 text-sm text-slate-400">Describe your post, pick a goal and hit “Generate captions”.</p>
            </div>
          )}

          {captions.map((caption, index) => (
            <article key={caption} className="card animate-fade-up p-4 sm:p-5" style={{ animationDelay: `${index * 50}ms` }}>
              <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-slate-100">{caption}</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-xs text-slate-500">
                  {caption.length}/{CAPTION_LIMIT.toLocaleString("en-US")} characters
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(index)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5"
                  aria-label={`Copy caption ${index + 1}`}
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
