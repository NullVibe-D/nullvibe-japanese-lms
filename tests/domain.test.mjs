import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultConfig,
  sanitizeConfig,
  sanitizeProgress,
  hasEntitlement,
  validateCourseConfig,
} from "../src/domain.mjs";

test("undecided values survive validation", () =>
  assert.deepEqual(validateCourseConfig(defaultConfig.N5), []));
test("bad persisted config falls back safely", () =>
  assert.deepEqual(
    sanitizeConfig({ N5: { priceLkr: "free" } }),
    defaultConfig,
  ));
test("negative or fractional duration rejected", () => {
  for (const accessDays of [-1, 0, 1.5, 3651])
    assert(validateCourseConfig({ ...defaultConfig.N5, accessDays }).length);
});
test("progress deduplicates and rejects unknown lesson IDs", () =>
  assert.deepEqual(
    sanitizeProgress(["N5-2", "N5-2", "N4-4", "N5-9", {}, null]),
    ["N5-2", "N4-4"],
  ));
test("entitlement denies missing, expired, wrong course and revoked access", () => {
  const active = { courseId: "N5", status: "active", expiresAt: 2000 };
  assert.equal(hasEntitlement(active, "N5", 1000), true);
  for (const value of [
    null,
    { ...active, status: "revoked" },
    { ...active, expiresAt: null },
    { ...active, expiresAt: "garbage" },
    { ...active, expiresAt: 1000 },
  ])
    assert.equal(hasEntitlement(value, "N5", 1000), false);
  assert.equal(hasEntitlement(active, "N4", 1000), false);
});
