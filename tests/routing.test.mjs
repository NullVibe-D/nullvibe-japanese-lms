import test from "node:test";
import assert from "node:assert/strict";
import { parseRoute, lessonPath, practicePath } from "../src/routing.mjs";

test("home and course routes resolve to the catalog", () => {
  assert.deepEqual(parseRoute("/"), { view: "courses", filter: "all", courseId: null });
  assert.equal(parseRoute("/courses/").view, "courses");
  assert.equal(parseRoute("/courses/n4").filter, "N4");
  assert.equal(parseRoute("/courses/N5").courseId, "N5");
});

test("all five lesson deep links preserve their course and lesson index", () => {
  for (const id of ["N5", "N4"]) for (let index = 0; index < 5; index++) {
    assert.deepEqual(parseRoute(lessonPath(id, index)), { view: "lesson", courseId: id, lessonIndex: index });
  }
});

test("practice and studio routes resolve", () => {
  assert.deepEqual(parseRoute(practicePath("N4")), { view: "practice", courseId: "N4" });
  assert.equal(parseRoute("/studio").view, "studio");
});

test("invalid and unimplemented URLs never silently show another course", () => {
  for (const route of ["/learn/n5/0", "/learn/n4/6", "/learn/n3/1", "/practice/n3", "/courses/n3", "/admin", "/missing", "/learn/n5/nope"]) {
    assert.equal(parseRoute(route).view, "not-found", route);
  }
  assert.throws(() => lessonPath("N5", -1), /Invalid lesson/);
  assert.throws(() => practicePath("N3"), /Invalid practice/);
});
