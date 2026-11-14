import type { ComponentType } from "react";
import HashtagGenerator from "./HashtagGenerator";
import InstagramBioGenerator from "./InstagramBioGenerator";

/** Maps a tool slug to its interactive component. Add new live tools here. */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "instagram-bio-generator": InstagramBioGenerator,
  "hashtag-generator": HashtagGenerator,
};
