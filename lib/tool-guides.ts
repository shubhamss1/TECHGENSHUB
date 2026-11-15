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
  "caption-generator": {
    howTo: [
      "Describe what your post is about, for example “my new morning routine”.",
      "Pick a goal: spark conversation, promote, tell a story or share a tip.",
      "Choose a tone, add optional keywords, and decide whether to include a call to action and emoji.",
      "Press Generate captions, copy the one you like and edit it before you post. Press Regenerate for more options.",
    ],
    tips: [
      "Lead with your hook. The first line is what people see before they tap “more”.",
      "Describe your post in a short phrase rather than a full sentence, so the captions read naturally.",
      "Personalise the caption with a real detail, such as a place, a name or a result.",
      "Use one clear call to action per post, such as comment, save or visit the link.",
      "Read it aloud once. If it does not sound like you, change it.",
    ],
    faq: [
      { q: "Is the Caption Generator free?", a: "Yes. It is free to use and does not need an account." },
      { q: "Does it use AI or send my text anywhere?", a: "No. It assembles captions from local templates in your browser, so nothing you type is sent to a server." },
      { q: "How long can an Instagram caption be?", a: "Instagram captions can be up to 2,200 characters. These suggestions are much shorter and show their character count." },
      { q: "Can I use it for YouTube or TikTok?", a: "Yes. The captions are general purpose, so you can adapt them, but check each platform’s own limits." },
      { q: "Why does my topic sound awkward in a caption?", a: "Your topic is inserted word for word, so a short phrase such as “my morning routine” works best. Edit any result to fit." },
    ],
  },
  "youtube-title-ideas": {
    howTo: [
      "Enter your video topic in a few words, for example “budget travel in India” or “learning guitar”.",
      "Pick a title style: how-to, list, question, story or review.",
      "Add optional keywords, and switch on “Add the current year” if the video is time-sensitive.",
      "Press Generate titles, copy the ones you like and edit them. Press Regenerate for more ideas.",
    ],
    tips: [
      "Make sure the title honestly matches your video. Misleading titles can hurt viewer trust and may break YouTube’s rules.",
      "Put your main keyword near the start, so viewers and search can see what the video is about.",
      "Keep titles clear and fairly short. Long titles can be cut off in some places, and the count shows each title’s length.",
      "Write two or three versions and pick the one that matches your thumbnail and opening seconds.",
      "Only add a year if the information will go out of date, such as a guide or a review.",
    ],
    faq: [
      { q: "Is the YouTube Title Ideas tool free?", a: "Yes. It is free to use and does not need an account." },
      { q: "Does it use AI or send my topic anywhere?", a: "No. It builds titles from local templates in your browser, so nothing you type is sent to a server." },
      { q: "How long can a YouTube title be?", a: "YouTube titles can be up to 100 characters. Every suggestion here fits that limit and shows its length." },
      { q: "Will these titles get me more views?", a: "No tool can promise that. These are starting points. A good title still needs to match a good video." },
      { q: "Why is my topic capitalised in the titles?", a: "Titles read best in Title Case, so your topic is capitalised for you. Words that already have capitals, such as SEO or iPhone, are left as you typed them." },
    ],
  },
  "thumbnail-text-ideas": {
    howTo: [
      "Enter your video topic as a short word or phrase, for example “guitar” or “keto diet”.",
      "Pick a style: curiosity, benefit, warning, challenge or minimal.",
      "Add optional keywords, and choose whether you want ALL CAPS.",
      "Press Generate thumbnail text, copy the one you like and add it to your thumbnail design. Press Regenerate for more ideas.",
    ],
    tips: [
      "Keep thumbnail text to a few words. Every idea here is six words or fewer.",
      "Do not repeat your whole title. Let the text add a hook that the title does not already give.",
      "Use large, high-contrast letters so the text stays readable on a phone screen.",
      "Make sure the text is true to the video. Misleading thumbnails can cost you viewers’ trust.",
      "Try two or three different texts and see which one fits your image best.",
    ],
    faq: [
      { q: "Is the Thumbnail Text Ideas tool free?", a: "Yes. It is free to use and does not need an account." },
      { q: "Does it use AI or send my topic anywhere?", a: "No. It builds text from local templates in your browser, so nothing you type is sent to a server." },
      { q: "How long should thumbnail text be?", a: "As short as you can make it. This tool keeps every idea to six words or fewer and 40 characters or fewer." },
      { q: "Will this text get me more clicks?", a: "No tool can promise that. These are starting points. Test what works for your audience." },
      { q: "Why does my topic work better as a short word?", a: "The ideas insert your topic word for word, so a short noun such as “guitar” reads better than a long phrase. You can always edit the result." },
    ],
  },
};
