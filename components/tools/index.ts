import type { ComponentType } from "react";
import CaptionGenerator from "./CaptionGenerator";
import HashtagGenerator from "./HashtagGenerator";
import InstagramBioGenerator from "./InstagramBioGenerator";
import ThumbnailTextGenerator from "./ThumbnailTextGenerator";
import YouTubeTitleGenerator from "./YouTubeTitleGenerator";

/** Maps a tool slug to its interactive component. Add new live tools here. */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "instagram-bio-generator": InstagramBioGenerator,
  "hashtag-generator": HashtagGenerator,
  "caption-generator": CaptionGenerator,
  "youtube-title-ideas": YouTubeTitleGenerator,
  "thumbnail-text-ideas": ThumbnailTextGenerator,
};
