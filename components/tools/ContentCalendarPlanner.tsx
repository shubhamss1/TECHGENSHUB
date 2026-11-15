"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { copyToClipboard } from "@/lib/clipboard";
import {
  PLATFORMS,
  POSTS_PER_WEEK,
  TOPIC_MAX,
  WEEK_OPTIONS,
  generatePlan,
  planToCsv,
  planToText,
  validatePlanInput,
  type Platform,
  type PlanItem,
} from "@/lib/content-calendar";

const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
    active ? "border-violet-400/60 bg-violet-500/20 text-white" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
  }`;

export default function ContentCalendarPlanner() {
  const [topic, setTopic] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["Instagram"]);
  const [postsPerWeek, setPostsPerWeek] = useState(3);
  const [weeks, setWeeks] = useState(2);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const togglePlatform = (platform: Platform) => {
    setPlatforms((current) => (current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]));
  };

  const run = () => {
    const problem = validatePlanInput({ topic, platforms, postsPerWeek, weeks });
    if (problem) {
      setError(problem);
      setNotice(null);
      return;
    }
    setError(null);
    setNotice(null);
    setCopied(false);
    setPlan(generatePlan({ topic, platforms, postsPerWeek, weeks }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run();
  };

  const onCopy = async () => {
    const ok = await copyToClipboard(planToText(plan));
    if (timer.current) clearTimeout(timer.current);
    if (ok) {
      setCopied(true);
      setNotice(null);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } else {
      setNotice("Copy isn’t available in this browser. Download the CSV instead.");
    }
  };

  const onDownload = () => {
    try {
      const blob = new Blob(["\uFEFF" + planToCsv(plan)], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "content-calendar.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(null);
    } catch {
      setNotice("Download isn’t available in this browser. Use Copy plan instead.");
    }
  };

  const weekNumbers = Array.from(new Set(plan.map((item) => item.week)));

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 lg:col-span-2" aria-label="Content calendar inputs">
        <div>
          <label htmlFor="plan-topic" className="label">
            Your topic or niche
          </label>
          <input
            id="plan-topic"
            className="input"
            value={topic}
            maxLength={TOPIC_MAX}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. home workouts, street food"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "plan-error" : undefined}
            autoComplete="off"
          />
          {error && (
            <p id="plan-error" role="alert" className="mt-1.5 text-sm text-rose-400">
              {error}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="label">Platforms</legend>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform}
                type="button"
                aria-pressed={platforms.includes(platform)}
                onClick={() => togglePlatform(platform)}
                className={`${chip(platforms.includes(platform))} inline-flex items-center gap-1.5`}
              >
                {platforms.includes(platform) && <Icon name="check" size={14} />} {platform}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Posts per week (in total)</legend>
          <div className="flex flex-wrap gap-2">
            {POSTS_PER_WEEK.map((count) => (
              <button key={count} type="button" aria-pressed={postsPerWeek === count} onClick={() => setPostsPerWeek(count)} className={chip(postsPerWeek === count)}>
                {count}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Posts are shared across the platforms you choose. Start with a number you can keep up.</p>
        </fieldset>

        <fieldset>
          <legend className="label">Plan length</legend>
          <div className="flex flex-wrap gap-2">
            {WEEK_OPTIONS.map((count) => (
              <button key={count} type="button" aria-pressed={weeks === count} onClick={() => setWeeks(count)} className={chip(weeks === count)}>
                {count} {count === 1 ? "week" : "weeks"}
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn-primary w-full">
          <Icon name="calendar" size={16} /> Build my plan
        </button>
      </form>

      <section className="lg:col-span-3" aria-label="Content plan">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Your plan</h2>
          {plan.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={run} className="btn-secondary !px-3 !py-2 !text-xs">
                <Icon name="refresh" size={14} /> Regenerate
              </button>
              <button type="button" onClick={onCopy} className="btn-secondary !px-3 !py-2 !text-xs">
                <Icon name={copied ? "check" : "copy"} size={14} /> {copied ? "Copied" : "Copy plan"}
              </button>
              <button type="button" onClick={onDownload} className="btn-primary !px-3 !py-2 !text-xs">
                <Icon name="arrow-right" size={14} className="rotate-90" /> Download CSV
              </button>
            </div>
          )}
        </div>

        <div aria-live="polite" className="mt-4 space-y-4">
          {notice && <p className="card p-4 text-sm text-amber-300">{notice}</p>}

          {plan.length === 0 && (
            <div className="card p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon name="calendar" />
              </span>
              <p className="mt-4 font-medium text-white">Your content plan will appear here</p>
              <p className="mt-1 text-sm text-slate-400">Enter your topic, choose platforms and hit “Build my plan”.</p>
            </div>
          )}

          {weekNumbers.map((week) => (
            <article key={week} className="card animate-fade-up p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-electric-400">Week {week}</h3>
              <ul className="mt-3 divide-y divide-white/5">
                {plan
                  .filter((item) => item.week === week)
                  .map((item) => (
                    <li key={`${item.week}-${item.day}`} className="py-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-md bg-violet-500/20 px-2 py-0.5 font-semibold text-violet-100">{item.day}</span>
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-slate-300">{item.platform}</span>
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-slate-300">{item.format}</span>
                        <span className="text-slate-500">{item.type}</span>
                      </div>
                      <p className="mt-1.5 text-[15px] text-slate-100">{item.idea}</p>
                    </li>
                  ))}
              </ul>
            </article>
          ))}

          {plan.length > 0 && (
            <p className="px-1 text-xs text-slate-500">
              The days are simple suggestions, not proven best times. Check your own analytics to learn when your audience is most active, then move posts to fit.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
