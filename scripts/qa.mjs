import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

await mkdir("qa", { recursive: true });
const localBrowser = process.env.QA_BROWSER || (
  process.platform === "win32"
    ? "C:/Users/Lenovo/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe"
    : undefined
);
const browser = await chromium.launch({
  headless: true,
  ...(localBrowser ? { executablePath: localBrowser } : {}),
});
const results = [];
const errors = [];
for (const [width, height] of [
  [320, 720],
  [360, 800],
  [768, 1024],
  [1440, 1024],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  const base = "http://127.0.0.1:4173";
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/");
  assert.equal(await page.locator(".course-card").count(), 2);
  assert.match(await page.title(), /Japanese Courses/);
  await page.getByRole("textbox", { name: "Search courses" }).fill("missing-course");
  assert.equal(await page.locator(".course-card").count(), 0);
  await page.getByRole("button", { name: "Show all courses" }).click();
  assert.equal(await page.locator(".course-card").count(), 2, "empty-search reset restores catalog");
  await page.getByRole("button", { name: "Explore lessons", exact: true }).first().click();
  assert.equal(new URL(page.url()).pathname, "/learn/n5/1", "new students must start at lesson one");
  assert.match(await page.title(), /JLPT N5.*Lesson 1/);
  assert.equal(
    await page.locator("#main-content h1").evaluate((element) => getComputedStyle(element).outlineStyle),
    "none",
    "programmatic heading focus must not render a blue box",
  );
  await page.goto(base + "/learn/n5/3", { waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/learn/n5/3", "deep links must resolve");
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
  assert.equal(new URL(page.url()).pathname, "/learn/n5/3", "refresh must preserve current lesson");
  assert(
    await page
      .getByRole("button", { name: "Lesson complete", exact: true })
      .isDisabled(),
  );
  await page.getByLabel("Language", { exact: true }).selectOption("si");
  await page.evaluate(() => window.scrollTo(0, 0));
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
  await page.getByLabel("Language", { exact: true }).selectOption("ja");
  assert.equal(await page.locator("html").getAttribute("lang"), "ja");
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "Japanese overflow " + width,
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "qa/japanese-" + width + ".png",
    fullPage: true,
  });
  await page.getByLabel("Language", { exact: true }).selectOption("en");
  await page
    .getByRole("button", { name: "Quick practice", exact: true })
    .click();
  assert.equal(new URL(page.url()).pathname, "/practice/n5");
  await page.screenshot({
    path: "qa/practice-" + width + ".png",
    fullPage: true,
  });
  const practiceScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  results.push({ width, screen: "practice", violations: practiceScan.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
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
  await page.screenshot({
    path: "qa/results-" + width + ".png",
    fullPage: true,
  });
  const resultScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  results.push({ width, screen: "results", violations: resultScan.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
  await page.getByRole("button", { name: "Continue learning", exact: true }).click();
  assert.equal(new URL(page.url()).pathname, "/learn/n5/3", "continue must resume the previous lesson");
  await page.goBack({ waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/practice/n5", "browser back must follow history");
  await page.goForward({ waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/learn/n5/3", "browser forward must follow history");
  await page.getByRole("button", { name: "Quick practice", exact: true }).click();
  assert(await page.getByRole("button", { name: "Check answer", exact: true }).isDisabled());
  await page.getByLabel("NullVibe home").click();
  await page.screenshot({
    path: "qa/courses-" + width + ".png",
    fullPage: true,
  });
  const catalogScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  results.push({ width, screen: "catalog", violations: catalogScan.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
  await page.getByRole("button", { name: "JLPT N4", exact: true }).click();
  assert.equal(new URL(page.url()).pathname, "/courses/n4");
  assert.equal(await page.locator(".course-card").count(), 1);
  await page
    .getByRole("button", { name: "Course access", exact: true })
    .click();
  assert(await page.getByRole("dialog").isVisible());
  await page.screenshot({
    path: "qa/access-" + width + ".png",
    fullPage: true,
  });
  const accessScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  results.push({ width, screen: "course-access", violations: accessScan.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page
    .getByRole("button", { name: "Explore lessons", exact: true })
    .click();
  assert.equal(new URL(page.url()).pathname, "/learn/n4/1");
  assert.match(await page.locator("h1").innerText(), /たこと/);
  await page.getByLabel("NullVibe home").click();
  assert.equal(await page.getByRole("button", { name: "Course studio preview", exact: true }).count(), 1);
  await page.getByRole("button", { name: "Course studio preview", exact: true }).click();
  assert.equal(new URL(page.url()).pathname, "/studio");
  await page.screenshot({
    path: "qa/studio-" + width + ".png",
    fullPage: true,
  });
  const studioScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  results.push({ width, screen: "studio", violations: studioScan.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
  await page.getByLabel("Price in LKR", { exact: true }).fill("12000");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  assert.match(await page.getByRole("status").innerText(), /saved/);
  await page.getByRole("button", { name: "Mentor", exact: true }).click();
  await page
    .getByRole("button", { name: "Explain は and です", exact: true })
    .click();
  assert.match(await page.locator(".message-list").innerText(), /topic/);
  await page.screenshot({
    path: "qa/mentor-" + width + ".png",
    fullPage: true,
  });
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
  await page.getByRole("button", { name: "Back to courses", exact: true }).click();
  assert.equal(new URL(page.url()).pathname, "/courses");
  await context.close();
}
await browser.close();
await writeFile(
  "qa/results.json",
  JSON.stringify({ results, errors }, null, 2),
);
console.log(JSON.stringify({ results, errors }, null, 2));
assert.equal(errors.length, 0, "Browser runtime errors");
