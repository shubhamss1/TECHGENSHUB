/**
 * Local, template-based thumbnail text generator.
 * Thumbnail text works best when it is very short, so every idea is limited in words and characters.
 * No network calls, no API keys. It does not predict clicks.
 */
import { normalizeNiche, parseKeywords, pick, shuffle, type Rng } from "./bio-generator";
import { toTitleCase } from "./youtube-title-generator";

export const THUMBNAIL_STYLES = ["Curiosity", "Benefit", "Warning", "Challenge", "Minimal"] as const;
export type ThumbnailStyle = (typeof THUMBNAIL_STYLES)[number];

export const TEXT_COUNT = 8;
export const MAX_WORDS = 6;
export const MAX_CHARS = 40;
export const TOPIC_MIN = 2;
export const TOPIC_MAX = 30;
const NUMBERS = [3, 5, 7, 10];

export interface ThumbnailInput {
  topic: string;
  style: ThumbnailStyle;
  keywords: string[];
  uppercase: boolean;
}

interface Template {
  text: string;
  needs: number;
}

const t = (text: string, needs = 0): Template => ({ text, needs });

const TEMPLATES: Record<ThumbnailStyle, Template[]> = {
  Curiosity: [
    t("{Topic}?"),
    t("Why {topic}?"),
    t("What Is {topic}?"),
    t("The Truth About {topic}"),
    t("{Topic}: Explained"),
    t("Ever Tried {topic}?"),
    t("Wait, {topic}?"),
    t("How Does {topic} Work?"),
    t("Is {topic} Worth It?"),
    t("{n} Facts About {topic}"),
    t("{n} {topic} Questions"),
    t("{k1} or {topic}?", 1),
    t("{k1} vs {k2}?", 2),
  ],
  Benefit: [
    t("Master {topic}"),
    t("{Topic} Made Easy"),
    t("Better {topic}"),
    t("Easy {topic}"),
    t("Start {topic} Today"),
    t("Level Up {topic}"),
    t("{Topic} for Beginners"),
    t("Simple {topic} Tips"),
    t("{Topic} in {n} Steps"),
    t("{n} {topic} Tips"),
    t("{n} Easy {topic} Wins"),
    t("{k1} + {topic}", 1),
    t("Easy {k1}", 1),
    t("{k1} & {k2}", 2),
  ],
  Warning: [
    t("Avoid This"),
    t("Stop Doing This"),
    t("Before You Start {topic}"),
    t("Don’t Skip This"),
    t("{Topic} Mistakes"),
    t("{Topic}: Watch Out"),
    t("Common {topic} Errors"),
    t("Careful With {topic}"),
    t("Read This First"),
    t("{n} {topic} Mistakes"),
    t("{n} Things to Avoid"),
    t("{n} {topic} Myths"),
    t("{k1} Mistakes", 1),
  ],
  Challenge: [
    t("I Tried {topic}"),
    t("{Topic} Challenge"),
    t("Can I Do {topic}?"),
    t("{Topic}: Day 1"),
    t("Trying {topic}"),
    t("My {topic} Test"),
    t("Let’s Try {topic}"),
    t("Will {topic} Work?"),
    t("{n} Days of {topic}"),
    t("{n} Days: {topic}"),
    t("{n} Weeks of {topic}"),
    t("{k1} Challenge", 1),
    t("{k1} vs {k2}", 2),
  ],
  Minimal: [
    t("{Topic}"),
    t("{Topic} Guide"),
    t("{Topic} Tips"),
    t("Simply {topic}"),
    t("{Topic} 101"),
    t("All About {topic}"),
    t("{Topic} Basics"),
    t("{Topic} Today"),
    t("Just {topic}"),
    t("{Topic} Intro"),
    t("{Topic}: Top {n}"),
    t("{n} {topic} Ideas"),
    t("{k1} Guide", 1),
    t("{k1} & {k2}", 2),
  ],
};

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function validateThumbnailInput(topic: string): string | null {
  const value = normalizeNiche(topic);
  if (value.length < TOPIC_MIN) return "Enter your video topic as a short word or phrase, for example “guitar” or “keto diet”.";
  if (value.length > TOPIC_MAX) return `Keep your topic under ${TOPIC_MAX} characters. Shorter topics make better thumbnail text.`;
  return null;
}

/**
 * Generates up to `count` unique thumbnail texts (each within MAX_WORDS words and MAX_CHARS characters).
 * `exclude` lets "Regenerate" avoid repeating what the user just saw, when possible.
 */
export function generateThumbnailTexts(
  input: ThumbnailInput,
  count: number = TEXT_COUNT,
  rng: Rng = Math.random,
  exclude: readonly string[] = [],
): string[] {
  const topic = toTitleCase(normalizeNiche(input.topic));
  const keywords = parseKeywords(input.keywords.join(",")).map(toTitleCase);
  const eligible = TEMPLATES[input.style].filter((template) => template.needs <= keywords.length);

  const build = (template: Template): string => {
    const ks = shuffle(keywords, rng);
    const values: Record<string, string> = {
      Topic: topic,
      topic,
      k1: ks[0] ?? "",
      k2: ks[1] ?? "",
      n: String(pick(NUMBERS, rng)),
    };
    const text = template.text.replace(/\{(\w+)\}/g, (_match, key: string) => values[key] ?? "").replace(/ {2,}/g, " ").trim();
    return input.uppercase ? text.toUpperCase() : text;
  };

  const collect = (avoid: Set<string>, limit: number): string[] => {
    const out: string[] = [];
    const seen = new Set(avoid);
    for (let round = 0; round < 12 && out.length < limit; round++) {
      for (const template of shuffle(eligible, rng)) {
        if (out.length >= limit) break;
        const text = build(template);
        if (text.length > 0 && text.length <= MAX_CHARS && countWords(text) <= MAX_WORDS && !seen.has(text)) {
          seen.add(text);
          out.push(text);
        }
      }
    }
    return out;
  };

  const fresh = collect(new Set(exclude), count);
  if (fresh.length >= count) return fresh;
  return [...fresh, ...collect(new Set(fresh), count - fresh.length)];
}
