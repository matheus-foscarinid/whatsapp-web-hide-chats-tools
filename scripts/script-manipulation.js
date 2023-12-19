import storage from './storage.js';

const KEYS = ['pictureBlur', 'messageBlur', 'contactNameBlur', 'disableClicks'];
const KEY_SCRIPT_MAP = {
  pictureBlur: 'chat-picture-blur',
  messageBlur: 'last-message-blur',
  contactNameBlur: 'chat-name-blur',
};

export const addScript = async (scriptName, tab) => {
  await chrome.scripting.insertCSS({
    files: [`styles/configs/${KEY_SCRIPT_MAP[scriptName]}.css`],
    target: { tabId: tab.id },
  });
};

export const removeScript = async (scriptName, tab) => {
  await chrome.scripting.removeCSS({
    files: [`styles/configs/${KEY_SCRIPT_MAP[scriptName]}.css`],
    target: { tabId: tab.id },
  });
};

export const addAllActiveConfigScripts = async (tab) => {
  const storedValues = await storage.get(KEYS);

  KEYS.forEach(async (key) => {
    const value = storedValues[key];
    value && await addScript(KEY_SCRIPT_MAP[key], tab);
  });
}

export const removeAllActiveConfigScripts = async (tab) => {
  KEYS.forEach(async (key) => {
    await removeScript(KEY_SCRIPT_MAP[key], tab);
  });
}