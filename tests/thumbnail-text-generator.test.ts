import assert from "node:assert/strict";
import type { Rng } from "../lib/bio-generator";
import {
  MAX_CHARS,
  MAX_WORDS,
  TEXT_COUNT,
  THUMBNAIL_STYLES,
  countWords,
  generateThumbnailTexts,
  validateThumbnailInput,
} from "../lib/thumbnail-text-generator";

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

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log("thumbnail-text-generator");

test("every style gives unique, short texts with no leftover tokens (with and without keywords, caps on/off)", () => {
  for (const style of THUMBNAIL_STYLES) {
    for (const keywords of [[], ["budget", "solo"]]) {
      for (const uppercase of [false, true]) {
        const out = generateThumbnailTexts({ topic: "learning guitar", style, keywords, uppercase }, TEXT_COUNT, mulberry32(5));
        assert.equal(out.length, TEXT_COUNT, `${style}/${keywords.length}/${uppercase}: ${out.length}`);
        assert.equal(new Set(out).size, out.length);
        for (const text of out) {
          assert.ok(text.length <= MAX_CHARS, `too long: ${text}`);
          assert.ok(countWords(text) <= MAX_WORDS, `too many words: ${text}`);
          assert.ok(!/[{}]/.test(text), `token left in: ${text}`);
          assert.ok(!/ {2,}/.test(text));
          if (uppercase) assert.equal(text, text.toUpperCase());
        }
      }
    }
  }
});

test("a longer topic still works and never breaks the word or character limits", () => {
  for (const style of THUMBNAIL_STYLES) {
    const out = generateThumbnailTexts({ topic: "budget travel in india", style, keywords: [], uppercase: false }, TEXT_COUNT, mulberry32(2));
    assert.ok(out.length >= 4, `${style}: only ${out.length}`);
    for (const text of out) {
      assert.ok(countWords(text) <= MAX_WORDS && text.length <= MAX_CHARS, text);
    }
  }
});

test("deterministic per seed; regenerate avoids repeats when possible", () => {
  const input = { topic: "home workouts", style: "Curiosity" as const, keywords: ["yoga"], uppercase: false };
  assert.deepEqual(generateThumbnailTexts(input, 8, mulberry32(3)), generateThumbnailTexts(input, 8, mulberry32(3)));
  const first = generateThumbnailTexts(input, 8, mulberry32(3));
  const second = generateThumbnailTexts(input, 8, mulberry32(9), first);
  assert.equal(second.filter((text) => first.includes(text)).length, 0);
});

test("validateThumbnailInput", () => {
  assert.notEqual(validateThumbnailInput(""), null);
  assert.notEqual(validateThumbnailInput("a"), null);
  assert.notEqual(validateThumbnailInput("x".repeat(31)), null);
  assert.equal(validateThumbnailInput("learning guitar"), null);
});

console.log(`\n${passed} tests passed`);
