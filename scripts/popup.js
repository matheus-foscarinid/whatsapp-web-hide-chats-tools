const WHATSAPP_WEB_URL = 'https://web.whatsapp.com/'
const DEFAULT_LOGO = 'images/icon/icon-48.png';
const DISABLED_LOGO = 'images/icon/icon-48-disabled.png';

let mainToggle = null;
let currentState = false;

const getCurrentStateFromStorage = async () => {
  const result = await chrome.storage.local.get(['currentState']);
  return result.currentState;
};

const addBlurScript = async (tab) => {
  await chrome.scripting.insertCSS({
    files: ['styles/configs/chat-picture-blur.css'],
    target: { tabId: tab.id },
  });
};

const removeBlurScript = async (tab) => {
  await chrome.scripting.removeCSS({
    files: ['styles/configs/chat-picture-blur.css'],
    target: { tabId: tab.id },
  });
};

const setlogoAccordingToExtensionState = (state) => {
  const logoPath = state ? DEFAULT_LOGO : DISABLED_LOGO;
  document.querySelector('header img').src = logoPath;
}

const setConfigsAccordingToExtensionState = (state) => {
  const configsDiv = document.querySelector('.configs');

  if (state) {
    configsDiv.classList.add('active');
  } else {
    configsDiv.classList.remove('active');
  }
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
    setlogoAccordingToExtensionState(currentState);
    setConfigsAccordingToExtensionState(currentState);
  });
};

const startExtension = async () => {
  currentState = await getCurrentStateFromStorage();
  mainToggle = document.querySelector('#main-toggle input');
  mainToggle.checked = currentState;

  if (currentState) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.startsWith(WHATSAPP_WEB_URL)) return;
    addBlurScript(tab);
  }

  setlogoAccordingToExtensionState(currentState);
  setConfigsAccordingToExtensionState(currentState);
  addClickListener();
};

startExtension();
