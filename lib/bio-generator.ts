/**
 * Local, template-based Instagram bio generator.
 * Pure functions only: no network calls, no API keys, easy to unit test.
 */

export const TONES = [
  "Professional",
  "Friendly",
  "Bold",
  "Witty",
  "Inspirational",
  "Minimal",
] as const;

export type Tone = (typeof TONES)[number];
export type Rng = () => number;

export const BIO_LIMIT = 150; // Instagram's bio character limit
export const BIO_COUNT = 6;
export const NICHE_MAX = 50;
export const KEYWORD_MAX = 5;
const KEYWORD_LENGTH_MAX = 30;

export interface BioInput {
  niche: string;
  tone: Tone;
  keywords: string[];
}

interface Template {
  text: string;
  /** Minimum number of keywords this template needs. */
  needs: number;
}

interface ToneData {
  emojis: string[];
  ctas: string[];
  templates: Template[];
}

const t = (text: string, needs = 0): Template => ({ text, needs });

const TONE_DATA: Record<Tone, ToneData> = {
  Professional: {
    emojis: ["📈", "💼", "🎯"],
    ctas: ["Follow for more", "Link in bio ↓", "DM for collabs", "Join the community ↓"],
    templates: [
      t("{Niche} | {k1} & {k2}\n{cta}", 2),
      t("Your go-to {niche} for {k1}\n{cta}", 1),
      t("{Niche}\n{k1} · {k2} · {k3}\n{cta}", 3),
      t("{Niche} • Focused on {k1} and {k2}\n{cta}", 2),
      t("{Niche} sharing practical tips on {k1}\n{cta}", 1),
      t("{Niche}\nPractical, no-fluff content {e}\n{cta}"),
      t("{Niche} • Clear advice, consistent results\n{cta}"),
    ],
  },
  Friendly: {
    emojis: ["✨", "💜", "🌟", "😊"],
    ctas: ["Say hi in the DMs!", "Come hang out ↓", "Follow along ↓", "Join the fun ↓"],
    templates: [
      t("Hey, I’m your {niche} {e}\nTalking {k1} & {k2}\n{cta}", 2),
      t("{e} {Niche} sharing all things {k1}\n{cta}", 1),
      t("Just a {niche} who loves {k1} {e}\n{cta}", 1),
      t("{e} {Niche} | {k1} · {k2} · {k3}\n{cta}", 3),
      t("Making {k1} simple and fun {e}\n{Niche}\n{cta}", 1),
      t("Welcome! {e} I’m a {niche}\n{cta}"),
      t("{e} {Niche} • {k1} & {k2}\n{cta}", 2),
      t("{Niche} with good vibes {e}\n{cta}"),
    ],
  },
  Bold: {
    emojis: ["🔥", "⚡", "🚀", "💥"],
    ctas: ["Follow or get left behind ↓", "Start now ↓", "Link in bio ↓", "Join the movement ↓"],
    templates: [
      t("{Niche}. {k1}. {k2}.\n{cta}", 2),
      t("No excuses. Just {k1}. {e}\n{Niche}\n{cta}", 1),
      t("{Niche} on a mission {e}\n{k1} · {k2}\n{cta}", 2),
      t("Built different. {Niche}.\n{cta}"),
      t("{e} {Niche} | Big on {k1}\n{cta}", 1),
      t("Go big or go home {e}\n{Niche} • {k1} • {k2} • {k3}\n{cta}", 3),
      t("Dominating {k1} {e}\n{Niche}\n{cta}", 1),
      t("{Niche}. Zero fluff. Full effort.\n{cta}"),
    ],
  },
  Witty: {
    emojis: ["😏", "🙃", "☕", "🤷"],
    ctas: ["Follow, it’s free ↓", "Link in bio (it’s good) ↓", "Slide into the DMs", "Stay for the chaos ↓"],
    templates: [
      t("{Niche} by day, {k1} enthusiast by night {e}\n{cta}", 1),
      t("Professional {k1} overthinker {e}\n{Niche}\n{cta}", 1),
      t("{Niche} fueled by {k1} and {k2} {e}\n{cta}", 2),
      t("I do {k1} so you don’t have to {e}\n{Niche}\n{cta}", 1),
      t("{Niche}. Mostly {k1}, occasionally {k2} {e}\n{cta}", 2),
      t("Warning: {niche} content may cause sudden interest in {k1} {e}\n{cta}", 1),
      t("{Niche} with questionable life choices {e}\n{cta}"),
      t("Not a robot, just a {niche} {e}\n{cta}"),
    ],
  },
  Inspirational: {
    emojis: ["🌱", "✨", "🌅", "💫"],
    ctas: ["Start your journey ↓", "Keep growing ↓", "Follow along ↓", "Your time is now ↓"],
    templates: [
      t("{Niche} | Helping you grow with {k1} {e}\n{cta}", 1),
      t("Small steps. Big growth. {e}\n{Niche} • {k1} & {k2}\n{cta}", 2),
      t("Believe in the process {e}\n{Niche}\n{cta}"),
      t("Turning {k1} into progress {e}\n{Niche}\n{cta}", 1),
      t("{e} {Niche} sharing {k1}, {k2} & {k3}\n{cta}", 3),
      t("Start where you are. {e}\n{Niche} • {k1}\n{cta}", 1),
      t("Keep creating, keep growing {e}\n{Niche}\n{cta}"),
      t("Your journey with {k1} starts here {e}\n{Niche}\n{cta}", 1),
    ],
  },
  Minimal: {
    emojis: ["✦", "◦", "→"],
    ctas: ["Link below", "Follow", "Say hello"],
    templates: [
      t("{Niche}\n{k1} · {k2}", 2),
      t("{Niche} | {k1}", 1),
      t("{Niche}\n{cta}"),
      t("{k1} / {k2} / {k3}\n{Niche}", 3),
      t("{Niche} {e}\n{k1}", 1),
      t("{Niche} — {k1}, {k2}", 2),
      t("{Niche} • {cta}"),
      t("{k1}. {k2}.\n{Niche} {e}", 2),
    ],
  },
};

/* ------------------------------ helpers ------------------------------ */

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.min(Math.floor(rng() * items.length), items.length - 1)];
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function normalizeNiche(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

/** Splits a comma/newline separated string into a clean, de-duplicated keyword list. */
export function parseKeywords(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[,\n]/)) {
    const keyword = part.replace(/\s+/g, " ").trim().slice(0, KEYWORD_LENGTH_MAX);
    const key = keyword.toLowerCase();
    if (keyword && !seen.has(key)) {
      seen.add(key);
      out.push(keyword);
    }
    if (out.length === KEYWORD_MAX) break;
  }
  return out;
}

export function validateBioInput(niche: string): string | null {
  const value = normalizeNiche(niche);
  if (value.length < 2) return "Enter your niche, for example “fitness coach”.";
  if (value.length > NICHE_MAX) return `Keep your niche under ${NICHE_MAX} characters.`;
  return null;
}

function fillTemplate(template: Template, niche: string, keywords: string[], data: ToneData, rng: Rng): string {
  const ks = shuffle(keywords, rng);
  const values: Record<string, string> = {
    Niche: capitalize(niche),
    niche,
    k1: ks[0] ?? "",
    k2: ks[1] ?? "",
    k3: ks[2] ?? "",
    cta: pick(data.ctas, rng),
    e: pick(data.emojis, rng),
  };
  return template.text
    .replace(/\{(\w+)\}/g, (_match, key: string) => values[key] ?? "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

/* ------------------------------- public ------------------------------- */

/**
 * Generates up to `count` unique bios (each within Instagram's 150 character limit).
 * `exclude` lets "Regenerate" avoid repeating what the user just saw, when possible.
 * Pass a seeded `rng` for deterministic output (used in tests).
 */
export function generateBios(
  input: BioInput,
  count: number = BIO_COUNT,
  rng: Rng = Math.random,
  exclude: readonly string[] = [],
): string[] {
  const niche = normalizeNiche(input.niche);
  const keywords = parseKeywords(input.keywords.join(","));
  const data = TONE_DATA[input.tone];
  const eligible = data.templates.filter((template) => template.needs <= keywords.length);

  const collect = (avoid: Set<string>, limit: number): string[] => {
    const results: string[] = [];
    const seen = new Set(avoid);
    for (let round = 0; round < 8 && results.length < limit; round++) {
      for (const template of shuffle(eligible, rng)) {
        if (results.length >= limit) break;
        const text = fillTemplate(template, niche, keywords, data, rng);
        if (text.length > 0 && text.length <= BIO_LIMIT && !seen.has(text)) {
          seen.add(text);
          results.push(text);
        }
      }
    }
    return results;
  };

  const fresh = collect(new Set(exclude), count);
  if (fresh.length >= count) return fresh;
  // Not enough new variations: top up, allowing repeats of earlier results.
  return [...fresh, ...collect(new Set(fresh), count - fresh.length)];
}
