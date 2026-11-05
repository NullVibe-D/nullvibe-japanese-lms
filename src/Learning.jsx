import { useEffect, useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  BookOpen,
  CaretLeft,
  Check,
  CheckCircle,
  GraduationCap,
  Image,
  Timer,
} from "@phosphor-icons/react";
import "./learning.css";

const text = (language, english, sinhala, japanese) =>
  ({ en: english, si: sinhala, ja: japanese })[language] || english;
const translated = (value, language) => value[language] || value.en;
const phrase = (en, si, ja) => ({ en, si, ja });

const lessons = {
  n5: [
    {
      japanese: "あ・い・う・え・お",
      title: phrase(
        "Your first hiragana",
        "පළමු හිරගනා අකුරු",
        "初めてのひらがな",
      ),
      description: phrase(
        "Begin with the five vowel sounds at the heart of Japanese.",
        "ජපන් භාෂාවේ මූලික ස්වර ශබ්ද පහෙන් ආරම්භ කරන්න.",
        "日本語の基本となる五つの母音から始めましょう。",
      ),
      explanation: phrase(
        "Hiragana represents sounds. Read あ as a, い as i, う as u, え as e, and お as o. Practise each sound slowly before joining them into words.",
        "හිරගනා අකුරුවලින් ශබ්ද නිරූපණය වේ. あ = a, い = i, う = u, え = e, お = o ලෙස කියවන්න. වචන සෑදීමට පෙර එක් එක් ශබ්දය සෙමින් පුහුණු වන්න.",
        "ひらがなは音を表します。あ・い・う・え・おを一つずつゆっくり読み、言葉にして練習しましょう。",
      ),
      examples: [
        ["あお", "ao", phrase("blue", "නිල්", "青色")],
        ["いえ", "ie", phrase("house", "නිවස", "家")],
        ["うえ", "ue", phrase("above", "ඉහළ", "上")],
      ],
    },
    {
      japanese: "こんにちは",
      title: phrase("Everyday greetings", "දිනපතා ආචාර", "毎日のあいさつ"),
      description: phrase(
        "Find the right greeting for the moment.",
        "අවස්ථාවට ගැළපෙන ආචාරය ඉගෙන ගන්න.",
        "場面に合ったあいさつを覚えましょう。",
      ),
      explanation: phrase(
        "Use おはようございます for a polite morning greeting. こんにちは is a daytime greeting. Say ありがとうございます to thank someone politely.",
        "උදෑසන ගෞරවයෙන් ආචාර කිරීමට おはようございます භාවිත කරන්න. දහවල් ආචාරය こんにちは යි. ස්තුති කිරීමට ありがとうございます කියන්න.",
        "朝は「おはようございます」、昼は「こんにちは」とあいさつします。感謝するときは「ありがとうございます」と言います。",
      ),
      examples: [
        [
          "おはようございます",
          "ohayō gozaimasu",
          phrase("Good morning", "සුබ උදෑසනක්", "朝のあいさつ"),
        ],
        [
          "こんにちは",
          "konnichiwa",
          phrase("Hello", "ආයුබෝවන්", "昼のあいさつ"),
        ],
        [
          "ありがとうございます",
          "arigatō gozaimasu",
          phrase("Thank you", "ස්තුතියි", "感謝のことば"),
        ],
      ],
    },
    {
      japanese: "わたしは ～ です",
      title: phrase("Introducing yourself", "ඔබව හඳුන්වා දෙන්න", "自己紹介"),
      description: phrase(
        "Introduce yourself with one simple, useful sentence pattern.",
        "සරල වාක්‍ය රටාවකින් ඔබව හඳුන්වා දෙන්න.",
        "簡単な文型を使って自分を紹介しましょう。",
      ),
      explanation: phrase(
        "Put your name or role between わたしは and です. Here, the topic particle は is pronounced wa. です makes the statement polite. For example, わたしは がくせい です means ‘I am a student’.",
        "わたしは සහ です අතර ඔබේ නම හෝ භූමිකාව යොදන්න. මෙහි は යන්න wa ලෙස උච්චාරණය වේ. です වාක්‍යය ආචාරශීලී කරයි. わたしは がくせい です යනු ‘මම ශිෂ්‍යයෙක්’ යන්නයි.",
        "「わたしは」と「です」の間に名前や職業を入れます。助詞の「は」は wa と読みます。「です」を使うと丁寧な表現になります。",
      ),
      examples: [
        [
          "わたしは さくら です。",
          "watashi wa Sakura desu",
          phrase("I am Sakura.", "මම සකුරා.", "名前を紹介する文。"),
        ],
        [
          "わたしは がくせい です。",
          "watashi wa gakusei desu",
          phrase(
            "I am a student.",
            "මම ශිෂ්‍යයෙක්.",
            "学生であることを伝える文。",
          ),
        ],
        [
          "わたしは スリランカじん です。",
          "watashi wa Suriranka-jin desu",
          phrase(
            "I am Sri Lankan.",
            "මම ශ්‍රී ලාංකිකයෙක්.",
            "国籍を紹介する文。",
          ),
        ],
      ],
    },
    {
      japanese: "これ・それ・あれ",
      title: phrase("This and that", "මෙය සහ එය", "これとそれ"),
      description: phrase(
        "Point out things around you with confidence.",
        "ඔබ වටා ඇති දේ හඳුන්වන්න.",
        "身の回りの物を指して話しましょう。",
      ),
      explanation: phrase(
        "これ refers to something near the speaker. それ refers to something near the listener. あれ refers to something far from both people. Add は and a noun followed by です to identify it.",
        "කථිකයා අසල ඇති දේට これ කියයි. අසන්නා අසල ඇති දේට それ කියයි. දෙදෙනාටම දුරින් ඇති දේට あれ කියයි. හඳුන්වා දීමට は, නාම පදයක් සහ です යොදන්න.",
        "話し手の近くは「これ」、聞き手の近くは「それ」、二人から遠い物は「あれ」を使います。",
      ),
      examples: [
        [
          "これは ほん です。",
          "kore wa hon desu",
          phrase("This is a book.", "මෙය පොතක්.", "近くの本を指す。"),
        ],
        [
          "それは ペン です。",
          "sore wa pen desu",
          phrase("That is a pen.", "එය පෑනක්.", "相手の近くのペンを指す。"),
        ],
        [
          "あれは がっこう です。",
          "are wa gakkō desu",
          phrase(
            "That over there is a school.",
            "අර තිබෙන්නේ පාසලක්.",
            "遠くの学校を指す。",
          ),
        ],
      ],
    },
    {
      japanese: "～ ですか",
      title: phrase(
        "Ask a simple question",
        "සරල ප්‍රශ්නයක් අසන්න",
        "簡単な質問",
      ),
      description: phrase(
        "Turn a polite statement into a question.",
        "ආචාරශීලී වාක්‍යයක් ප්‍රශ්නයක් බවට පත් කරන්න.",
        "丁寧な文を質問に変えましょう。",
      ),
      explanation: phrase(
        "Add か after です to ask a question. You can answer with はい (yes) or いいえ (no). For a negative answer, ではありません means ‘is not’ or ‘am not’.",
        "ප්‍රශ්නයක් ඇසීමට です පසු か එකතු කරන්න. はい (ඔව්) හෝ いいえ (නැහැ) ලෙස පිළිතුරු දෙන්න. ではありません යනු ‘නොවේ’ යන්නයි.",
        "「です」の後に「か」を付けると質問になります。「はい」か「いいえ」で答えます。「ではありません」は否定の丁寧な形です。",
      ),
      examples: [
        [
          "がくせい ですか。",
          "gakusei desu ka",
          phrase(
            "Are you a student?",
            "ඔබ ශිෂ්‍යයෙක් ද?",
            "学生かどうか質問する。",
          ),
        ],
        [
          "はい、がくせい です。",
          "hai, gakusei desu",
          phrase("Yes, I am a student.", "ඔව්, මම ශිෂ්‍යයෙක්.", "肯定の答え。"),
        ],
        [
          "いいえ、がくせい ではありません。",
          "iie, gakusei dewa arimasen",
          phrase(
            "No, I am not a student.",
            "නැහැ, මම ශිෂ්‍යයෙක් නොවේ.",
            "否定の答え。",
          ),
        ],
      ],
    },
  ],
  n4: [
    {
      japanese: "～ たことがある",
      title: phrase(
        "Talk about experience",
        "අත්දැකීම් ගැන කියන්න",
        "経験を話す",
      ),
      description: phrase(
        "Share something you have experienced before.",
        "ඔබ මීට පෙර කළ දෙයක් ගැන කියන්න.",
        "これまでの経験を伝えましょう。",
      ),
      explanation: phrase(
        "Use a verb in its た form followed by ことがあります to say you have experienced an action. It describes experience, without specifying exactly when it happened.",
        "ක්‍රියාපදයේ た රූපයට ことがあります යොදා අත්දැකීමක් කියන්න. නිශ්චිත කාලයක් සඳහන් නොකර කළ දෙයක් විස්තර කරයි.",
        "動詞のた形に「ことがあります」を付けると経験を表します。いつしたかではなく、経験があることを伝えます。",
      ),
      examples: [
        [
          "日本に 行ったことが あります。",
          "Nihon ni itta koto ga arimasu",
          phrase(
            "I have been to Japan.",
            "මම ජපානයට ගොස් තිබෙනවා.",
            "日本へ行った経験がある。",
          ),
        ],
        [
          "すしを 食べたことが あります。",
          "sushi o tabeta koto ga arimasu",
          phrase(
            "I have eaten sushi.",
            "මම සුෂි කා තිබෙනවා.",
            "すしを食べた経験がある。",
          ),
        ],
        [
          "富士山に 登ったことが ありません。",
          "Fujisan ni nobotta koto ga arimasen",
          phrase(
            "I have never climbed Mount Fuji.",
            "මම ෆුජි කන්ද නැග නැහැ.",
            "富士山に登った経験がない。",
          ),
        ],
      ],
    },
    {
      japanese: "～ ながら",
      title: phrase(
        "Two things at once",
        "එකවර ක්‍රියා දෙකක්",
        "同時にすること",
      ),
      description: phrase(
        "Connect two actions happening at the same time.",
        "එකම වේලාවේ සිදුවන ක්‍රියා දෙකක් සම්බන්ධ කරන්න.",
        "同時に行う二つの動作をつなげましょう。",
      ),
      explanation: phrase(
        "Remove ます from the polite verb and add ながら. The action after ながら is the main action. Both actions usually have the same person doing them.",
        "ක්‍රියාපදයේ ආචාරශීලී රූපයෙන් ます ඉවත් කර ながら යොදන්න. ඉන් පසුව ඇති ක්‍රියාව ප්‍රධාන ක්‍රියාවයි. සාමාන්‍යයෙන් ක්‍රියා දෙකම කරන්නේ එකම කෙනාය.",
        "ます形から「ます」を取って「ながら」を付けます。後の文が主な動作です。二つの動作の主語は通常同じです。",
      ),
      examples: [
        [
          "音楽を 聞きながら 勉強します。",
          "ongaku o kikinagara benkyō shimasu",
          phrase(
            "I study while listening to music.",
            "සංගීතය අසමින් මම පාඩම් කරනවා.",
            "音楽と勉強を同時に行う。",
          ),
        ],
        [
          "歩きながら 話します。",
          "arukinagara hanashimasu",
          phrase(
            "We talk while walking.",
            "අපි ඇවිදිමින් කතා කරනවා.",
            "歩くことと話すことを同時に行う。",
          ),
        ],
        [
          "お茶を 飲みながら 読みます。",
          "ocha o nominagara yomimasu",
          phrase(
            "I read while drinking tea.",
            "තේ බොමින් මම කියවනවා.",
            "お茶と読書を同時に楽しむ。",
          ),
        ],
      ],
    },
    {
      japanese: "～ つもりです",
      title: phrase("Make a plan", "සැලැස්මක් කියන්න", "予定を話す"),
      description: phrase(
        "Express an intention you have already decided on.",
        "ඔබ තීරණය කළ අදහසක් පවසන්න.",
        "すでに決めた意図を伝えましょう。",
      ),
      explanation: phrase(
        "Use the dictionary form of a verb plus つもりです for an intention. Use the ない form before つもりです to say you intend not to do something.",
        "අදහසක් ප්‍රකාශ කිරීමට ක්‍රියාපදයේ ශබ්දකෝෂ රූපයට つもりです යොදන්න. නොකිරීමට අදහස් කරන විට ない රූපය යොදන්න.",
        "動詞の辞書形に「つもりです」を付けると意図を表します。しない意図には、ない形を使います。",
      ),
      examples: [
        [
          "来年 日本に 行くつもりです。",
          "rainen Nihon ni iku tsumori desu",
          phrase(
            "I intend to go to Japan next year.",
            "ලබන වසරේ ජපානයට යාමට මම අදහස් කරනවා.",
            "来年の意図を伝える。",
          ),
        ],
        [
          "毎日 勉強するつもりです。",
          "mainichi benkyō suru tsumori desu",
          phrase(
            "I intend to study every day.",
            "දිනපතා පාඩම් කිරීමට මම අදහස් කරනවා.",
            "毎日の勉強を決めている。",
          ),
        ],
        [
          "今日は 出かけないつもりです。",
          "kyō wa dekakenai tsumori desu",
          phrase(
            "I intend not to go out today.",
            "අද පිටතට නොයාමට මම අදහස් කරනවා.",
            "今日は外出しない予定。",
          ),
        ],
      ],
    },
    {
      japanese: "～ ほうがいい",
      title: phrase("Give gentle advice", "උපදෙසක් දෙන්න", "アドバイスをする"),
      description: phrase(
        "Suggest a helpful action politely.",
        "ප්‍රයෝජනවත් ක්‍රියාවක් යෝජනා කරන්න.",
        "役立つ行動を勧めましょう。",
      ),
      explanation: phrase(
        "Use the た form with ほうがいいです to recommend doing something. Use the ない form to recommend avoiding an action.",
        "යමක් කිරීම නිර්දේශ කිරීමට た රූපය සමඟ ほうがいいです යොදන්න. නොකිරීමට උපදෙස් දෙන විට ない රූපය යොදන්න.",
        "た形に「ほうがいいです」を付けると行動を勧めます。しないように勧めるときは、ない形を使います。",
      ),
      examples: [
        [
          "早く 寝たほうが いいです。",
          "hayaku neta hō ga ii desu",
          phrase(
            "You should go to bed early.",
            "ඉක්මනින් නිදාගැනීම හොඳයි.",
            "早く寝ることを勧める。",
          ),
        ],
        [
          "水を 飲んだほうが いいです。",
          "mizu o nonda hō ga ii desu",
          phrase(
            "You should drink water.",
            "වතුර බීම හොඳයි.",
            "水を飲むことを勧める。",
          ),
        ],
        [
          "無理を しないほうが いいです。",
          "muri o shinai hō ga ii desu",
          phrase(
            "You should not overdo it.",
            "අධික වෙහෙසක් නොගැනීම හොඳයි.",
            "無理をしないよう勧める。",
          ),
        ],
      ],
    },
    {
      japanese: "～ かもしれません",
      title: phrase(
        "Talk about possibility",
        "විය හැකි දේ කියන්න",
        "可能性を話す",
      ),
      description: phrase(
        "Say what may happen when you are unsure.",
        "අවිනිශ්චිත විට සිදුවිය හැකි දේ කියන්න.",
        "確かではない可能性を伝えましょう。",
      ),
      explanation: phrase(
        "Use a plain-form verb before かもしれません to say ‘might’. For nouns and な-adjectives, leave out だ before かもしれません.",
        "‘විය හැක’ කීමට සරල ක්‍රියාපද රූපය පසු かもしれません යොදන්න. නාම පද සහ な විශේෂණ සමඟ だ ඉවත් කරන්න.",
        "普通形に「かもしれません」を付けて可能性を表します。名詞とな形容詞では「だ」を付けません。",
      ),
      examples: [
        [
          "明日 雨が 降るかもしれません。",
          "ashita ame ga furu kamoshiremasen",
          phrase(
            "It might rain tomorrow.",
            "හෙට වැසි විය හැකියි.",
            "明日の雨の可能性。",
          ),
        ],
        [
          "少し 遅れるかもしれません。",
          "sukoshi okureru kamoshiremasen",
          phrase(
            "I might be a little late.",
            "මම ටිකක් ප්‍රමාද විය හැකියි.",
            "遅刻する可能性。",
          ),
        ],
        [
          "あの人は 先生かもしれません。",
          "ano hito wa sensei kamoshiremasen",
          phrase(
            "That person might be a teacher.",
            "ඒ පුද්ගලයා ගුරුවරයෙක් විය හැකියි.",
            "相手の職業の推測。",
          ),
        ],
      ],
    },
  ],
};

function ResourcePanel({ lesson, language }) {
  const [tab, setTab] = useState("examples");
  const buttons = useRef([]);
  const tabs = ["examples", "reading"];
  function handleKeys(event, index) {
    const changes = {
      ArrowRight: (index + 1) % 2,
      ArrowLeft: (index + 1) % 2,
      Home: 0,
      End: 1,
    };
    if (!(event.key in changes)) return;
    event.preventDefault();
    const next = changes[event.key];
    setTab(tabs[next]);
    buttons.current[next]?.focus();
  }
  return (
    <aside
      className="nv-resources"
      aria-label={text(
        language,
        "Lesson resources",
        "පාඩම් සම්පත්",
        "学習資料",
      )}
    >
      <div
        className="nv-tabs"
        role="tablist"
        aria-label={text(
          language,
          "Lesson resources",
          "පාඩම් සම්පත්",
          "学習資料",
        )}
      >
        {tabs.map((name, index) => (
          <button
            key={name}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            id={"resource-" + name}
            role="tab"
            aria-selected={tab === name}
            aria-controls="resource-panel"
            tabIndex={tab === name ? 0 : -1}
            onKeyDown={(event) => handleKeys(event, index)}
            onClick={() => setTab(name)}
          >
            {name === "examples"
              ? text(language, "Examples", "උදාහරණ", "例文")
              : text(language, "Reading guide", "කියවීම", "読み方")}
          </button>
        ))}
      </div>
      <div
        id="resource-panel"
        role="tabpanel"
        aria-labelledby={"resource-" + tab}
        tabIndex={0}
      >
        {lesson.examples.map(([japanese, romanized, meaning], index) => (
          <article className="nv-example" key={japanese}>
            <span className="nv-example-index">0{index + 1}</span>
            <div>
              <p lang="ja">{japanese}</p>
              {tab === "reading" && <p className="nv-romanized">{romanized}</p>}
              <small>{translated(meaning, language)}</small>
            </div>
          </article>
        ))}
      </div>
      <p className="nv-resource-tip">
        <BookOpen aria-hidden="true" />
        {text(
          language,
          "Read each sentence aloud, then try your own version.",
          "සෑම වාක්‍යයක්ම හඬ නඟා කියවා ඔබේ වාක්‍යයක් සාදන්න.",
          "声に出して読み、自分の文も作ってみましょう。",
        )}
      </p>
    </aside>
  );
}

export function Lesson({
  language = "en",
  courseId = "n5",
  completedIds = [],
  onComplete,
  onPractice,
}) {
  const normalizedCourse = String(courseId).toLowerCase();
  const courseLessons = lessons[normalizedCourse] || lessons.n5;
  const [active, setActive] = useState(normalizedCourse === "n5" ? 2 : 0);
  const titleRef = useRef(null);
  useEffect(() => {
    setActive(normalizedCourse === "n5" ? 2 : 0);
  }, [normalizedCourse]);
  const lesson = courseLessons[active];
  const lessonId = courseId + "-" + active;
  const done = completedIds.includes(lessonId);
  const completedCount = courseLessons.filter((_, index) =>
    completedIds.includes(courseId + "-" + index),
  ).length;
  const percentage = Math.round((completedCount / courseLessons.length) * 100);
  function selectLesson(index) {
    setActive(index);
    requestAnimationFrame(() =>
      titleRef.current?.focus({ preventScroll: true }),
    );
  }
  return (
    <div className="nv-study">
      <aside
        className="nv-lesson-sidebar"
        aria-label={text(
          language,
          "Course lessons",
          "පාඨමාලා පාඩම්",
          "コースのレッスン",
        )}
      >
        <div className="nv-course-label">
          <GraduationCap weight="fill" aria-hidden="true" /> JLPT{" "}
          {normalizedCourse.toUpperCase()}
        </div>
        <p className="nv-eyebrow">
          {text(language, "Your learning path", "ඔබේ ඉගෙනුම් මඟ", "学習の流れ")}
        </p>
        <ol className="nv-lesson-list">
          {courseLessons.map((entry, index) => (
            <li key={entry.japanese}>
              <button
                className={active === index ? "selected" : ""}
                aria-current={active === index ? "step" : undefined}
                onClick={() => selectLesson(index)}
              >
                <span
                  className={
                    completedIds.includes(courseId + "-" + index)
                      ? "nv-step completed"
                      : "nv-step"
                  }
                >
                  {completedIds.includes(courseId + "-" + index) ? (
                    <Check
                      aria-label={text(
                        language,
                        "Complete",
                        "සම්පූර්ණයි",
                        "完了",
                      )}
                    />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  <small>
                    {text(language, "Lesson", "පාඩම", "レッスン")}{" "}
                    {String(index + 1).padStart(2, "0")}
                  </small>
                  <strong lang="ja">{entry.japanese}</strong>
                  <em>{translated(entry.title, language)}</em>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="nv-progress-summary">
          <div>
            <span>
              {text(
                language,
                "Sample progress",
                "ආදර්ශ ප්‍රගතිය",
                "サンプルの進捗",
              )}
            </span>
            <b>{percentage}%</b>
          </div>
          <progress
            value={completedCount}
            max={courseLessons.length}
            aria-label={text(
              language,
              "Lessons complete",
              "සම්පූර්ණ කළ පාඩම්",
              "完了したレッスン",
            )}
          />
          <small>
            {completedCount} / {courseLessons.length}{" "}
            {text(
              language,
              "sample lessons",
              "ආදර්ශ පාඩම්",
              "サンプルレッスン",
            )}
          </small>
        </div>
      </aside>
      <main className="nv-lesson-main" id="main-content">
        <div className="nv-breadcrumb">
          <BookOpen aria-hidden="true" />
          <span>JLPT {normalizedCourse.toUpperCase()}</span>
          <span aria-hidden="true">/</span>
          <span>
            {text(language, "Lesson", "පාඩම", "レッスン")}{" "}
            {String(active + 1).padStart(2, "0")}
          </span>
        </div>
        <label className="nv-mobile-picker">
          {text(language, "Choose a lesson", "පාඩමක් තෝරන්න", "レッスンを選ぶ")}
          <select
            value={active}
            onChange={(event) => selectLesson(Number(event.target.value))}
          >
            {courseLessons.map((entry, index) => (
              <option value={index} key={entry.japanese}>
                {index + 1}. {translated(entry.title, language)}
              </option>
            ))}
          </select>
        </label>
        <header className="nv-lesson-heading">
          <span className="nv-level">
            JLPT {normalizedCourse.toUpperCase()}
          </span>
          <h1 ref={titleRef} tabIndex={-1} lang="ja">
            {lesson.japanese}
          </h1>
          <h2>{translated(lesson.title, language)}</h2>
          <p>{translated(lesson.description, language)}</p>
        </header>
        <div className="nv-workspace">
          <div className="nv-primary-study">
            <figure className="nv-media-preview">
              <img
                src="/assets/lesson-teacher.webp"
                width="1200"
                height="675"
                fetchPriority="high"
                alt={text(
                  language,
                  "Illustration of a Japanese teacher introducing a grammar pattern",
                  "ජපන් ව්‍යාකරණ රටාවක් උගන්වන ගුරුවරියකගේ නිදර්ශනය",
                  "日本語の文型を説明する先生のイメージ",
                )}
              />
              <figcaption>
                <Image aria-hidden="true" />
                {text(
                  language,
                  "Illustration preview · course video pending",
                  "නිදර්ශන පෙරදසුන · පාඨමාලා වීඩියෝව පසුව",
                  "イメージ画像 · コース動画は準備中",
                )}
              </figcaption>
            </figure>
            <section className="nv-lesson-note">
              <h3>
                {text(
                  language,
                  "One idea to remember",
                  "මතක තබාගත යුතු කරුණ",
                  "覚えておくポイント",
                )}
              </h3>
              <p>{translated(lesson.explanation, language)}</p>
            </section>
            <div className="nv-learning-actions">
              <button
                className="primary-button"
                onClick={() => onComplete(lessonId)}
                disabled={done}
              >
                {done ? (
                  <CheckCircle weight="fill" aria-hidden="true" />
                ) : (
                  <Check aria-hidden="true" />
                )}
                {done
                  ? text(
                      language,
                      "Lesson complete",
                      "පාඩම සම්පූර්ණයි",
                      "レッスン完了",
                    )
                  : text(
                      language,
                      "Mark complete",
                      "සම්පූර්ණ කළා",
                      "完了にする",
                    )}
              </button>
              <button className="quiet-button" onClick={onPractice}>
                <Timer aria-hidden="true" />
                {text(language, "Quick practice", "කෙටි පුහුණුව", "ミニ練習")}
              </button>
            </div>
            {active < courseLessons.length - 1 && (
              <button
                className="nv-next-lesson"
                onClick={() => selectLesson(active + 1)}
              >
                {text(language, "Next lesson", "ඊළඟ පාඩම", "次のレッスン")}
                <ArrowRight aria-hidden="true" />
              </button>
            )}
          </div>
          <ResourcePanel
            key={lesson.japanese}
            lesson={lesson}
            language={language}
          />
        </div>
      </main>
    </div>
  );
}

const questions = {
  n5: [
    {
      prompt: phrase(
        "Which hiragana represents the sound ‘a’?",
        "‘a’ ශබ්දය සඳහා හිරගනා අකුර කුමක්ද?",
        "a の音を表すひらがなはどれですか。",
      ),
      options: ["い", "あ", "お"],
      correct: 1,
      explanation: phrase(
        "あ is a. い is i, and お is o.",
        "あ = a, い = i, お = o.",
        "あは a、いは i、おは o です。",
      ),
    },
    {
      prompt: phrase(
        "Choose the polite morning greeting.",
        "උදෑසන ආචාරශීලී ආචාරය තෝරන්න.",
        "朝の丁寧なあいさつを選んでください。",
      ),
      options: ["ありがとうございます", "こんにちは", "おはようございます"],
      correct: 2,
      explanation: phrase(
        "おはようございます means ‘Good morning’.",
        "おはようございます යනු ‘සුබ උදෑසනක්’ යන්නයි.",
        "朝は「おはようございます」と言います。",
      ),
    },
    {
      prompt: phrase(
        "Which sentence means ‘I am a student’?",
        "‘මම ශිෂ්‍යයෙක්’ යන්නට ගැළපෙන වාක්‍යය කුමක්ද?",
        "自分が学生であることを伝える文はどれですか。",
      ),
      options: [
        "わたしは がくせい です。",
        "わたしは せんせい です。",
        "あなたは がくせい です。",
      ],
      correct: 0,
      explanation: phrase(
        "わたし means I and がくせい means student.",
        "わたし යනු මම යන්නයි. がくせい යනු ශිෂ්‍යයා යන්නයි.",
        "「わたし」は自分を、「がくせい」は学生を表します。",
      ),
    },
    {
      prompt: phrase(
        "Which word points to something near the speaker?",
        "කථිකයා අසල ඇති දෙයක් සඳහා යොදන වචනය කුමක්ද?",
        "話し手の近くの物を指す言葉はどれですか。",
      ),
      options: ["あれ", "これ", "それ"],
      correct: 1,
      explanation: phrase(
        "これ means this, close to the speaker.",
        "これ යනු කථිකයා අසල ඇති ‘මෙය’ යන්නයි.",
        "「これ」は話し手に近い物を指します。",
      ),
    },
    {
      prompt: phrase(
        "Complete the polite question — がくせい です __ 。",
        "ප්‍රශ්නය සම්පූර්ණ කරන්න — がくせい です __ 。",
        "質問を完成してください。がくせい です __ 。",
      ),
      options: ["を", "が", "か"],
      correct: 2,
      explanation: phrase(
        "Add か at the end to ask a question.",
        "ප්‍රශ්නයක් ඇසීමට අවසානයට か එකතු කරන්න.",
        "文末に「か」を付けると質問になります。",
      ),
    },
  ],
  n4: [
    {
      prompt: phrase(
        "Choose the sentence describing a past experience.",
        "අතීත අත්දැකීමක් දක්වන වාක්‍යය තෝරන්න.",
        "経験を表す文を選んでください。",
      ),
      options: [
        "日本に 行くつもりです。",
        "日本に 行ったことが あります。",
        "日本に 行きます。",
      ],
      correct: 1,
      explanation: phrase(
        "たことがあります describes an experience.",
        "たことがあります මඟින් අත්දැකීමක් දැක්වේ.",
        "「たことがあります」は経験を表します。",
      ),
    },
    {
      prompt: phrase(
        "Complete ‘I study while listening to music’ — 音楽を 聞き __ 勉強します。",
        "‘සංගීතය අසමින් පාඩම් කරනවා’ සම්පූර්ණ කරන්න — 音楽を 聞き __ 勉強します。",
        "文を完成してください。音楽を 聞き __ 勉強します。",
      ),
      options: ["ことが", "つもり", "ながら"],
      correct: 2,
      explanation: phrase(
        "ながら connects simultaneous actions by the same person.",
        "ながら එකම කෙනා එකවර කරන ක්‍රියා සම්බන්ධ කරයි.",
        "「ながら」は同じ人の同時の動作をつなげます。",
      ),
    },
    {
      prompt: phrase(
        "Which phrase expresses an intention to study?",
        "පාඩම් කිරීමට ඇති අදහස පෙන්වන වාක්‍යය කුමක්ද?",
        "勉強する意図を表す文はどれですか。",
      ),
      options: [
        "勉強するつもりです。",
        "勉強したことがあります。",
        "勉強したほうがいいです。",
      ],
      correct: 0,
      explanation: phrase(
        "Dictionary form + つもりです expresses intention.",
        "ශබ්දකෝෂ රූපය + つもりです අදහසක් දක්වයි.",
        "辞書形に「つもりです」を付けると意図を表します。",
      ),
    },
    {
      prompt: phrase(
        "Choose advice to go to bed early.",
        "ඉක්මනින් නිදාගැනීමට දෙන උපදෙස තෝරන්න.",
        "早く寝るように勧める文を選んでください。",
      ),
      options: [
        "早く寝るつもりです。",
        "早く寝たほうがいいです。",
        "早く寝たことがあります。",
      ],
      correct: 1,
      explanation: phrase(
        "たほうがいいです recommends an action.",
        "たほうがいいです ක්‍රියාවක් නිර්දේශ කරයි.",
        "た形と「ほうがいいです」で行動を勧めます。",
      ),
    },
    {
      prompt: phrase(
        "What completes ‘It might rain’? — 雨が降る __ 。",
        "‘වැසි විය හැකියි’ සම්පූර්ණ කරන්න — 雨が降る __ 。",
        "可能性を表す文を完成してください。雨が降る __ 。",
      ),
      options: ["ながら", "ことがあります", "かもしれません"],
      correct: 2,
      explanation: phrase(
        "かもしれません expresses an uncertain possibility.",
        "かもしれません අවිනිශ්චිත හැකියාවක් දක්වයි.",
        "「かもしれません」は確かではない可能性を表します。",
      ),
    },
  ],
};

export function Assessment({
  language = "en",
  courseId = "n5",
  onBack,
  onResult,
}) {
  const items = questions[String(courseId).toLowerCase()] || questions.n5;
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const focusRef = useRef(null);
  const question = items[Math.min(answers.length, items.length - 1)];
  const score = answers.filter(
    (answer, index) => answer === items[index].correct,
  ).length;
  function advance() {
    const nextAnswers = [...answers, selected];
    if (nextAnswers.length === items.length) {
      setFinished(true);
      onResult({
        courseId,
        score: nextAnswers.filter(
          (answer, index) => answer === items[index].correct,
        ).length,
        total: items.length,
      });
    }
    setAnswers(nextAnswers);
    setSelected(null);
    setChecked(false);
    requestAnimationFrame(() => focusRef.current?.focus());
  }
  function restart() {
    setAnswers([]);
    setSelected(null);
    setChecked(false);
    setFinished(false);
    requestAnimationFrame(() => focusRef.current?.focus());
  }
  return (
    <main className="nv-assessment" id="main-content">
      <button className="back-link" onClick={onBack}>
        <CaretLeft aria-hidden="true" />
        {text(language, "Back to lesson", "පාඩම වෙත", "レッスンに戻る")}
      </button>
      <div className="nv-assessment-heading">
        <span className="nv-level">
          JLPT {String(courseId).toUpperCase()} ·{" "}
          {text(language, "Practice", "පුහුණුව", "練習")}
        </span>
        <h1 ref={focusRef} tabIndex={-1}>
          {finished
            ? text(
                language,
                "Your practice results",
                "ඔබේ පුහුණු ප්‍රතිඵල",
                "練習の結果",
              )
            : text(
                language,
                "A little practice. A big step.",
                "කුඩා පුහුණුවක්. විශාල පියවරක්.",
                "少しの練習、大きな一歩。",
              )}
        </h1>
        <p>
          {text(
            language,
            "Five sample questions with explanations. Take your time.",
            "පැහැදිලි කිරීම් සහිත ආදර්ශ ප්‍රශ්න පහක්. ඔබට අවශ්‍ය කාලය ගන්න.",
            "解説付きのサンプル問題が五つあります。自分のペースでどうぞ。",
          )}
        </p>
      </div>
      {finished ? (
        <section className="nv-results">
          <div className="nv-score">
            <CheckCircle weight="fill" aria-hidden="true" />
            <strong>
              {score} / {items.length}
            </strong>
            <span>
              {text(language, "correct answers", "නිවැරදි පිළිතුරු", "正解")}
            </span>
          </div>
          <h2>
            {text(
              language,
              "Review your answers",
              "ඔබේ පිළිතුරු බලන්න",
              "回答を確認",
            )}
          </h2>
          <ol className="nv-answer-review">
            {items.map((item, index) => (
              <li key={index}>
                <b>{translated(item.prompt, language)}</b>
                <p lang="ja">{item.options[item.correct]}</p>
                <small>{translated(item.explanation, language)}</small>
                <span
                  className={
                    answers[index] === item.correct
                      ? "nv-correct"
                      : "nv-incorrect"
                  }
                >
                  {answers[index] === item.correct
                    ? text(language, "Correct", "නිවැරදියි", "正解")
                    : text(
                        language,
                        "Your answer",
                        "ඔබේ පිළිතුර",
                        "あなたの回答",
                      ) +
                      " — " +
                      item.options[answers[index]]}
                </span>
              </li>
            ))}
          </ol>
          <div className="nv-learning-actions">
            <button className="primary-button" onClick={onBack}>
              <BookOpen aria-hidden="true" />
              {text(
                language,
                "Continue learning",
                "ඉගෙනීම ඉදිරියට",
                "学習を続ける",
              )}
            </button>
            <button className="quiet-button" onClick={restart}>
              <ArrowCounterClockwise aria-hidden="true" />
              {text(language, "Try again", "නැවත උත්සාහ කරන්න", "もう一度")}
            </button>
          </div>
        </section>
      ) : (
        <section className="nv-question-card">
          <div className="nv-question-progress">
            <span>
              {text(language, "Question", "ප්‍රශ්නය", "問題")}{" "}
              {answers.length + 1} / {items.length}
            </span>
            <progress
              value={answers.length}
              max={items.length}
              aria-label={text(
                language,
                "Assessment progress",
                "පරීක්ෂණ ප්‍රගතිය",
                "練習の進捗",
              )}
            />
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (selected !== null) setChecked(true);
            }}
          >
            <fieldset disabled={checked}>
              <legend>{translated(question.prompt, language)}</legend>
              {question.options.map((option, index) => (
                <label
                  className={selected === index ? "chosen" : ""}
                  key={option}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={selected === index}
                    onChange={() => setSelected(index)}
                  />
                  <span lang="ja">{option}</span>
                </label>
              ))}
            </fieldset>
            {checked ? (
              <>
                <div
                  role="status"
                  className={
                    "nv-feedback " +
                    (selected === question.correct ? "correct" : "retry")
                  }
                >
                  <strong>
                    {selected === question.correct
                      ? text(
                          language,
                          "Correct. Nicely done!",
                          "නිවැරදියි. හොඳ වැඩක්!",
                          "正解です！",
                        )
                      : text(
                          language,
                          "A useful one to review.",
                          "මෙය නැවත බලමු.",
                          "復習してみましょう。",
                        )}
                  </strong>
                  <p>{translated(question.explanation, language)}</p>
                  <p lang="ja">{question.options[question.correct]}</p>
                </div>
                <button
                  type="button"
                  className="primary-button"
                  onClick={advance}
                >
                  {answers.length === items.length - 1
                    ? text(
                        language,
                        "See results",
                        "ප්‍රතිඵල බලන්න",
                        "結果を見る",
                      )
                    : text(
                        language,
                        "Next question",
                        "ඊළඟ ප්‍රශ්නය",
                        "次の問題",
                      )}
                  <ArrowRight aria-hidden="true" />
                </button>
              </>
            ) : (
              <button
                className="primary-button"
                type="submit"
                disabled={selected === null}
              >
                {text(language, "Check answer", "පිළිතුර බලන්න", "答えを確認")}
                <ArrowRight aria-hidden="true" />
              </button>
            )}
          </form>
        </section>
      )}
    </main>
  );
}
