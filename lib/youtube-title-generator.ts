/**
 * Local, template-based YouTube title idea generator.
 * No network calls, no API keys. It does not predict views or rankings.
 */
import { normalizeNiche, parseKeywords, pick, shuffle, type Rng } from "./bio-generator";

export const TITLE_STYLES = ["How-to", "List", "Question", "Story", "Review"] as const;
export type TitleStyle = (typeof TITLE_STYLES)[number];

export const TITLE_LIMIT = 100; // YouTube's title character limit
export const TITLE_COUNT = 8;
export const TOPIC_MIN = 3;
export const TOPIC_MAX = 50;
const NUMBERS = [3, 5, 7, 10];

export interface TitleInput {
  topic: string;
  style: TitleStyle;
  keywords: string[];
  includeYear: boolean;
}

interface Template {
  text: string;
  needs: number;
}

const t = (text: string, needs = 0): Template => ({ text, needs });

const TEMPLATES: Record<TitleStyle, Template[]> = {
  "How-to": [
    t("{Topic} for Beginners: A Simple Guide"),
    t("Everything You Need to Know About {topic}"),
    t("{Topic} Made Simple"),
    t("A Step-by-Step Guide to {topic}"),
    t("{n} Steps to Get Started With {topic}"),
    t("How to Get Better at {topic}"),
    t("{Topic} and {k1}: A Beginner’s Guide", 1),
    t("How {k1} and {k2} Fit Into {topic}", 2),
  ],
  List: [
    t("{n} Tips for {topic}"),
    t("{n} Mistakes to Avoid in {topic}"),
    t("{n} Things I Wish I Knew About {topic}"),
    t("{n} Ways to Improve Your {topic}"),
    t("{n} Common {topic} Questions Answered"),
    t("{n} {k1} Tips for {topic}", 1),
    t("{n} {k1} and {k2} Tips for {topic}", 2),
  ],
  Question: [
    t("Is {topic} Worth It?"),
    t("What Is {topic}? Explained"),
    t("Why Does {topic} Matter?"),
    t("Are You Making These {topic} Mistakes?"),
    t("Should You Try {topic}?"),
    t("Can Anyone Learn {topic}?"),
    t("Is {topic} Right for You?"),
    t("Do You Really Need {topic}?"),
    t("Where Should You Start With {topic}?"),
    t("{n} Questions About {topic} Answered"),
    t("{n} Reasons to Try {topic}"),
    t("How Does {k1} Change {topic}?", 1),
    t("{k1} or {k2}: What Works Best for {topic}?", 2),
  ],
  Story: [
    t("My Honest Experience With {topic}"),
    t("I Tried {topic}. Here’s What Happened"),
    t("What {topic} Taught Me"),
    t("My {topic} Journey So Far"),
    t("The Truth About {topic}"),
    t("What I Learned From {topic}"),
    t("Why I Started {topic}"),
    t("{n} Lessons {topic} Taught Me"),
    t("{n} Things I Learned From {topic}"),
    t("{n} Honest Thoughts on {topic}"),
    t("A Beginner’s Story: {topic}"),
    t("How {k1} Changed My {topic}", 1),
    t("{k1}, {k2} and {topic}: My Story", 2),
  ],
  Review: [
    t("{Topic}: An Honest Review"),
    t("{Topic} Review: Is It Worth It?"),
    t("{Topic}: The Pros and Cons"),
    t("Watch This Before You Try {topic}"),
    t("{Topic}: What I Liked and What I Didn’t"),
    t("{Topic}: My Thoughts After Trying It"),
    t("{Topic}: Who Is It For?"),
    t("{n} Things I Liked About {topic}"),
    t("{n} Pros and Cons of {topic}"),
    t("{Topic} Review: The Good and the Bad"),
    t("{Topic} and {k1}: My Honest Take", 1),
    t("{k1} vs {k2}: Which Is Better for {topic}?", 2),
  ],
};

const SMALL_WORDS = new Set(["a", "an", "the", "of", "in", "on", "for", "and", "or", "to", "vs", "with", "at", "by", "from"]);

/** "learning SEO for the web" -> "Learning SEO for the Web". Words that already contain capitals are kept. */
export function toTitleCase(text: string): string {
  return text
    .split(" ")
    .map((word, index) => {
      if (!word) return word;
      if (word !== word.toLowerCase()) return word; // SEO, iPhone, YouTube
      if (index > 0 && SMALL_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function validateTitleInput(topic: string): string | null {
  const value = normalizeNiche(topic);
  if (value.length < TOPIC_MIN) return "Describe your video topic in a few words, for example “learning guitar”.";
  if (value.length > TOPIC_MAX) return `Keep your topic under ${TOPIC_MAX} characters.`;
  return null;
}

/**
 * Generates up to `count` unique titles (each within YouTube's 100 character limit).
 * `exclude` lets "Regenerate" avoid repeating what the user just saw, when possible.
 * Pass a seeded `rng` and a fixed `year` for deterministic output (tests).
 */
export function generateTitles(
  input: TitleInput,
  count: number = TITLE_COUNT,
  rng: Rng = Math.random,
  exclude: readonly string[] = [],
  year: number = new Date().getFullYear(),
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
    const title = template.text.replace(/\{(\w+)\}/g, (_match, key: string) => values[key] ?? "").replace(/ {2,}/g, " ").trim();
    return input.includeYear ? `${title} (${year})` : title;
  };

  const collect = (avoid: Set<string>, limit: number): string[] => {
    const out: string[] = [];
    const seen = new Set(avoid);
    for (let round = 0; round < 12 && out.length < limit; round++) {
      for (const template of shuffle(eligible, rng)) {
        if (out.length >= limit) break;
        const title = build(template);
        if (title.length > 0 && title.length <= TITLE_LIMIT && !seen.has(title)) {
          seen.add(title);
          out.push(title);
        }
      }
    }
    return out;
  };

  const fresh = collect(new Set(exclude), count);
  if (fresh.length >= count) return fresh;
  return [...fresh, ...collect(new Set(fresh), count - fresh.length)];
}
