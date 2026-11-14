/**
 * Local, keyword-based hashtag idea generator.
 * No network calls, no API keys. It does NOT measure hashtag popularity,
 * so it never claims reach or post counts.
 */
import { normalizeNiche, parseKeywords, pick, shuffle, type Rng } from "./bio-generator";

export const PLATFORMS = ["Instagram", "YouTube", "TikTok"] as const;
export const REGIONS = ["Global", "India"] as const;
export type Platform = (typeof PLATFORMS)[number];
export type Region = (typeof REGIONS)[number];

export const TOPIC_MAX = 28;
export const TAG_MAX = 30;
const CORE_EXTRA = 7;

export interface HashtagInput {
  topic: string;
  keywords: string[];
  platform: Platform;
  region: Region;
}

export interface HashtagGroup {
  id: "core" | "keywords" | "platform" | "india";
  title: string;
  /** Tags without the leading "#". */
  tags: string[];
}

const CORE_SUFFIXES = ["tips", "life", "daily", "community", "goals", "ideas", "lovers", "inspo", "journey", "motivation", "world", "vibes"];
const CORE_PREFIXES = ["learn", "best", "love", "my"];
const KEYWORD_SUFFIXES = ["tips", "ideas", "daily", "life"];

const PLATFORM_TAGS: Record<Platform, string[]> = {
  Instagram: ["reels", "instagramreels", "contentcreator", "creatorsofinstagram", "instagramgrowth", "socialmediatips", "smallcreators", "creatortips"],
  YouTube: ["shorts", "youtubeshorts", "youtubecreator", "youtubers", "smallyoutuber", "videomarketing", "contentcreator", "creatortips"],
  TikTok: ["tiktokcreator", "tiktoktips", "contentcreator", "creatortips", "smallcreators", "videotips", "tiktokcommunity", "learnontiktok"],
};

const INDIA_TAGS = ["indiancreator", "indiancontentcreator", "indiacreators", "creatorsindia"];

// Built from a string so older TS targets don't try to validate the \p escapes.
const NON_TAG_CHARS = new RegExp("[^\\p{L}\\p{M}\\p{N}]+", "gu");

/** "Home Workouts!" -> "homeworkouts" (letters, marks and digits only; works for Hindi too). */
export function toTag(raw: string): string {
  return raw.toLowerCase().replace(NON_TAG_CHARS, "");
}

export function validateHashtagInput(topic: string): string | null {
  if (toTag(topic).length < 2) return "Enter a topic, for example “home workouts”.";
  if (normalizeNiche(topic).length > TOPIC_MAX) return `Keep your topic under ${TOPIC_MAX} characters.`;
  return null;
}

/** Returns grouped, de-duplicated hashtag ideas. Pass a seeded `rng` for deterministic output. */
export function generateHashtags(input: HashtagInput, rng: Rng = Math.random): HashtagGroup[] {
  const base = toTag(input.topic);
  const used = new Set<string>();
  const groups: HashtagGroup[] = [];

  const add = (id: HashtagGroup["id"], title: string, candidates: string[]) => {
    const tags: string[] = [];
    for (const tag of candidates) {
      if (tag.length >= 2 && tag.length <= TAG_MAX && !used.has(tag)) {
        used.add(tag);
        tags.push(tag);
      }
    }
    if (tags.length > 0) groups.push({ id, title, tags });
  };

  const variants = shuffle([...CORE_SUFFIXES.map((s) => base + s), ...CORE_PREFIXES.map((p) => p + base)], rng).slice(0, CORE_EXTRA);
  add("core", "Topic", [base, ...variants]);

  const keywordTags = parseKeywords(input.keywords.join(",")).flatMap((keyword) => {
    const tag = toTag(keyword);
    return tag ? [tag, tag + pick(KEYWORD_SUFFIXES, rng)] : [];
  });
  add("keywords", "Your keywords", keywordTags);

  add("platform", `${input.platform} and creators`, shuffle(PLATFORM_TAGS[input.platform], rng).slice(0, 5));

  if (input.region === "India") {
    add("india", "India", [`${base}india`, `indian${base}`, ...shuffle(INDIA_TAGS, rng).slice(0, 2)]);
  }

  return groups;
}
