function canInject(url = "") {
  return /^https?:\/\//.test(url);
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const activeTab = tabs.find((tab) => tab.active);
  if (activeTab?.id && canInject(activeTab.url || "")) {
    return activeTab;
  }

  const fallbackTab = tabs
    .filter((tab) => tab.id && canInject(tab.url || ""))
    .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))[0];
  if (fallbackTab) {
    return fallbackTab;
  }

  throw new Error("通常の http/https ページを開いてから実行してください。");
}

async function sendToActiveTab(message) {
  const tab = await getActiveTab();
  if (!canInject(tab.url || "")) {
    throw new Error("このページでは実行できません。通常の http/https の登録ページで開いてください。");
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (_) {
    // The manifest content script may already be present.
  }

  return chrome.tabs.sendMessage(tab.id, message);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !message.type) return false;

  if (
    message.type === "SCAN_ACTIVE" ||
    message.type === "FILL_ACTIVE" ||
    message.type === "FIND_ENTRY_ACTIVE" ||
    message.type === "HIGHLIGHT_ACTIVE" ||
    message.type === "CLEAR_HIGHLIGHT_ACTIVE"
  ) {
    sendToActiveTab(message)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  return false;
});
