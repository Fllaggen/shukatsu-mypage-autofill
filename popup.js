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
  password: ""
};

const fields = Array.from(document.querySelectorAll("[data-key]"));
const statusEl = document.querySelector("#status");

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
    `自動判定できた項目 ${result.detected} 個`
  ];
  if (result.detectedFields?.length) {
    lines.push(result.detectedFields.slice(0, 10).map((item) => `・${item.field}: ${item.name}`).join("\n"));
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
    setStatus(summarizeScan(result));
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
