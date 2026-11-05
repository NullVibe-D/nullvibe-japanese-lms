import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

await mkdir("qa", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.QA_BROWSER ||
    "C:/Users/Lenovo/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe",
});
const results = [];
const errors = [];
for (const [width, height] of [
  [360, 800],
  [768, 1024],
  [1440, 1024],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await page.screenshot({
    path: "qa/lesson-" + width + ".png",
    fullPage: true,
  });
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "horizontal overflow " + width,
  );
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.push({
    width,
    screen: "lesson",
    violations: scan.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  });
  await page
    .getByRole("button", { name: "Mark complete", exact: true })
    .click();
  await page.reload({ waitUntil: "networkidle" });
  assert(
    await page
      .getByRole("button", { name: "Lesson complete", exact: true })
      .isDisabled(),
  );
  await page.getByLabel("Language", { exact: true }).selectOption("si");
  await page.screenshot({
    path: "qa/sinhala-" + width + ".png",
    fullPage: true,
  });
  assert.equal(await page.locator("html").getAttribute("lang"), "si");
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Sinhala overflow " + width,
  );
  await page.getByLabel("Language", { exact: true }).selectOption("en");
  await page
    .getByRole("button", { name: "Quick practice", exact: true })
    .click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole("radio").nth([1, 2, 0, 1, 2][i]).check();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: i === 4 ? "See results" : "Next question",
        exact: true,
      })
      .click();
  }
  assert.match(await page.locator(".nv-score").innerText(), /5 \/ 5/);
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  assert(
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .isDisabled(),
  );
  await page.getByLabel("NullVibe home").click();
  await page.screenshot({
    path: "qa/courses-" + width + ".png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "JLPT N4", exact: true }).click();
  assert.equal(await page.locator(".course-card").count(), 1);
  await page
    .getByRole("button", { name: "Course access", exact: true })
    .click();
  assert(await page.getByRole("dialog").isVisible());
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page
    .getByRole("button", { name: "Explore lessons", exact: true })
    .click();
  assert.match(await page.locator("h1").innerText(), /たこと/);
  await page.getByLabel("Course studio", { exact: true }).click();
  await page.getByLabel("Price in LKR", { exact: true }).fill("12000");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  assert.match(await page.getByRole("status").innerText(), /saved/);
  await page.getByRole("button", { name: "Mentor", exact: true }).click();
  await page
    .getByRole("button", { name: "Explain は and です", exact: true })
    .click();
  assert.match(await page.locator(".message-list").innerText(), /topic/);
  const mentorScan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.push({
    width,
    screen: "mentor",
    violations: mentorScan.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  });
  await page.keyboard.press("Escape");
  await context.close();
}
await browser.close();
await writeFile(
  "qa/results.json",
  JSON.stringify({ results, errors }, null, 2),
);
console.log(JSON.stringify({ results, errors }, null, 2));
assert.equal(errors.length, 0, "Browser runtime errors");
