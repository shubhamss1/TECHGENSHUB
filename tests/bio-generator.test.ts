import assert from "node:assert/strict";
import {
  BIO_COUNT,
  BIO_LIMIT,
  TONES,
  generateBios,
  parseKeywords,
  validateBioInput,
  type Rng,
} from "../lib/bio-generator";

/** Small seeded RNG so tests are deterministic. */
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

console.log("bio-generator");

test("every tone returns the requested number of unique, in-limit bios (with keywords)", () => {
  for (const tone of TONES) {
    const bios = generateBios({ niche: "fitness coach", tone, keywords: ["home workouts", "nutrition", "habits"] }, BIO_COUNT, mulberry32(7));
    assert.equal(bios.length, BIO_COUNT, `${tone}: count`);
    assert.equal(new Set(bios).size, bios.length, `${tone}: unique`);
    for (const bio of bios) {
      assert.ok(bio.length > 0 && bio.length <= BIO_LIMIT, `${tone}: length ${bio.length}`);
      assert.ok(!/[{}]/.test(bio), `${tone}: unresolved token in "${bio}"`);
    }
  }
});

test("works with zero keywords for every tone", () => {
  for (const tone of TONES) {
    const bios = generateBios({ niche: "travel blogger", tone, keywords: [] }, BIO_COUNT, mulberry32(3));
    assert.ok(bios.length >= 3, `${tone}: got ${bios.length}`);
    for (const bio of bios) {
      assert.ok(!/[{}]/.test(bio), `${tone}: unresolved token in "${bio}"`);
      assert.ok(!/\s{2,}/.test(bio.replace(/\n/g, " ")), `${tone}: double spaces in "${bio}"`);
    }
  }
});

test("is deterministic for a given seed", () => {
  const input = { niche: "photographer", tone: "Bold" as const, keywords: ["portraits"] };
  assert.deepEqual(generateBios(input, 6, mulberry32(42)), generateBios(input, 6, mulberry32(42)));
});

test("regenerate (exclude) avoids repeating previous results when possible", () => {
  const input = { niche: "food creator", tone: "Friendly" as const, keywords: ["street food", "recipes"] };
  const first = generateBios(input, 6, mulberry32(1));
  const second = generateBios(input, 6, mulberry32(2), first);
  assert.equal(second.filter((bio) => first.includes(bio)).length, 0);
});

test("never exceeds the length limit even with long inputs", () => {
  const bios = generateBios(
    { niche: "a".repeat(50), tone: "Witty", keywords: ["k".repeat(30), "j".repeat(30), "m".repeat(30)] },
    6,
    mulberry32(9),
  );
  for (const bio of bios) assert.ok(bio.length <= BIO_LIMIT);
});

test("parseKeywords trims, de-duplicates, drops empties and caps at 5", () => {
  assert.deepEqual(parseKeywords(" a, B ,b,,c\nd, e, f, g"), ["a", "B", "c", "d", "e"]);
  assert.deepEqual(parseKeywords(""), []);
});

test("validateBioInput", () => {
  assert.notEqual(validateBioInput(""), null);
  assert.notEqual(validateBioInput(" a "), null);
  assert.notEqual(validateBioInput("x".repeat(51)), null);
  assert.equal(validateBioInput("fitness coach"), null);
});

console.log(`\n${passed} tests passed`);
