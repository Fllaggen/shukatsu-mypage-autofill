const STORAGE_KEY = "profile";

const DEFAULT_PROFILE = {
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
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
  humanitiesScience: "",
  seminar: "",
  researchTheme: "",
  club: "",
  qualification: "",
  driverLicense: "",
  toeic: "",
  desiredJob: "",
  desiredLocation: "",
  companyCriteria: "",
  interestedEvents: "",
  eventDate: "",
  requestNote: "",
  termsConsent: false,
  privacyConsent: false,
  residenceStatus: "",
  workAuthorization: "",
  nationality: "",
  studyAbroad: "",
  disabilityStatus: "",
  employmentHistory: "",
  noAnswer: "なし",
  motivation: "",
  selfPr: "",
  studentEffort: "",
  strengths: "",
  weakness: "",
  howKnowCompany: "",
  internshipExperience: "",
  loginId: "",
  customAnswers: "",
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
let lastScan = null;

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
    `未判定 ${result.unknown || 0} 個`
  ];
  if (result.detectedFields?.length) {
    lines.push(result.detectedFields.slice(0, 8).map((item) => `・${item.field}: ${item.label || item.name}`).join("\n"));
  }
  if (result.unknownFields?.length) {
    lines.push("未判定の例");
    lines.push(result.unknownFields.slice(0, 8).map((item) => `・${item.label || item.name || item.type}`).join("\n"));
  }
  return lines.join("\n");
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
    setStatus(`${result.platform} に入力しました。\n入力 ${result.matched} 個 / スキップ ${result.skipped} 個`);
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#scan").addEventListener("click", async () => {
  try {
    const result = await send("SCAN_ACTIVE");
    lastScan = result;
    setStatus(summarizeScan(result));
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelector("#copyUnknown").addEventListener("click", async () => {
  try {
    const result = lastScan || await send("SCAN_ACTIVE");
    lastScan = result;
    const lines = [
      `URL: ${result.url}`,
      `サイト: ${result.platform}`,
      `入力欄: ${result.fields} / 判定: ${result.detected} / 未判定: ${result.unknown || 0}`,
      "",
      ...(result.unknownFields || []).map((item) => `- ${item.type}: ${item.label || item.name || "(名前なし)"}`)
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setStatus("未判定項目をコピーしました。対応依頼するときに貼り付けてください。");
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
