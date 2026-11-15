/**
 * Local, template-based caption generator.
 * No network calls, no API keys. Captions are built from a hook, a body and an optional call to action.
 */
import { normalizeNiche, parseKeywords, pick, shuffle, type Rng, type Tone } from "./bio-generator";

export const CAPTION_GOALS = ["Spark conversation", "Promote", "Tell a story", "Share a tip"] as const;
export type CaptionGoal = (typeof CAPTION_GOALS)[number];

export const CAPTION_LIMIT = 2200; // Instagram's caption character limit
export const CAPTION_COUNT = 6;
export const TOPIC_MIN = 3;
export const TOPIC_MAX = 100;

export interface CaptionInput {
  topic: string;
  goal: CaptionGoal;
  tone: Tone;
  keywords: string[];
  includeCta: boolean;
  includeEmoji: boolean;
}

interface Body {
  text: string;
  needs: number;
}

const b = (text: string, needs = 0): Body => ({ text, needs });

const EMOJIS: Record<Tone, string[]> = {
  Friendly: ["✨", "💜", "😊", "🙌"],
  Professional: ["📌", "💼", "🎯"],
  Bold: ["🔥", "⚡", "🚀"],
  Witty: ["😏", "🙃", "🤷"],
  Inspirational: ["🌱", "✨", "💫"],
  Minimal: ["✦", "·", "→"],
};

const HOOKS: Record<Tone, string[]> = {
  Friendly: ["Let’s talk about {topic} {e}", "{Topic} has been on my mind lately {e}", "Quick one about {topic} {e}"],
  Professional: ["{Topic}: what you need to know.", "A closer look at {topic}.", "Today’s focus: {topic}."],
  Bold: ["{Topic}. No more excuses. {e}", "Stop scrolling. This is about {topic}. {e}", "Time to take {topic} seriously {e}"],
  Witty: ["Me, thinking about {topic} again {e}", "Plot twist: {topic} {e}", "Breaking news: I have thoughts on {topic} {e}"],
  Inspirational: ["Every journey with {topic} starts somewhere {e}", "{Topic} is a reminder to keep going {e}", "Small steps with {topic} add up {e}"],
  Minimal: ["{Topic}.", "{Topic} {e}", "On {topic}."],
};

const BODIES: Record<CaptionGoal, Body[]> = {
  "Spark conversation": [
    b("What’s your take on {topic}? I’d love to hear it."),
    b("Tell me something about {topic} that I might be missing."),
    b("Let’s hear it: how do you feel about {topic}?"),
    b("If you’re into {k1}, you’ll have an opinion on this.", 1),
    b("Which matters more to you: {k1} or {k2}?", 2),
  ],
  Promote: [
    b("Here’s what I’m working on: {topic}."),
    b("I put a lot of care into {topic}, and I’m excited to share it."),
    b("Sharing something new today: {topic}."),
    b("If {k1} matters to you, this one is for you.", 1),
    b("Made for anyone who cares about {k1} and {k2}.", 2),
  ],
  "Tell a story": [
    b("It started small, and {topic} changed how I see things."),
    b("Here’s the story behind {topic}."),
    b("I didn’t plan for {topic}, but I’m glad it happened."),
    b("I didn’t expect {topic} to teach me so much about {k1}.", 1),
    b("Three words for how {topic} felt: {k1}, {k2} and worth it.", 2),
  ],
  "Share a tip": [
    b("One thing that helped me with {topic}: keep it simple."),
    b("My tip for {topic}: start small and stay consistent."),
    b("If {topic} feels hard, break it into smaller steps."),
    b("If you care about {k1}, begin with one small change.", 1),
    b("Quick tip: pair {k1} with {k2} and see what happens.", 2),
  ],
};

const CTAS: Record<CaptionGoal, string[]> = {
  "Spark conversation": ["Tell me in the comments ↓", "Drop your thoughts below ↓", "Reply or tag a friend who agrees."],
  Promote: ["Link in bio ↓", "Tap the link in my bio to learn more.", "Save this for later and share it with a friend."],
  "Tell a story": ["Has this happened to you? Share below ↓", "Save this if it resonated.", "Follow along for more."],
  "Share a tip": ["Save this for later.", "Share it with someone who needs it.", "Follow for more tips."],
};

export function validateCaptionInput(topic: string): string | null {
  const value = normalizeNiche(topic);
  if (value.length < TOPIC_MIN) return "Describe your post in a few words, for example “my new morning routine”.";
  if (value.length > TOPIC_MAX) return `Keep your topic under ${TOPIC_MAX} characters.`;
  return null;
}

function buildCaption(input: CaptionInput, topic: string, keywords: string[], rng: Rng): string {
  const ks = shuffle(keywords, rng);
  const emoji = input.includeEmoji ? pick(EMOJIS[input.tone], rng) : "";
  const bodies = BODIES[input.goal].filter((body) => body.needs <= keywords.length);

  const parts = [pick(HOOKS[input.tone], rng), pick(bodies, rng).text];
  if (input.includeCta) parts.push(pick(CTAS[input.goal], rng));

  const values: Record<string, string> = {
    Topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    topic,
    k1: ks[0] ?? "",
    k2: ks[1] ?? "",
  };

  return parts
    .join("\n\n")
    .replace(/\s*\{e\}/g, emoji ? ` ${emoji}` : "")
    .replace(/\{(\w+)\}/g, (_match, key: string) => values[key] ?? "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

/**
 * Generates up to `count` unique captions. `exclude` lets "Regenerate" avoid repeating what
 * the user just saw, when possible. Pass a seeded `rng` for deterministic output (tests).
 */
export function generateCaptions(
  input: CaptionInput,
  count: number = CAPTION_COUNT,
  rng: Rng = Math.random,
  exclude: readonly string[] = [],
): string[] {
  const topic = normalizeNiche(input.topic);
  const keywords = parseKeywords(input.keywords.join(","));

  const collect = (avoid: Set<string>, limit: number): string[] => {
    const out: string[] = [];
    const seen = new Set(avoid);
    for (let attempt = 0; attempt < limit * 30 && out.length < limit; attempt++) {
      const caption = buildCaption(input, topic, keywords, rng);
      if (caption.length > 0 && caption.length <= CAPTION_LIMIT && !seen.has(caption)) {
        seen.add(caption);
        out.push(caption);
      }
    }
    return out;
  };

  const fresh = collect(new Set(exclude), count);
  if (fresh.length >= count) return fresh;
  return [...fresh, ...collect(new Set(fresh), count - fresh.length)];
}
