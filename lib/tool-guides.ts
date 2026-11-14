/** Helpful written guidance shown under each live tool (original content for readers and search). */

export interface ToolGuide {
  howTo: string[];
  tips: string[];
  faq: { q: string; a: string }[];
}

export const TOOL_GUIDES: Record<string, ToolGuide> = {
  "instagram-bio-generator": {
    howTo: [
      "Type your niche, such as “fitness coach” or “travel blogger”.",
      "Choose a tone that matches how you talk to your audience.",
      "Add up to five keywords for more varied results, then press Generate bios.",
      "Copy the bio you like and paste it into your Instagram profile. Press Regenerate for fresh options.",
    ],
    tips: [
      "Every suggestion fits within Instagram’s 150 character bio limit, and the character count is shown.",
      "Say who you help or what you share in the first line, because that is what people read first.",
      "Edit the result. Add your own words, your city or a specific detail so it sounds like you.",
      "Match the tone to your content. Minimal suits portfolios, while Friendly suits community pages.",
      "Revisit your bio whenever your focus changes.",
    ],
    faq: [
      { q: "Is the Instagram Bio Generator free?", a: "Yes. It is free to use and does not need an account." },
      { q: "Does it use AI or send my text anywhere?", a: "No. It builds bios from local templates in your browser, so what you type is not sent to a server." },
      { q: "How long can an Instagram bio be?", a: "Instagram bios have a 150 character limit. Every suggestion here is kept within it." },
      { q: "Why do some bios sound odd with my niche?", a: "Templates use your niche word for word, so role-style niches like “fitness coach” read best. Edit any result to fit." },
      { q: "Can I use the bios on my own profile?", a: "Yes. They are suggestions for you to edit and use on your own profiles." },
    ],
  },
  "hashtag-generator": {
    howTo: [
      "Enter a topic, such as “home workouts” or “street food”.",
      "Add optional keywords, pick a platform and choose Global or India.",
      "Press Generate hashtags to get grouped ideas.",
      "Tap hashtags to include or remove them, then press Copy selected.",
    ],
    tips: [
      "Mix broad and specific hashtags instead of using only one kind.",
      "Choose hashtags that describe your post. Relevance matters more than quantity.",
      "Search each hashtag on the platform to see what content appears before you use it.",
      "Check the platform’s current guidance on how many hashtags to use.",
      "Refresh your hashtag sets regularly instead of reusing the same ones every time.",
    ],
    faq: [
      { q: "Does the generator show how popular a hashtag is?", a: "No. It creates keyword-based ideas and does not measure popularity. Check reach in the platform’s own search." },
      { q: "How many hashtags should I use?", a: "That depends on the platform and can change, so check its current guidance. You can remove any hashtag before you copy." },
      { q: "Is it free and private?", a: "Yes. It is free, needs no account and runs in your browser." },
      { q: "Why does the India option add extra hashtags?", a: "It adds a small group of India-focused hashtags to help you reach local audiences. Remove any that do not fit." },
      { q: "Does it work for non-English topics?", a: "Yes. Topics typed in other languages, including Hindi, are turned into hashtags the same way." },
    ],
  },
};
