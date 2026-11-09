import { useEffect, useState } from "react";
import {
  BookOpen,
  SquaresFour,
  Sparkle,
  SlidersHorizontal,
  ArrowRight,
  Globe,
  GraduationCap,
} from "@phosphor-icons/react";
import { Lesson, Assessment } from "./Learning";
import { Catalog, Studio, Mentor, AccessDialog } from "./Workspace";
import "./workspace.css";
import { sanitizeConfig, sanitizeProgress } from "./domain.mjs";
import { parseRoute, lessonPath, practicePath } from "./routing.mjs";

export function translate(language, english, sinhala, japanese) {
  return { en: english, si: sinhala, ja: japanese }[language] || english;
}

function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function useStored(key, initial) {
  const [value, setValue] = useState(() => readStored(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
  }, [key, value]);
  return [value, setValue];
}

export function App() {
  const [savedLanguage, setLanguage] = useStored("nullvibe.language", "en");
  const language = ["en", "si", "ja"].includes(savedLanguage)
    ? savedLanguage
    : "en";
  const t = (en, si, ja) => translate(language, en, si, ja);
  const [routePath, setRoutePath] = useState(() => window.location.pathname);
  const route = parseRoute(routePath);
  const view = route.view;
  const [lastCourse, setLastCourse] = useStored("nullvibe.currentCourse", "N5");
  const [savedLastLesson, setLastLesson] = useStored("nullvibe.lastLesson.v1", {
    N5: 0,
    N4: 0,
  });
  const courseId = route.courseId || (lastCourse === "N4" ? "N4" : "N5");
  function rememberedIndex(id) {
    const index = savedLastLesson?.[id];
    return Number.isInteger(index) && index >= 0 && index < 5 ? index : 0;
  }
  const [savedCompleted, setCompleted] = useStored("nullvibe.progress", []);
  const completedIds = sanitizeProgress(savedCompleted);
  const [lastResult, setResult] = useStored("nullvibe.result", null);
  const [accessCourse, setAccessCourse] = useState(null);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [config, setConfig] = useStored("nullvibe.settings.v1", {
    N5: {
      priceLkr: null,
      accessDays: null,
      liveClasses: null,
      mediaHours: null,
    },
    N4: {
      priceLkr: null,
      accessDays: null,
      liveClasses: null,
      mediaHours: null,
    },
  });
  const safeConfig = sanitizeConfig(config);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const onPopState = () => setRoutePath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      document.querySelector("#main-content h1")?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [routePath]);
  useEffect(() => {
    if (route.view !== "lesson") return;
    setLastCourse(route.courseId);
    setLastLesson((previous) =>
      previous?.[route.courseId] === route.lessonIndex
        ? previous
        : { ...(previous || {}), [route.courseId]: route.lessonIndex },
    );
  }, [routePath]);

  function navigate(next, { preserveScroll = false } = {}) {
    let path = next;
    if (!path.startsWith("/")) {
      if (next === "courses") path = "/courses";
      else if (next === "studio") path = "/studio";
      else if (next === "lesson") path = lessonPath(courseId, rememberedIndex(courseId));
      else if (next === "practice") path = practicePath(courseId);
      else path = "/courses";
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
      setRoutePath(path);
    }
    if (!preserveScroll) window.scrollTo({ top: 0, behavior: "instant" });

  }
  function startCourse(id) {
    setLastCourse(id);
    setAccessCourse(null);
    navigate(lessonPath(id, rememberedIndex(id)));
  }
  function selectLesson(index) {
    setLastLesson((previous) => ({ ...(previous || {}), [courseId]: index }));
    navigate(lessonPath(courseId, index), { preserveScroll: true });
  }
  function markComplete(id) {
    setCompleted((previous) => [
      ...new Set([...(Array.isArray(previous) ? previous : []), id]),
    ]);
  }
  const navItems = [
    ["courses", SquaresFour, t("Courses", "පාඨමාලා", "コース")],
    ["lesson", BookOpen, t("My learning", "මගේ ඉගෙනීම", "学習")],
    ["practice", GraduationCap, t("Practice", "පුහුණුව", "練習")],
  ];
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {t("Skip to content", "අන්තර්ගතයට යන්න", "本文へ")}
      </a>
      <header className="app-header">
        <button
          className="brand"
          onClick={() => navigate("courses")}
          aria-label="NullVibe home"
        >
          <span className="brand-mark">
            <BookOpen weight="duotone" />
          </span>
          <span>
            <strong>NullVibe</strong>
            <small>JAPANESE LEARNING</small>
          </span>
        </button>
        <nav
          className="desktop-nav"
          aria-label={t(
            "Main navigation",
            "ප්‍රධාන මෙනුව",
            "メインナビゲーション",
          )}
        >
          {navItems.map(([id, Icon, label]) => (
            <button
              key={id}
              className={view === id ? "selected" : ""}
              aria-current={view === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <label className="locale-control">
            <Globe size={18} />
            <span className="sr-only">Language</span>
            <select
              aria-label="Language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="en">English</option>
              <option value="si">සිංහල</option>
              <option value="ja">日本語</option>
            </select>
          </label>
          <button
            className="icon-button studio-link"
            aria-label={t("Course studio", "පාඨමාලා සැකසුම්", "コース設定")}
            onClick={() => navigate("studio")}
          >
            <SlidersHorizontal />
          </button>
          <button
            className="mentor-trigger"
            aria-label={t("Mentor", "උපදේශක", "メンター")}
            onClick={() => setMentorOpen(true)}
          >
            <Sparkle weight="fill" />{" "}
            <span>{t("Mentor", "උපදේශක", "メンター")}</span>
          </button>
        </div>
      </header>
      <div className="demo-ribbon">
        <span>
          {t("INTERACTIVE PREVIEW", "අත්හදා බැලීමේ පෙරදසුන", "体験プレビュー")}
        </span>
        {t(
          "A little progress, every day.",
          "සෑම දිනකම, කුඩා ප්‍රගතියක්.",
          "毎日、少しずつ。",
        )}
      </div>
      <div tabIndex={-1} className="page-area">
        {view === "lesson" && (
          <Lesson
            key={courseId}
            language={language}
            courseId={courseId}
            completedIds={completedIds}
            lessonIndex={route.lessonIndex}
            onSelectLesson={selectLesson}
            onComplete={markComplete}
            onPractice={() => navigate("practice")}
          />
        )}
        {view === "practice" && (
          <Assessment
            key={courseId}
            language={language}
            courseId={courseId}
            onBack={() => navigate(lessonPath(courseId, rememberedIndex(courseId)))}
            onResult={setResult}
          />
        )}
        {view === "courses" && (
          <Catalog
            language={language}
            filter={route.filter}
            onFilterChange={(filter) =>
              navigate(filter === "all" ? "/courses" : "/courses/" + filter.toLowerCase())
            }
            config={safeConfig}
            completedIds={completedIds}
            lastResult={lastResult}
            onOpen={startCourse}
            onAccess={setAccessCourse}
          />
        )}
        {view === "studio" && (
          <Studio language={language} config={safeConfig} onSave={setConfig} />
        )}
        {view === "not-found" && (
          <main id="main-content" className="task-view">
            <h1 tabIndex={-1}>{t("Page not found", "පිටුව හමු නොවීය", "ページが見つかりません")}</h1>
            <p className="task-intro">
              {t(
                "This page is unavailable. Return to the course catalog to keep learning.",
                "මෙම පිටුව ලබාගත නොහැක. පාඩම් දිගටම කරගෙන යාමට පාඨමාලා වෙත යන්න.",
                "このページはありません。コース一覧に戻って学習を続けましょう。",
              )}
            </p>
            <button className="primary-button" onClick={() => navigate("courses")}>
              {t("Browse courses", "පාඨමාලා බලන්න", "コース一覧へ")}
              <ArrowRight />
            </button>
          </main>
        )}
      </div>
      <nav
        className="mobile-bottom-nav"
        aria-label={t("Mobile navigation", "ජංගම මෙනුව", "モバイルメニュー")}
      >
        {navItems.map(([id, Icon, label]) => (
          <button
            key={id}
            aria-current={view === id ? "page" : undefined}
            className={view === id ? "active" : ""}
            onClick={() => navigate(id)}
          >
            <Icon weight={view === id ? "fill" : "regular"} />
            {label}
          </button>
        ))}
      </nav>
      {mentorOpen && (
        <Mentor
          language={language}
          courseId={courseId}
          onClose={() => setMentorOpen(false)}
        />
      )}
      {accessCourse && (
        <AccessDialog
          language={language}
          courseId={accessCourse}
          config={safeConfig[accessCourse]}
          onClose={() => setAccessCourse(null)}
          onPreview={() => startCourse(accessCourse)}
        />
      )}
    </div>
  );
}
