/**
 * Local content calendar planner.
 * Builds a simple weekly posting plan (weekday, platform, content type, format and idea).
 * No network calls, no API keys. It does NOT claim "best times to post": days are simple suggestions.
 */
import { normalizeNiche, pick, shuffle, type Rng } from "./bio-generator";
import { PLATFORMS, type Platform } from "./hashtag-generator";

export { PLATFORMS, type Platform };

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export const POSTS_PER_WEEK = [1, 2, 3, 4, 5, 6, 7] as const;
export const WEEK_OPTIONS = [1, 2, 3, 4] as const;
export const TOPIC_MIN = 2;
export const TOPIC_MAX = 40;

export type ContentType = "Educational" | "Engagement" | "Behind the scenes" | "Story" | "Promotion";

export interface PlanInput {
  topic: string;
  platforms: Platform[];
  postsPerWeek: number;
  weeks: number;
}

export interface PlanItem {
  week: number;
  day: (typeof DAYS)[number];
  platform: Platform;
  type: ContentType;
  format: string;
  idea: string;
}

/** Which weekdays (0 = Monday) are used for a given number of posts per week. */
const DAY_PATTERNS: Record<number, number[]> = {
  1: [2],
  2: [1, 4],
  3: [0, 2, 4],
  4: [0, 2, 4, 6],
  5: [0, 1, 2, 3, 4],
  6: [0, 1, 2, 3, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
};

/** Mostly useful content, with a promotion only about one post in six. */
const CYCLE: ContentType[] = ["Educational", "Engagement", "Behind the scenes", "Educational", "Story", "Promotion"];

const IDEAS: Record<ContentType, string[]> = {
  Educational: [
    "Teach one simple thing about {topic}.",
    "Share a common mistake in {topic} and how to fix it.",
    "Give a quick how-to for beginners in {topic}.",
    "Bust a myth about {topic}.",
  ],
  Engagement: [
    "Ask your audience their biggest question about {topic}.",
    "Run a this-or-that poll about {topic}.",
    "Ask followers to share their {topic} wins.",
    "Invite people to tell you what they want to learn about {topic}.",
  ],
  "Behind the scenes": [
    "Show how you prepare for {topic}.",
    "Give a tour of your setup for {topic}.",
    "Share a day in your life with {topic}.",
    "Show your process from first idea to finished result.",
  ],
  Story: [
    "Tell how you got started with {topic}.",
    "Share a lesson {topic} has taught you.",
    "Show a before-and-after of your {topic} progress.",
    "Share a moment when {topic} did not go to plan.",
  ],
  Promotion: [
    "Share what you offer related to {topic}.",
    "Highlight one resource that helps with {topic}.",
    "Invite people to follow or subscribe for more {topic}.",
    "Share a recent piece of work and link to it.",
  ],
};

const FORMATS: Record<Platform, Record<ContentType, string[]>> = {
  Instagram: {
    Educational: ["Carousel", "Reel"],
    Engagement: ["Story poll", "Post"],
    "Behind the scenes": ["Story", "Reel"],
    Story: ["Reel", "Post"],
    Promotion: ["Post", "Story"],
  },
  YouTube: {
    Educational: ["Long video", "Short"],
    Engagement: ["Short", "Long video Q&A"],
    "Behind the scenes": ["Short", "Vlog"],
    Story: ["Long video", "Short"],
    Promotion: ["Short", "Long video"],
  },
  TikTok: {
    Educational: ["Short video"],
    Engagement: ["Short video", "Reply to a comment"],
    "Behind the scenes": ["Short video"],
    Story: ["Short video"],
    Promotion: ["Short video"],
  },
};

export function validatePlanInput(input: PlanInput): string | null {
  const topic = normalizeNiche(input.topic);
  if (topic.length < TOPIC_MIN) return "Enter your topic or niche, for example “home workouts”.";
  if (topic.length > TOPIC_MAX) return `Keep your topic under ${TOPIC_MAX} characters.`;
  if (input.platforms.length === 0) return "Choose at least one platform.";
  if (!DAY_PATTERNS[input.postsPerWeek]) return "Choose between 1 and 7 posts per week.";
  if (input.weeks < 1 || input.weeks > 4) return "Choose a plan of 1 to 4 weeks.";
  return null;
}

/** Builds the plan. Posts per week are the total across all chosen platforms, rotated in turn. */
export function generatePlan(input: PlanInput, rng: Rng = Math.random): PlanItem[] {
  const topic = normalizeNiche(input.topic);
  const platforms = PLATFORMS.filter((platform) => input.platforms.includes(platform));
  const days = DAY_PATTERNS[input.postsPerWeek] ?? [];
  const offset = Math.floor(rng() * CYCLE.length);
  const bags = new Map<ContentType, string[]>();

  const nextIdea = (type: ContentType): string => {
    let bag = bags.get(type) ?? [];
    if (bag.length === 0) bag = shuffle(IDEAS[type], rng);
    const idea = bag[bag.length - 1];
    bags.set(type, bag.slice(0, -1));
    return idea.replace(/\{topic\}/g, topic);
  };

  const plan: PlanItem[] = [];
  let index = 0;
  for (let week = 1; week <= input.weeks; week++) {
    for (const dayIndex of days) {
      const type = CYCLE[(index + offset) % CYCLE.length];
      const platform = platforms[index % platforms.length];
      plan.push({
        week,
        day: DAYS[dayIndex],
        platform,
        type,
        format: pick(FORMATS[platform][type], rng),
        idea: nextIdea(type),
      });
      index++;
    }
  }
  return plan;
}

export function planToText(plan: PlanItem[]): string {
  const lines: string[] = [];
  let currentWeek = 0;
  for (const item of plan) {
    if (item.week !== currentWeek) {
      if (lines.length > 0) lines.push("");
      lines.push(`Week ${item.week}`);
      currentWeek = item.week;
    }
    lines.push(`- ${item.day} · ${item.platform} · ${item.format} · ${item.type}: ${item.idea}`);
  }
  return lines.join("\n");
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function planToCsv(plan: PlanItem[]): string {
  const rows = [["Week", "Day", "Platform", "Format", "Content type", "Idea"]];
  for (const item of plan) rows.push([String(item.week), item.day, item.platform, item.format, item.type, item.idea]);
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
