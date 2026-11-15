import assert from "node:assert/strict";
import type { Rng } from "../lib/bio-generator";
import { TITLE_COUNT, TITLE_LIMIT, TITLE_STYLES, generateTitles, toTitleCase, validateTitleInput } from "../lib/youtube-title-generator";

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

console.log("youtube-title-generator");

test("toTitleCase handles small words, acronyms and mixed case", () => {
  assert.equal(toTitleCase("learning SEO for the web"), "Learning SEO for the Web");
  assert.equal(toTitleCase("iPhone photography tips"), "iPhone Photography Tips");
  assert.equal(toTitleCase("budget travel in india"), "Budget Travel in India");
});

test("every style returns unique, in-limit titles with no leftover tokens (with and without keywords)", () => {
  for (const style of TITLE_STYLES) {
    for (const keywords of [[], ["budget", "solo travel"]]) {
      for (const includeYear of [false, true]) {
        const titles = generateTitles({ topic: "budget travel in india", style, keywords, includeYear }, TITLE_COUNT, mulberry32(6), [], 2026);
        assert.equal(titles.length, TITLE_COUNT, `${style}/${keywords.length}/${includeYear}: ${titles.length}`);
        assert.equal(new Set(titles).size, titles.length);
        for (const title of titles) {
          assert.ok(title.length <= TITLE_LIMIT);
          assert.ok(!/[{}]/.test(title), `token left in: ${title}`);
          assert.ok(!/ {2,}/.test(title));
          assert.equal(title.endsWith("(2026)"), includeYear, `year flag wrong: ${title}`);
        }
      }
    }
  }
});

test("topic and keywords are title-cased inside titles", () => {
  const titles = generateTitles({ topic: "learning guitar", style: "List", keywords: ["chords", "practice"], includeYear: false }, 8, mulberry32(1));
  assert.ok(titles.some((title) => title.includes("Learning Guitar")));
  assert.ok(titles.every((title) => !title.includes("learning guitar")));
});

test("deterministic per seed; regenerate avoids repeats when possible", () => {
  const input = { topic: "home workouts", style: "Story" as const, keywords: ["yoga"], includeYear: false };
  assert.deepEqual(generateTitles(input, 8, mulberry32(3)), generateTitles(input, 8, mulberry32(3)));
  const first = generateTitles(input, 8, mulberry32(3));
  const second = generateTitles(input, 8, mulberry32(9), first);
  assert.equal(second.filter((title) => first.includes(title)).length, 0);
});

test("validateTitleInput", () => {
  assert.notEqual(validateTitleInput(""), null);
  assert.notEqual(validateTitleInput("ab"), null);
  assert.notEqual(validateTitleInput("x".repeat(51)), null);
  assert.equal(validateTitleInput("learning guitar"), null);
});

console.log(`\n${passed} tests passed`);
