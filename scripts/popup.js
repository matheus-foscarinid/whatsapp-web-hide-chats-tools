const WHATSAPP_WEB_URL = 'https://web.whatsapp.com/'

let mainToggle = null;
let currentState = false;


const getCurrentStateFromStorage = async () => {
  const result = await chrome.storage.local.get(['currentState']);
  return result.currentState;
};

const addBlurScript = async (tab) => {
  await chrome.scripting.insertCSS({
    files: ['styles/chat-tools.css'],
    target: { tabId: tab.id },
  });
};

const removeBlurScript = async (tab) => {
  await chrome.scripting.removeCSS({
    files: ['styles/chat-tools.css'],
    target: { tabId: tab.id },
  });
}

const addClickListener = (tab) => {
  mainToggle.addEventListener('change', async () => {
    currentState = !currentState;
    chrome.storage.local.set({ currentState });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.startsWith(WHATSAPP_WEB_URL)) return;

    const toggleMethod = currentState 
      ? addBlurScript
      : removeBlurScript;

    toggleMethod(tab);
  });
};

const startExtension = async () => {
  // Get the current state from storage
  currentState = await getCurrentStateFromStorage();
  mainToggle = document.querySelector('#main-toggle input');
  mainToggle.checked = currentState;

  if (currentState) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.startsWith(WHATSAPP_WEB_URL)) return;
    addBlurScript(tab);
  }

  // Add a click listener to the extension icon
  addClickListener();
};

startExtension();
