import assert from "node:assert/strict";
import { TONES, type Rng } from "../lib/bio-generator";
import { CAPTION_COUNT, CAPTION_GOALS, CAPTION_LIMIT, generateCaptions, validateCaptionInput } from "../lib/caption-generator";

function mulberry32(seed: number): Rng {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PICTOGRAPHIC = new RegExp("\\p{Extended_Pictographic}", "u");
let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log("caption-generator");

test("every tone and goal gives unique, in-limit captions with no leftover tokens", () => {
  for (const tone of TONES) {
    for (const goal of CAPTION_GOALS) {
      for (const keywords of [[], ["home workouts", "nutrition"]]) {
        const out = generateCaptions({ topic: "my morning routine", goal, tone, keywords, includeCta: true, includeEmoji: true }, CAPTION_COUNT, mulberry32(4));
        assert.equal(out.length, CAPTION_COUNT, `${tone}/${goal}/${keywords.length}: count ${out.length}`);
        assert.equal(new Set(out).size, out.length);
        for (const caption of out) {
          assert.ok(caption.length <= CAPTION_LIMIT);
          assert.ok(!/[{}]/.test(caption), `token left in: ${caption}`);
          assert.ok(!/ {2,}/.test(caption), `double space in: ${caption}`);
        }
      }
    }
  }
});

test("emoji off removes emoji; CTA off shortens the caption", () => {
  const base = { topic: "my new recipe", goal: "Promote" as const, tone: "Friendly" as const, keywords: [] as string[] };
  for (const caption of generateCaptions({ ...base, includeCta: true, includeEmoji: false }, 6, mulberry32(8))) {
    assert.ok(!PICTOGRAPHIC.test(caption), `emoji found: ${caption}`);
  }
  for (const caption of generateCaptions({ ...base, includeCta: false, includeEmoji: true }, 6, mulberry32(8))) {
    assert.equal(caption.split("\n\n").length, 2, `expected 2 parts: ${caption}`);
  }
  for (const caption of generateCaptions({ ...base, includeCta: true, includeEmoji: true }, 6, mulberry32(8))) {
    assert.equal(caption.split("\n\n").length, 3);
  }
});

test("even the tightest settings (Minimal, no CTA, no emoji, no keywords) yield several options", () => {
  const out = generateCaptions({ topic: "travel diary", goal: "Share a tip", tone: "Minimal", keywords: [], includeCta: false, includeEmoji: false }, 6, mulberry32(2));
  assert.ok(out.length >= 4, `got ${out.length}`);
});

test("deterministic per seed; regenerate avoids repeats when possible", () => {
  const input = { topic: "street food tour", goal: "Tell a story" as const, tone: "Witty" as const, keywords: ["momos"], includeCta: true, includeEmoji: true };
  assert.deepEqual(generateCaptions(input, 6, mulberry32(3)), generateCaptions(input, 6, mulberry32(3)));
  const first = generateCaptions(input, 6, mulberry32(3));
  const second = generateCaptions(input, 6, mulberry32(9), first);
  assert.equal(second.filter((c) => first.includes(c)).length, 0);
});

test("validateCaptionInput", () => {
  assert.notEqual(validateCaptionInput(""), null);
  assert.notEqual(validateCaptionInput("hi"), null);
  assert.notEqual(validateCaptionInput("x".repeat(101)), null);
  assert.equal(validateCaptionInput("my morning routine"), null);
});

console.log(`\n${passed} tests passed`);
