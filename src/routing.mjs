// Pure route helpers: no browser globals, so they can be unit-tested.
export function parseRoute(pathname) {
  const path = (typeof pathname === "string" ? pathname : "/").replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/courses") return { view: "courses", filter: "all", courseId: null };
  if (path === "/studio") return { view: "studio", courseId: null };
  const catalog = /^\/courses\/(n5|n4)$/i.exec(path);
  if (catalog) {
    const id = catalog[1].toUpperCase();
    return { view: "courses", filter: id, courseId: id };
  }
  const lesson = /^\/learn\/(n5|n4)\/([1-5])$/i.exec(path);
  if (lesson) return { view: "lesson", courseId: lesson[1].toUpperCase(), lessonIndex: Number(lesson[2]) - 1 };
  const practice = /^\/practice\/(n5|n4)$/i.exec(path);
  if (practice) return { view: "practice", courseId: practice[1].toUpperCase() };
  return { view: "not-found", courseId: null };
}

export function lessonPath(courseId, index) {
  const id = String(courseId).toUpperCase();
  if (!["N5", "N4"].includes(id) || !Number.isInteger(index) || index < 0 || index > 4) {
    throw new Error("Invalid lesson route");
  }
  return "/learn/" + id.toLowerCase() + "/" + (index + 1);
}

export function practicePath(courseId) {
  const id = String(courseId).toUpperCase();
  if (!["N5", "N4"].includes(id)) throw new Error("Invalid practice route");
  return "/practice/" + id.toLowerCase();
}
