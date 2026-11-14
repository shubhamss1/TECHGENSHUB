"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { copyToClipboard } from "@/lib/clipboard";
import {
  BIO_LIMIT,
  NICHE_MAX,
  TONES,
  generateBios,
  parseKeywords,
  validateBioInput,
  type Tone,
} from "@/lib/bio-generator";

export default function InstagramBioGenerator() {
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState<Tone>("Friendly");
  const [keywordText, setKeywordText] = useState("");
  const [bios, setBios] = useState<string[]>([]);
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
    const problem = validateBioInput(niche);
    if (problem) {
      setError(problem);
      setNotice(null);
      return;
    }
    setError(null);
    const next = generateBios({ niche, tone, keywords: parseKeywords(keywordText) }, undefined, Math.random, bios);
    setBios(next);
    setCopiedIndex(null);
    setNotice(next.length === 0 ? "We couldn’t fit a bio in 150 characters. Try a shorter niche or keywords." : null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run();
  };

  const onCopy = async (index: number) => {
    const ok = await copyToClipboard(bios[index]);
    if (timer.current) clearTimeout(timer.current);
    if (ok) {
      setCopiedIndex(index);
      timer.current = setTimeout(() => setCopiedIndex(null), 1800);
    } else {
      setNotice("Copy isn’t available in this browser. Select the text and copy it manually.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 lg:col-span-2" aria-label="Bio generator inputs">
        <div>
          <label htmlFor="niche" className="label">
            Your niche
          </label>
          <input
            id="niche"
            className="input"
            value={niche}
            maxLength={NICHE_MAX}
            onChange={(event) => setNiche(event.target.value)}
            placeholder="e.g. fitness coach, travel blogger"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "niche-error" : undefined}
            autoComplete="off"
          />
          {error && (
            <p id="niche-error" role="alert" className="mt-1.5 text-sm text-rose-400">
              {error}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="label">Tone</legend>
          <div className="flex flex-wrap gap-2">
            {TONES.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={tone === item}
                onClick={() => setTone(item)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  tone === item
                    ? "border-violet-400/60 bg-violet-500/20 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="keywords" className="label">
            Keywords <span className="font-normal text-slate-500">(optional, comma separated)</span>
          </label>
          <input
            id="keywords"
            className="input"
            value={keywordText}
            onChange={(event) => setKeywordText(event.target.value)}
            placeholder="e.g. home workouts, nutrition"
            autoComplete="off"
          />
          <p className="mt-1.5 text-xs text-slate-500">Up to 5 keywords. Add 2 or 3 for the most varied results.</p>
        </div>

        <button type="submit" className="btn-primary w-full">
          <Icon name="sparkles" size={16} /> Generate bios
        </button>
      </form>

      <section className="lg:col-span-3" aria-label="Generated bios">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Suggestions</h2>
          {bios.length > 0 && (
            <button type="button" onClick={run} className="btn-secondary !px-4 !py-2">
              <Icon name="refresh" size={16} /> Regenerate
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-4 space-y-3">
          {notice && <p className="card p-4 text-sm text-amber-300">{notice}</p>}

          {bios.length === 0 && !notice && (
            <div className="card p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon name="user" />
              </span>
              <p className="mt-4 font-medium text-white">Your bios will appear here</p>
              <p className="mt-1 text-sm text-slate-400">Enter your niche, pick a tone and hit “Generate bios”.</p>
            </div>
          )}

          {bios.map((bio, index) => (
            <article key={bio} className="card animate-fade-up p-4 sm:p-5" style={{ animationDelay: `${index * 50}ms` }}>
              <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-slate-100">{bio}</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-xs text-slate-500">
                  {bio.length}/{BIO_LIMIT} characters
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(index)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5"
                  aria-label={`Copy bio ${index + 1}`}
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
