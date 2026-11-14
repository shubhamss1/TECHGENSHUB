import assert from "node:assert/strict";
import { parseKeywords, type Rng } from "../lib/bio-generator";
import { PLATFORMS, TAG_MAX, generateHashtags, toTag, validateHashtagInput } from "../lib/hashtag-generator";

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

const VALID = new RegExp("^[\\p{L}\\p{M}\\p{N}]+$", "u");
let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log("hashtag-generator");

test("toTag strips symbols and spaces and lowercases", () => {
  assert.equal(toTag("Home Workouts!"), "homeworkouts");
  assert.equal(toTag("C++ & Rust"), "crust");
  assert.equal(toTag("!!"), "");
  assert.equal(toTag("हिंदी कंटेंट"), "हिंदीकंटेंट");
});

test("tags are valid, unique, short, and the topic tag comes first", () => {
  for (const platform of PLATFORMS) {
    const groups = generateHashtags({ topic: "Home Workouts", keywords: ["nutrition", "yoga"], platform, region: "India" }, mulberry32(5));
    const all = groups.flatMap((g) => g.tags);
    assert.equal(new Set(all).size, all.length, "unique across groups");
    for (const tag of all) {
      assert.ok(VALID.test(tag), `invalid tag: ${tag}`);
      assert.ok(tag.length <= TAG_MAX, `too long: ${tag}`);
      assert.equal(tag, tag.toLowerCase());
    }
    assert.equal(groups[0].id, "core");
    assert.equal(groups[0].tags[0], "homeworkouts");
    assert.ok(all.length >= 10 && all.length <= 30, `count ${all.length}`);
  }
});

test("India group only appears for the India region", () => {
  const input = { topic: "street food", keywords: [], platform: "Instagram" as const };
  assert.ok(generateHashtags({ ...input, region: "India" }, mulberry32(1)).some((g) => g.id === "india"));
  assert.ok(!generateHashtags({ ...input, region: "Global" }, mulberry32(1)).some((g) => g.id === "india"));
});

test("keywords group appears only when keywords are given", () => {
  const input = { topic: "travel", platform: "YouTube" as const, region: "Global" as const };
  assert.ok(!generateHashtags({ ...input, keywords: [] }, mulberry32(2)).some((g) => g.id === "keywords"));
  const withKw = generateHashtags({ ...input, keywords: parseKeywords("budget trips, solo travel") }, mulberry32(2));
  assert.ok(withKw.find((g) => g.id === "keywords")!.tags.includes("budgettrips"));
});

test("is deterministic for a seed and varies between seeds", () => {
  const input = { topic: "photography", keywords: ["portraits"], platform: "TikTok" as const, region: "Global" as const };
  assert.deepEqual(generateHashtags(input, mulberry32(11)), generateHashtags(input, mulberry32(11)));
  assert.notDeepEqual(generateHashtags(input, mulberry32(11)), generateHashtags(input, mulberry32(12)));
});

test("validateHashtagInput", () => {
  assert.notEqual(validateHashtagInput(""), null);
  assert.notEqual(validateHashtagInput("!!"), null);
  assert.notEqual(validateHashtagInput("x".repeat(29)), null);
  assert.equal(validateHashtagInput("home workouts"), null);
});

console.log(`\n${passed} tests passed`);
