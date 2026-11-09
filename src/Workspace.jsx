import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  LockKey,
  MagnifyingGlass,
  PaperPlaneTilt,
  SlidersHorizontal,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { validateCourseConfig } from "./domain.mjs";

function translator(language) {
  return (english, sinhala, japanese) =>
    ({ en: english, si: sinhala, ja: japanese })[language] || english;
}

function Dialog({ title, onClose, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={wide ? "workspace-dialog mentor-dialog" : "workspace-dialog"}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <header>
        <h2>{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Close">
          <X />
        </button>
      </header>
      {children}
    </dialog>
  );
}

export function Catalog({
  language,
  filter = "all",
  onFilterChange,
  config,
  completedIds,
  lastResult,
  onOpen,
  onAccess,
  onStudio,
}) {
  const t = translator(language);
  const [query, setQuery] = useState("");
  const courses = [
    {
      id: "N5",
      title: t(
        "Your first words. Your next chapter.",
        "ඔබේ පළමු වචන. අලුත් ආරම්භයක්.",
        "最初の言葉、新しい一歩。",
      ),
      subtitle: t(
        "Build a confident foundation in Japanese, with Sinhala explanations.",
        "සිංහල පැහැදිලි කිරීම් සමඟ ජපන් භාෂාවට ශක්තිමත් පදනමක්.",
        "シンハラ語の解説で日本語の基礎を学ぶ。",
      ),
      tag: t("Start here", "මෙතැනින් අරඹන්න", "ここから始める"),
    },
    {
      id: "N4",
      title: t(
        "Turn knowledge into conversation.",
        "දැනුම සංවාදයක් බවට පත් කරන්න.",
        "知識を会話につなげる。",
      ),
      subtitle: t(
        "Connect ideas, explore everyday expressions, and take the next step.",
        "එදිනෙදා ප්‍රකාශන ඉගෙන ගෙන ඊළඟ පියවර තබන්න.",
        "日常表現を学んで、次のステップへ。",
      ),
      tag: t("Build on N5", "N5 දැනුම වැඩි කරන්න", "N5の次へ"),
    },
  ];
  const visible = courses.filter(
    (course) =>
      (filter === "all" || filter === course.id) &&
      (course.id + " " + course.title)
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <main id="main-content" className="catalog-page">
      <div className="catalog-intro">
        <span className="eyebrow">LEARN JAPANESE, WITH NULLVIBE</span>
        <h1 tabIndex={-1}>
          {t("A new language.", "අලුත් භාෂාවක්.", "新しい言葉。")}
          <br />
          <em>
            {t(
              "A world of possibility.",
              "හැකියාවන් පිරුණු ලොවක්.",
              "広がる可能性。",
            )}
          </em>
        </h1>
        <p>
          {t(
            "Thoughtfully paced lessons. Clear explanations. A little closer to Japan, every day.",
            "පියවරෙන් පියවර පාඩම්. පැහැදිලි විස්තර. සෑම දිනකම ජපානයට තවත් සමීපව.",
            "自分のペースで、分かりやすく。毎日、日本に少し近づく。",
          )}
        </p>
      </div>
      <div className="catalog-toolbar">
        <div
          className="filter-group"
          aria-label={t("Course level", "පාඨමාලා මට්ටම", "レベル")}
        >
          {["all", "N5", "N4"].map((value) => (
            <button
              key={value}
              aria-pressed={filter === value}
              className={filter === value ? "selected" : ""}
              onClick={() => onFilterChange(value)}
            >
              {value === "all"
                ? t("All courses", "සියලු පාඨමාලා", "すべて")
                : "JLPT " + value}
            </button>
          ))}
        </div>
        <label className="search-field">
          <MagnifyingGlass />
          <input
            aria-label={t("Search courses", "පාඨමාලා සොයන්න", "コースを検索")}
            placeholder={t(
              "Find your course",
              "පාඨමාලාව සොයන්න",
              "コースを探す",
            )}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="course-grid">
        {visible.map((course) => {
          const count = completedIds.filter((id) =>
            id.startsWith(course.id + "-"),
          ).length;
          const settings = config[course.id];
          return (
            <article className="course-card" key={course.id}>
              <div className="course-art">
                <span>JLPT</span>
                <strong>{course.id}</strong>
                <BookOpen weight="duotone" />
                <small>{course.tag}</small>
              </div>
              <div className="course-body">
                <span className="eyebrow">
                  {t(
                    "JAPANESE • SINHALA EXPLANATIONS",
                    "ජපන් • සිංහල පැහැදිලි කිරීම්",
                    "日本語 • シンハラ語解説",
                  )}
                </span>
                <h2><span className="sr-only">JLPT {course.id}: </span>{course.title}</h2>
                <p>{course.subtitle}</p>
                <div className="course-meta">
                  <span>
                    <BookOpen />
                    {t("5 sample lessons", "ආදර්ශ පාඩම් 5", "体験レッスン5つ")}
                  </span>
                  <span>
                    <Clock />
                    {settings.accessDays
                      ? settings.accessDays +
                        t(" days access", " දින ප්‍රවේශය", "日間")
                      : t(
                          "Access period to be confirmed",
                          "කාලය තහවුරු කිරීමට ඇත",
                          "受講期間は未定",
                        )}
                  </span>
                </div>
                <div className="course-progress-row">
                  <progress
                    value={count}
                    max={5}
                    aria-label={t(
                      "Sample lesson progress",
                      "ආදර්ශ පාඩම් ප්‍රගතිය",
                      "進捗",
                    )}
                  />
                  <span>{count}/5</span>
                </div>
                <div className="course-buttons">
                  <button
                    className="primary-button"
                    onClick={() => onOpen(course.id)}
                  >
                    {count > 0
                      ? t("Continue learning", "ඉගෙනීම ඉදිරියට", "学習を続ける")
                      : t("Explore lessons", "පාඩම් බලන්න", "レッスンを見る")}
                    <ArrowRight />
                  </button>
                  <button
                    className="text-button"
                    onClick={() => onAccess(course.id)}
                  >
                    {t("Course access", "පාඨමාලා ප්‍රවේශය", "受講について")}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <p role="status">
            {t(
              "No courses match. Try N5 or N4.",
              "ගැළපෙන පාඨමාලා නැත. N5 හෝ N4 සොයන්න.",
              "該当するコースがありません。N5、N4をお試しください。",
            )}
          </p>
          <button className="quiet-button" onClick={() => {
            setQuery("");
            onFilterChange("all");
          }}>
            {t("Show all courses", "සියලු පාඨමාලා පෙන්වන්න", "すべてのコースを表示")}
          </button>
        </div>
      )}
      {lastResult && (
        <p className="last-result">
          <CheckCircle />
          {t("Last practice", "අවසන් පුහුණුව", "前回の練習")} ·{" "}
          {lastResult.courseId} · {lastResult.score}/{lastResult.total}
        </p>
      )}
      <p className="catalog-footnote">
        {t(
          "Course content is a demonstration. The teaching team will confirm the complete syllabus and enrolment details.",
          "මෙය ආදර්ශ අන්තර්ගතයකි. සම්පූර්ණ විෂය නිර්දේශය හා ලියාපදිංචි විස්තර ගුරු කණ්ඩායම තහවුරු කරනු ඇත.",
          "体験用コンテンツです。正式な教材と受講情報は講師が確認します。",
        )}
      </p>
      <div className="catalog-preview-tools">
        <span>
          {t(
            "For instructors · local demo settings only",
            "ගුරුවරුන් සඳහා · මෙම උපාංගයේ ආදර්ශ සැකසුම් පමණි",
            "講師向け · この端末のみのデモ設定",
          )}
        </span>
        <button className="preview-tools-link" onClick={onStudio} aria-label={t(
          "Course studio preview",
          "පාඨමාලා සැකසුම් පෙරදසුන",
          "コース管理プレビュー",
        )}>
          <SlidersHorizontal size={17} aria-hidden="true" />
          {t("Course studio preview", "පාඨමාලා සැකසුම් පෙරදසුන", "コース管理プレビュー")}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}

export function AccessDialog({
  language,
  courseId,
  config,
  onClose,
  onPreview,
}) {
  const t = translator(language);
  return (
    <Dialog title={"JLPT " + courseId} onClose={onClose}>
      <div className="dialog-body">
        <LockKey size={32} weight="duotone" />
        <h3>
          {t(
            "Your learning, at your pace.",
            "ඔබේ වේගයෙන් ඉගෙන ගන්න.",
            "自分のペースで学ぼう。",
          )}
        </h3>
        <dl className="access-details">
          <div>
            <dt>{t("Course fee", "පාඨමාලා ගාස්තුව", "受講料")}</dt>
            <dd>
              {config.priceLkr === null
                ? t("To be confirmed", "තහවුරු කිරීමට ඇත", "未定")
                : "LKR " + config.priceLkr.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt>{t("Access", "ප්‍රවේශය", "期間")}</dt>
            <dd>
              {config.accessDays
                ? config.accessDays + t(" days", " දින", "日")
                : t(
                    "Fixed duration · to be confirmed",
                    "ස්ථාවර කාලයක් • තහවුරු කිරීමට ඇත",
                    "固定期間・未定",
                  )}
            </dd>
          </div>
        </dl>
        <p>
          {t(
            "Enrolment opens after pricing and payment options are confirmed. You can explore the sample lessons now.",
            "ගාස්තු සහ ගෙවීම් ක්‍රම තහවුරු වූ පසු ලියාපදිංචිය ඇරඹේ. දැන් ආදර්ශ පාඩම් බලන්න.",
            "料金と支払い方法が決まったら受付開始します。今は体験レッスンをご覧ください。",
          )}
        </p>
        <button className="primary-button" onClick={onPreview}>
          {t("Explore sample lessons", "ආදර්ශ පාඩම් බලන්න", "体験レッスンへ")}
          <ArrowRight />
        </button>
      </div>
    </Dialog>
  );
}

export function Studio({ language, config, onSave, onBack }) {
  const t = translator(language);
  const [courseId, setCourseId] = useState("N5");
  const [draft, setDraft] = useState(config);
  const [message, setMessage] = useState("");
  function change(field, value) {
    setDraft((previous) => ({
      ...previous,
      [courseId]: { ...previous[courseId], [field]: value },
    }));
    setMessage("");
  }
  function save(event) {
    event.preventDefault();
    if (
      Object.values(draft).some((value) => validateCourseConfig(value).length)
    ) {
      setMessage(
        t(
          "Check the values and try again.",
          "අගයන් පරීක්ෂා කර නැවත උත්සාහ කරන්න.",
          "入力を確認してください。",
        ),
      );
      return;
    }
    onSave(draft);
    setMessage(
      t(
        "Draft saved on this device.",
        "කෙටුම්පත මෙම උපාංගයේ සුරැකිණි.",
        "この端末に保存しました。",
      ),
    );
  }
  return (
    <main id="main-content" className="task-view studio-page">
      <button type="button" className="back-link" onClick={onBack}>
        <ArrowRight className="back-arrow" aria-hidden="true" />
        {t("Back to courses", "පාඨමාලා වෙත ආපසු", "コース一覧に戻る")}
      </button>
      <span className="eyebrow">
        {t("ADMIN PREVIEW", "පරිපාලක පෙරදසුන", "管理画面プレビュー")}
      </span>
      <h1 tabIndex={-1}>
        {t("Course studio", "පාඨමාලා සැකසුම්", "コース設定")}
      </h1>
      <p className="task-intro">
        {t(
          "Shape the details when your teaching team is ready.",
          "ගුරු කණ්ඩායම සූදානම් වූ විට විස්තර සකසන්න.",
          "講師の準備に合わせて詳細を設定。",
        )}
      </p>
      <p className="studio-notice">
        {t(
          "Local preview settings. Live administration will require a verified staff account.",
          "දේශීය පෙරදසුන් සැකසුම්. සජීවී පරිපාලනයට තහවුරු කළ ගිණුමක් අවශ්‍ය වේ.",
          "端末内のプレビュー設定。本番の管理にはスタッフ認証が必要です。",
        )}
      </p>
      <form className="admin-card" onSubmit={save}>
        <label>
          {t("Course", "පාඨමාලාව", "コース")}
          <select
            value={courseId}
            onChange={(event) => {
              setCourseId(event.target.value);
              setMessage("");
            }}
          >
            <option>N5</option>
            <option>N4</option>
          </select>
        </label>
        <label>
          {t("Price in LKR", "රුපියල්වලින් මිල", "料金（LKR）")}
          <input
            type="number"
            min="0"
            step="0.01"
            value={draft[courseId].priceLkr ?? ""}
            placeholder={t("To be confirmed", "තහවුරු කිරීමට ඇත", "未定")}
            onChange={(event) =>
              change(
                "priceLkr",
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
        </label>
        <label>
          {t(
            "Fixed access duration in days",
            "ප්‍රවේශ කාලය දිනවලින්",
            "受講期間（日数）",
          )}
          <input
            type="number"
            min="1"
            max="3650"
            step="1"
            value={draft[courseId].accessDays ?? ""}
            placeholder={t("To be confirmed", "තහවුරු කිරීමට ඇත", "未定")}
            onChange={(event) =>
              change(
                "accessDays",
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
        </label>
        <label>
          {t("Live classes", "සජීවී පන්ති", "ライブ授業")}
          <select
            value={
              draft[courseId].liveClasses === null
                ? "undecided"
                : String(draft[courseId].liveClasses)
            }
            onChange={(event) =>
              change(
                "liveClasses",
                event.target.value === "undecided"
                  ? null
                  : event.target.value === "true",
              )
            }
          >
            <option value="undecided">
              {t("Undecided", "තීරණය කර නැත", "未定")}
            </option>
            <option value="true">{t("Included", "ඇතුළත්", "あり")}</option>
            <option value="false">
              {t("Self-paced only", "ස්වයං අධ්‍යයනය පමණි", "自習のみ")}
            </option>
          </select>
        </label>
        <label>
          {t("Planned video hours", "සැලසුම් කළ වීඩියෝ පැය", "動画の予定時間")}
          <input
            type="number"
            min="0"
            step="0.1"
            value={draft[courseId].mediaHours ?? ""}
            placeholder={t("To be confirmed", "තහවුරු කිරීමට ඇත", "未定")}
            onChange={(event) =>
              change(
                "mediaHours",
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
        </label>
        <button className="primary-button" type="submit">
          {t("Save draft", "කෙටුම්පත සුරකින්න", "下書き保存")}
          <CheckCircle />
        </button>
        <p role="status" className="save-message">
          {message}
        </p>
      </form>
    </main>
  );
}

export function Mentor({ language, courseId, onClose }) {
  const t = translator(language);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const bottom = useRef(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);
  const prompts = [
    [
      t("Explain は and です", "は සහ です පැහැදිලි කරන්න", "はとですを説明"),
      t(
        "は marks the topic. In わたしは がくせいです, わたし is the topic and がくせいです means ‘am a student’. は is pronounced ‘wa’ here.",
        "は මාතෘකාව දක්වයි. わたしは がくせいです යනු ‘මම ශිෂ්‍යයෙක්’ යන්නයි. මෙහි は ‘wa’ ලෙස කියවෙයි.",
        "はは話題を示します。「わたしは がくせいです」は自分が学生であることを表します。助詞のはは「わ」と読みます。",
      ),
    ],
    [
      t(
        "Give me a practice sentence",
        "පුහුණු වාක්‍යයක් දෙන්න",
        "練習の文を教えて",
      ),
      t(
        "Try introducing yourself. わたしは ___ です。 Fill the blank with your name. For example, わたしは アマヤ です。",
        "ඔබව හඳුන්වා දෙන්න. わたしは ___ です。 හිස්තැනට ඔබේ නම යොදන්න. උදාහරණයක් ලෙස わたしは アマヤ です。",
        "自己紹介しましょう。「わたしは ___ です。」に名前を入れてください。例「わたしは アマヤ です。」",
      ),
    ],
  ];
  function send(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages((previous) => [
      ...previous,
      { role: "learner", text: draft.trim() },
      {
        role: "mentor",
        text: t(
          "Free-form AI answers will be available when the mentor service is connected. Try one of the guided examples above for now.",
          "AI සේවාව සම්බන්ධ කළ පසු නිදහස් ප්‍රශ්නවලට පිළිතුරු ලැබේ. දැනට ඉහත ආදර්ශයක් තෝරන්න.",
          "AIサービス接続後、自由な質問に回答できます。今は上の学習例をお試しください。",
        ),
      },
    ]);
    setDraft("");
  }
  return (
    <Dialog
      title={t("Your study companion", "ඔබේ අධ්‍යයන සහකරු", "学習パートナー")}
      onClose={onClose}
      wide
    >
      <div className="mentor-intro">
        <Sparkle weight="duotone" size={30} />
        <p>
          {t(
            "A little clarity goes a long way.",
            "පැහැදිලි අවබෝධයක්, හොඳ ආරම්භයක්.",
            "小さな理解が、大きな一歩に。",
          )}
        </p>
        <small>
          {courseId} ·{" "}
          {t(
            "Guided demo · AI connection pending",
            "මඟපෙන්වන ආදර්ශය • AI සම්බන්ධය සූදානම් කළ යුතුයි",
            "学習デモ・AI接続準備中",
          )}
        </small>
      </div>
      <div className="mentor-prompts">
        {prompts.map(([question, answer]) => (
          <button
            key={question}
            onClick={() =>
              setMessages((previous) => [
                ...previous,
                { role: "learner", text: question },
                { role: "mentor", text: answer },
              ])
            }
          >
            {question}
            <ArrowRight />
          </button>
        ))}
      </div>
      <div
        className="message-list"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message, index) => (
          <p className={message.role} key={index}>
            {message.text}
          </p>
        ))}
        <span ref={bottom} />
      </div>
      <form className="mentor-form" onSubmit={send}>
        <label className="sr-only" htmlFor="mentor-prompt">
          {t("Your question", "ඔබේ ප්‍රශ්නය", "質問")}
        </label>
        <input
          id="mentor-prompt"
          maxLength={1000}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t(
            "Ask about your lesson…",
            "පාඩම ගැන අසන්න…",
            "レッスンについて質問…",
          )}
        />
        <button
          aria-label={t("Send", "යවන්න", "送信")}
          type="submit"
          disabled={!draft.trim()}
        >
          <PaperPlaneTilt weight="fill" />
        </button>
      </form>
    </Dialog>
  );
}
