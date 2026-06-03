const STORAGE_KEY = "profile";

const DEFAULT_PROFILE = {
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  romanLastName: "",
  romanFirstName: "",
  email: "",
  subEmail: "",
  homePhone: "",
  mobilePhone: "",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  gender: "",
  postalCode: "",
  prefecture: "",
  address1: "",
  address2: "",
  holidaySame: true,
  gradYear: "",
  gradMonth: "03",
  gradStatus: "",
  schoolName: "",
  faculty: "",
  department: "",
  schoolType: "",
  schoolStartYear: "",
  schoolStartMonth: "",
  schoolEndYear: "",
  schoolEndMonth: "",
  degree: "",
  degreeYear: "",
  degreeMonth: "",
  highSchoolName: "",
  highSchoolKana: "",
  highSchoolPrefecture: "",
  highSchoolType: "",
  highSchoolStartYear: "",
  highSchoolStartMonth: "",
  highSchoolGradYear: "",
  highSchoolGradMonth: "",
  humanitiesScience: "",
  seminar: "",
  researchTheme: "",
  club: "",
  qualification: "",
  driverLicense: "",
  toeic: "",
  desiredJob: "",
  desiredLocation: "",
  interestedEvents: "",
  eventDate: "",
  termsConsent: false,
  privacyConsent: false,
  residenceStatus: "",
  workAuthorization: "",
  nationality: "",
  studyAbroad: "",
  disabilityStatus: "",
  employmentHistory: "",
  noAnswer: "なし",
  howKnowCompany: "",
  internshipExperience: "",
  loginId: "",
  verificationCode: "",
  password: "",
  foreignAddress: false,
  referralDetail: "",
  employmentBrand: "",
  employmentStore: "",
  employeeNumber: "",
  employmentStartYear: "",
  employmentStartMonth: "",
  employmentDuration: "",
  relocationConsent: ""
};

const fields = Array.from(document.querySelectorAll("[data-key]"));
const statusEl = document.querySelector("#status");
const reviewEl = document.querySelector("#review");
const reviewSummaryEl = document.querySelector("#reviewSummary");
const reviewBodyEl = document.querySelector("#reviewBody");
const importFileInput = document.querySelector("#importFile");
let lastScan = null;

const FIELD_LABELS = {
  fullName: "氏名",
  fullNameKana: "氏名カナ",
  lastName: "姓",
  firstName: "名",
  lastNameKana: "セイ",
  firstNameKana: "メイ",
  romanLastName: "ローマ字姓",
  romanFirstName: "ローマ字名",
  email: "メール",
  emailConfirm: "メール確認",
  subEmail: "サブメール",
  birthYear: "生年",
  birthMonth: "生月",
  birthDay: "生日",
  gender: "性別",
  postalCode: "郵便番号",
  prefecture: "都道府県",
  fullAddress: "住所",
  address1: "市区郡番地",
  address2: "建物名",
  phone: "電話番号",
  mobilePhone: "携帯番号",
  holidaySame: "休暇中住所",
  gradYear: "卒業年",
  gradMonth: "卒業月",
  gradStatus: "卒業区分",
  schoolName: "学校名",
  faculty: "学部",
  department: "学科・専攻",
  schoolType: "学校区分",
  humanitiesScience: "文理区分",
  highSchoolName: "高校名",
  highSchoolKana: "高校よみがな",
  highSchoolPrefecture: "高校所在地",
  highSchoolType: "高校区分",
  highSchoolStartYear: "高校入学年",
  highSchoolStartMonth: "高校入学月",
  highSchoolGradYear: "高校卒業年",
  highSchoolGradMonth: "高校卒業月",
  seminar: "ゼミ・研究室",
  researchTheme: "研究テーマ",
  club: "クラブ・サークル",
  qualification: "資格・免許",
  driverLicense: "運転免許",
  toeic: "TOEIC等",
  desiredJob: "希望職種",
  desiredLocation: "希望勤務地",
  interestedEvents: "参加希望イベント",
  eventDate: "イベント希望日程",
  termsConsent: "規約同意",
  privacyConsent: "個人情報同意",
  nationality: "国籍",
  residenceStatus: "在留資格",
  workAuthorization: "就労資格",
  studyAbroad: "留学経験",
  disabilityStatus: "障がい・配慮事項",
  employmentHistory: "職歴",
  howKnowCompany: "会社を知ったきっかけ",
  internshipExperience: "参加イベント・インターン",
  loginId: "ログインID",
  verificationCode: "認証コード",
  password: "パスワード",
  foreignAddress: "海外住所",
  referralDetail: "紹介者・その他詳細",
  employmentBrand: "勤務経験ブランド",
  employmentStore: "勤務店舗",
  employeeNumber: "社員番号",
  relocationConsent: "転勤確認回答"
};

function setStatus(message, warn = false) {
  statusEl.classList.toggle("warn", warn);
  statusEl.textContent = message;
}

function readForm() {
  const profile = { ...DEFAULT_PROFILE };
  for (const el of fields) {
    const key = el.dataset.key;
    profile[key] = el.type === "checkbox" ? el.checked : el.value.trim();
  }
  return profile;
}

function writeForm(profile) {
  const merged = { ...DEFAULT_PROFILE, ...profile };
  for (const el of fields) {
    const value = merged[el.dataset.key];
    if (el.type === "checkbox") el.checked = Boolean(value);
    else el.value = value || "";
  }
}

async function loadProfile() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  writeForm(result[STORAGE_KEY] || DEFAULT_PROFILE);
  setStatus("プロフィールを入力して保存してください。登録ボタンは自動で押しません。");
}

async function saveProfile() {
  const profile = readForm();
  await chrome.storage.local.set({ [STORAGE_KEY]: profile });
  setStatus("保存しました。個人情報はこのブラウザのローカル保存です。");
  return profile;
}

async function send(type, payload = {}) {
  const response = await chrome.runtime.sendMessage({ type, ...payload });
  if (!response?.ok) throw new Error(response?.error || "ページとの通信に失敗しました。");
  return response.result;
}

function summarizeScan(result) {
  const lines = [
    `${result.platform} / 入力欄 ${result.fields} 個`,
    `自動判定できた項目 ${result.detected} 個`,
    `未判定 ${result.unknown || 0} 個`,
    `未入力の必須欄 ${result.remainingRequiredCount || 0} 個`
  ];
  if (result.detectedFields?.length) {
    lines.push(result.detectedFields.slice(0, 8).map((item) => `・${item.field}: ${item.label || item.name}`).join("\n"));
  }
  if (result.unknownFields?.length) {
    lines.push("未判定の例");
    lines.push(result.unknownFields.slice(0, 8).map((item) => `・${item.label || item.name || item.type}`).join("\n"));
  }
  if (result.remainingRequired?.length) {
    lines.push("未入力の必須欄");
    lines.push(result.remainingRequired.slice(0, 8).map((item) => `・${item.label || item.name || item.type}`).join("\n"));
  }
  return lines.join("\n");
}

function summarizeFill(result) {
  const lines = [
    `${result.platform} に入力しました。`,
    `入力 ${result.matched} 個 / スキップ ${result.skipped} 個`,
    `未入力の必須欄 ${result.remainingRequiredCount || 0} 個`
  ];
  if (result.remainingRequired?.length) {
    lines.push("残っている必須欄");
    lines.push(result.remainingRequired.slice(0, 8).map((item) => `・${item.label || item.name || item.type}`).join("\n"));
  }
  return lines.join("\n");
}

function fieldLabel(field) {
  return FIELD_LABELS[field] || field || "未判定";
}

function itemTitle(item) {
  if (!item) return "名前なし";
  if (item.field) return fieldLabel(item.field);
  return item.label || item.name || item.type || "名前なし";
}

function itemDetail(item) {
  const parts = [];
  if (item.label && item.field) parts.push(item.label);
  if (item.name) parts.push(item.name);
  if (item.reason) parts.push(item.reason);
  return parts.filter(Boolean).join(" / ");
}

function renderReviewList(title, items, emptyText, className = "") {
  const section = document.createElement("section");
  section.className = "review-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.appendChild(heading);

  if (!items?.length) {
    const empty = document.createElement("p");
    empty.className = "review-empty";
    empty.textContent = emptyText;
    section.appendChild(empty);
    return section;
  }

  const list = document.createElement("ul");
  list.className = "review-list";
  for (const item of items.slice(0, 16)) {
    const row = document.createElement("li");
    row.className = className;
    const main = document.createElement("span");
    main.textContent = itemTitle(item);
    row.appendChild(main);
    const detail = itemDetail(item);
    if (detail) {
      const small = document.createElement("small");
      small.textContent = detail;
      row.appendChild(small);
    }
    list.appendChild(row);
  }
  if (items.length > 16) {
    const row = document.createElement("li");
    row.className = "review-more";
    row.textContent = `ほか ${items.length - 16} 個`;
    list.appendChild(row);
  }
  section.appendChild(list);
  return section;
}

function renderReview(result, mode) {
  if (!reviewEl || !reviewSummaryEl || !reviewBodyEl) return;
  reviewEl.hidden = false;
  reviewSummaryEl.innerHTML = "";
  reviewBodyEl.innerHTML = "";

  const counts = [
    ["入力", result.matched ?? result.detected ?? 0],
    ["未入力必須", result.remainingRequiredCount || 0],
    ["未判定", result.unknown || 0],
    ["スキップ", result.skipped || 0]
  ];
  for (const [label, value] of counts) {
    const chip = document.createElement("span");
    chip.className = value ? "review-chip" : "review-chip quiet";
    chip.textContent = `${label} ${value}`;
    reviewSummaryEl.appendChild(chip);
  }

  if (mode === "fill") {
    reviewBodyEl.appendChild(renderReviewList("入力された項目", result.matches || [], "まだ入力された項目はありません。"));
    reviewBodyEl.appendChild(renderReviewList("残っている必須欄", result.remainingRequired || [], "必須欄の残りは検出されていません。", "danger"));
    reviewBodyEl.appendChild(renderReviewList("未判定欄", result.unknownFields || [], "未判定欄は検出されていません。", "warn"));
    reviewBodyEl.appendChild(renderReviewList("スキップ", result.skippedItems || result.skipped || [], "スキップはありません。"));
  } else {
    reviewBodyEl.appendChild(renderReviewList("自動判定できた項目", result.detectedFields || [], "判定できた項目はありません。"));
    reviewBodyEl.appendChild(renderReviewList("未判定欄", result.unknownFields || [], "未判定欄は検出されていません。", "warn"));
    reviewBodyEl.appendChild(renderReviewList("未入力の必須欄", result.remainingRequired || [], "必須欄の残りは検出されていません。", "danger"));
  }
}

function summarizeEntries(result) {
  const candidates = result.candidates || result.entryCandidates || [];
  if (!candidates.length) return "登録入口候補は見つかりませんでした。ページ内の「新規登録」「エントリー」を押してから再実行してください。";
  return candidates
    .slice(0, 8)
    .map((item, index) => {
      const title = item.text || item.id || item.name || item.reason || `候補 ${index + 1}`;
      const url = item.href || item.formAction || "";
      return `${index + 1}. ${title}${url ? `\n   ${url}` : ""}`;
    })
    .join("\n");
}

document.querySelector("#save").addEventListener("click", () => {
  saveProfile().catch((error) => setStatus(error.message, true));
});

document.querySelector("#fill").addEventListener("click", async () => {
  try {
    const profile = await saveProfile();
    const overwrite = document.querySelector("#overwrite").checked;
    const result = await send("FILL_ACTIVE", { profile, options: { overwrite } });
    setStatus(summarizeFill(result), Boolean(result.remainingRequiredCount));
    renderReview(result, "fill");
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#highlight").addEventListener("click", async () => {
  try {
    const result = await send("HIGHLIGHT_ACTIVE");
    lastScan = result;
    setStatus(`ページ上で入力欄を色付けしました。\n緑: 判定済み / 茶色: 未判定 / 赤: 未入力の必須欄\n\n${summarizeScan(result)}`, Boolean(result.remainingRequiredCount || result.unknown));
    renderReview(result, "scan");
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#clearHighlight").addEventListener("click", async () => {
  try {
    await send("CLEAR_HIGHLIGHT_ACTIVE");
    setStatus("ページ上の色付けを消しました。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#scan").addEventListener("click", async () => {
  try {
    const result = await send("SCAN_ACTIVE");
    lastScan = result;
    setStatus(summarizeScan(result));
    renderReview(result, "scan");
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#clearReview").addEventListener("click", () => {
  reviewEl.hidden = true;
  reviewSummaryEl.innerHTML = "";
  reviewBodyEl.innerHTML = "";
});

document.querySelector("#copyUnknown").addEventListener("click", async () => {
  try {
    const result = lastScan || await send("SCAN_ACTIVE");
    lastScan = result;
    const lines = [
      `URL: ${result.url}`,
      `サイト: ${result.platform}`,
      `入力欄: ${result.fields} / 判定: ${result.detected} / 未判定: ${result.unknown || 0}`,
      `未入力の必須欄: ${result.remainingRequiredCount || 0}`,
      "",
      "未判定:",
      ...((result.unknownFields || []).map((item) => `- ${item.type}: ${item.label || item.name || "(名前なし)"}`)),
      "",
      "未入力の必須欄:",
      ...((result.remainingRequired || []).map((item) => `- ${item.type}: ${item.label || item.name || "(名前なし)"}`))
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setStatus("診断内容をコピーしました。対応依頼するときに貼り付けてください。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#exportProfile").addEventListener("click", () => {
  try {
    const profile = readForm();
    const payload = {
      app: "Shukatsu MyPage Autofill",
      version: 1,
      exportedAt: new Date().toISOString(),
      profile
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shukatsu-autofill-profile.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("保存データを書き出しました。個人情報入りなので扱いに注意してください。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#importProfile").addEventListener("click", () => {
  importFileInput.click();
});

importFileInput.addEventListener("change", async () => {
  try {
    const file = importFileInput.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text);
    const profile = parsed.profile || parsed;
    writeForm(profile);
    await saveProfile();
    setStatus("保存データを読み込みました。内容を確認してから使ってください。");
  } catch (error) {
    setStatus("読み込みに失敗しました。JSONファイルか確認してください。", true);
  } finally {
    importFileInput.value = "";
  }
});

document.querySelector("#clearProfile").addEventListener("click", async () => {
  if (!confirm("このブラウザに保存したプロフィールを消します。よろしいですか？")) return;
  try {
    await chrome.storage.local.remove(STORAGE_KEY);
    writeForm(DEFAULT_PROFILE);
    lastScan = null;
    if (reviewEl) reviewEl.hidden = true;
    setStatus("保存情報を消しました。");
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#findEntry").addEventListener("click", async () => {
  try {
    const result = await send("FIND_ENTRY_ACTIVE");
    setStatus(summarizeEntries(result));
  } catch (error) {
    setStatus(error.message, true);
  }
});

loadProfile().catch((error) => setStatus(error.message, true));
