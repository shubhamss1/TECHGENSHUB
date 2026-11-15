import assert from "node:assert/strict";
import type { Rng } from "../lib/bio-generator";
import { DAYS, PLATFORMS, generatePlan, planToCsv, planToText, validatePlanInput, type PlanInput } from "../lib/content-calendar";

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

console.log("content-calendar");

const base: PlanInput = { topic: "home workouts", platforms: ["Instagram", "YouTube"], postsPerWeek: 3, weeks: 2 };

test("every combination gives weeks x posts items on valid weekdays, with no leftover tokens", () => {
  for (let postsPerWeek = 1; postsPerWeek <= 7; postsPerWeek++) {
    for (let weeks = 1; weeks <= 4; weeks++) {
      const plan = generatePlan({ ...base, postsPerWeek, weeks }, mulberry32(postsPerWeek * 10 + weeks));
      assert.equal(plan.length, postsPerWeek * weeks);
      for (let week = 1; week <= weeks; week++) {
        const items = plan.filter((item) => item.week === week);
        assert.equal(items.length, postsPerWeek);
        const dayIdx = items.map((item) => DAYS.indexOf(item.day));
        assert.deepEqual(dayIdx, [...dayIdx].sort((a, b) => a - b), "days in order");
        assert.equal(new Set(dayIdx).size, dayIdx.length, "no day twice in a week");
      }
      for (const item of plan) {
        assert.ok(!/[{}]/.test(item.idea), item.idea);
        assert.ok(item.format.length > 0);
      }
    }
  }
});

test("only chosen platforms are used, and all of them appear when there are enough posts", () => {
  for (const platforms of [["TikTok"], ["Instagram", "TikTok"], [...PLATFORMS]] as PlanInput["platforms"][]) {
    const plan = generatePlan({ ...base, platforms, postsPerWeek: 4, weeks: 2 }, mulberry32(3));
    for (const item of plan) assert.ok(platforms.includes(item.platform));
    for (const platform of platforms) assert.ok(plan.some((item) => item.platform === platform), `${platform} missing`);
  }
});

test("promotion stays a minority of posts", () => {
  const plan = generatePlan({ ...base, postsPerWeek: 6, weeks: 4 }, mulberry32(11));
  const promos = plan.filter((item) => item.type === "Promotion").length;
  assert.ok(promos <= plan.length / 4, `${promos}/${plan.length} promotions`);
});

test("ideas are not repeated until each type's ideas have all been used", () => {
  const plan = generatePlan({ ...base, postsPerWeek: 7, weeks: 1, platforms: ["Instagram"] }, mulberry32(5));
  const educational = plan.filter((item) => item.type === "Educational").map((item) => item.idea);
  assert.equal(new Set(educational).size, educational.length);
});

test("deterministic per seed", () => {
  assert.deepEqual(generatePlan(base, mulberry32(8)), generatePlan(base, mulberry32(8)));
});

test("planToText and planToCsv", () => {
  const plan = generatePlan(base, mulberry32(2));
  const text = planToText(plan);
  assert.ok(text.startsWith("Week 1"));
  assert.ok(text.includes("Week 2"));
  const csv = planToCsv(plan);
  const lines = csv.split("\r\n");
  assert.equal(lines[0], "Week,Day,Platform,Format,Content type,Idea");
  assert.equal(lines.length, plan.length + 1);
  // ideas contain commas or quotes sometimes: those cells must be quoted correctly
  const tricky = planToCsv([{ week: 1, day: "Monday", platform: "TikTok", type: "Story", format: "Short video", idea: 'Say "hi", then go' }]);
  assert.ok(tricky.endsWith('"Say ""hi"", then go"'));
});

test("validatePlanInput", () => {
  assert.equal(validatePlanInput(base), null);
  assert.notEqual(validatePlanInput({ ...base, topic: "" }), null);
  assert.notEqual(validatePlanInput({ ...base, topic: "x".repeat(41) }), null);
  assert.notEqual(validatePlanInput({ ...base, platforms: [] }), null);
  assert.notEqual(validatePlanInput({ ...base, postsPerWeek: 8 }), null);
  assert.notEqual(validatePlanInput({ ...base, weeks: 5 }), null);
});

console.log(`\n${passed} tests passed`);
