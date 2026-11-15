import type { IconName } from "@/components/Icon";

export type ToolStatus = "live" | "coming-soon";
export type ToolCategory = "Instagram" | "YouTube" | "Planning";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  icon: IconName;
  keywords: string[];
}

export const TOOL_CATEGORIES: ToolCategory[] = ["Instagram", "YouTube", "Planning"];

export const TOOLS: Tool[] = [
  {
    slug: "instagram-bio-generator",
    name: "Instagram Bio Generator",
    description: "Generate bio ideas from your niche, tone and keywords. Runs in your browser.",
    category: "Instagram",
    status: "live",
    icon: "user",
    keywords: ["bio", "profile", "instagram", "about me"],
  },
  {
    slug: "hashtag-generator",
    name: "Hashtag Generator",
    description: "Generate keyword-based hashtag ideas for your posts and reels. Runs in your browser.",
    category: "Instagram",
    status: "live",
    icon: "hash",
    keywords: ["hashtags", "reach", "reels"],
  },
  {
    slug: "caption-generator",
    name: "Caption Generator",
    description: "Draft ready-to-edit captions from your post topic, goal and tone. Runs in your browser.",
    category: "Instagram",
    status: "live",
    icon: "message",
    keywords: ["caption", "copywriting", "posts"],
  },
  {
    slug: "youtube-title-ideas",
    name: "YouTube Title Ideas",
    description: "Brainstorm clear video title ideas from your topic and style. Runs in your browser.",
    category: "YouTube",
    status: "live",
    icon: "play",
    keywords: ["video", "titles", "youtube", "shorts"],
  },
  {
    slug: "thumbnail-text-ideas",
    name: "Thumbnail Text Ideas",
    description: "Get short, punchy text ideas for your video thumbnails. Runs in your browser.",
    category: "YouTube",
    status: "live",
    icon: "type",
    keywords: ["thumbnail", "text", "youtube"],
  },
  {
    slug: "content-calendar-planner",
    name: "Content Calendar Planner",
    description: "Plan a consistent posting schedule across your platforms.",
    category: "Planning",
    status: "coming-soon",
    icon: "calendar",
    keywords: ["schedule", "planner", "calendar", "consistency"],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function searchTools(tools: Tool[], query: string, category: ToolCategory | "All"): Tool[] {
  const q = query.trim().toLowerCase();
  return tools.filter((tool) => {
    if (category !== "All" && tool.category !== category) return false;
    if (!q) return true;
    const haystack = [tool.name, tool.description, tool.category, ...tool.keywords].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
