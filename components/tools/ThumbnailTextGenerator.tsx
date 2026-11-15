"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { parseKeywords } from "@/lib/bio-generator";
import { copyToClipboard } from "@/lib/clipboard";
import {
  MAX_WORDS,
  THUMBNAIL_STYLES,
  TOPIC_MAX,
  countWords,
  generateThumbnailTexts,
  validateThumbnailInput,
  type ThumbnailStyle,
} from "@/lib/thumbnail-text-generator";

const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
    active ? "border-violet-400/60 bg-violet-500/20 text-white" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
  }`;

export default function ThumbnailTextGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<ThumbnailStyle>("Curiosity");
  const [keywordText, setKeywordText] = useState("");
  const [uppercase, setUppercase] = useState(true);
  const [texts, setTexts] = useState<string[]>([]);
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
    const problem = validateThumbnailInput(topic);
    if (problem) {
      setError(problem);
      setNotice(null);
      return;
    }
    setError(null);
    const next = generateThumbnailTexts({ topic, style, keywords: parseKeywords(keywordText), uppercase }, undefined, Math.random, texts);
    setTexts(next);
    setCopiedIndex(null);
    setNotice(next.length === 0 ? "We couldn’t build thumbnail text from that topic. Try a shorter word or phrase." : null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run();
  };

  const onCopy = async (index: number) => {
    const ok = await copyToClipboard(texts[index]);
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
      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 lg:col-span-2" aria-label="Thumbnail text generator inputs">
        <div>
          <label htmlFor="thumb-topic" className="label">
            Video topic
          </label>
          <input
            id="thumb-topic"
            className="input"
            value={topic}
            maxLength={TOPIC_MAX}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. guitar, keto diet, Delhi trip"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "thumb-topic-error" : "thumb-topic-hint"}
            autoComplete="off"
          />
          {error ? (
            <p id="thumb-topic-error" role="alert" className="mt-1.5 text-sm text-rose-400">
              {error}
            </p>
          ) : (
            <p id="thumb-topic-hint" className="mt-1.5 text-xs text-slate-500">
              A short word or phrase works best, since thumbnail text has to be very short.
            </p>
          )}
        </div>

        <fieldset>
          <legend className="label">Style</legend>
          <div className="flex flex-wrap gap-2">
            {THUMBNAIL_STYLES.map((item) => (
              <button key={item} type="button" aria-pressed={style === item} onClick={() => setStyle(item)} className={chip(style === item)}>
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="thumb-keywords" className="label">
            Keywords <span className="font-normal text-slate-500">(optional, comma separated)</span>
          </label>
          <input
            id="thumb-keywords"
            className="input"
            value={keywordText}
            onChange={(event) => setKeywordText(event.target.value)}
            placeholder="e.g. chords, beginner"
            autoComplete="off"
          />
        </div>

        <fieldset>
          <legend className="label">Options</legend>
          <button type="button" aria-pressed={uppercase} onClick={() => setUppercase((value) => !value)} className={`${chip(uppercase)} inline-flex items-center gap-1.5`}>
            {uppercase && <Icon name="check" size={14} />} ALL CAPS
          </button>
        </fieldset>

        <button type="submit" className="btn-primary w-full">
          <Icon name="type" size={16} /> Generate thumbnail text
        </button>
      </form>

      <section className="lg:col-span-3" aria-label="Generated thumbnail text">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Text ideas</h2>
          {texts.length > 0 && (
            <button type="button" onClick={run} className="btn-secondary !px-4 !py-2">
              <Icon name="refresh" size={16} /> Regenerate
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-4 space-y-3">
          {notice && <p className="card p-4 text-sm text-amber-300">{notice}</p>}

          {texts.length === 0 && !notice && (
            <div className="card p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon name="type" />
              </span>
              <p className="mt-4 font-medium text-white">Your thumbnail text will appear here</p>
              <p className="mt-1 text-sm text-slate-400">Enter a video topic, pick a style and hit “Generate thumbnail text”.</p>
            </div>
          )}

          {texts.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {texts.map((text, index) => (
                <article key={text} className="card animate-fade-up flex flex-col justify-between p-4" style={{ animationDelay: `${index * 40}ms` }}>
                  <p className="break-words font-display text-2xl font-extrabold leading-tight text-white">{text}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-xs text-slate-500">
                      {countWords(text)} {countWords(text) === 1 ? "word" : "words"} · {text.length} characters
                      {countWords(text) >= MAX_WORDS && <span className="ml-1 text-amber-400/90">· on the long side</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5"
                      aria-label={`Copy thumbnail text ${index + 1}`}
                    >
                      <Icon name={copiedIndex === index ? "check" : "copy"} size={14} className={copiedIndex === index ? "text-emerald-400" : ""} />
                      {copiedIndex === index ? "Copied" : "Copy"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {texts.length > 0 && (
            <p className="px-1 text-xs text-slate-500">Make sure your thumbnail text matches what the video really delivers. These are starting points, not guarantees of clicks.</p>
          )}
        </div>
      </section>
    </div>
  );
}
