import storage from './storage.js';
import {
  addScript,
  removeScript,
  addAllActiveConfigScripts, 
  removeAllActiveConfigScripts 
} from './script-manipulation.js';

// Constants
const WHATSAPP_WEB_URL = 'https://web.whatsapp.com/'
const DEFAULT_LOGO = 'images/icon/icon-48.png';
const DISABLED_LOGO = 'images/icon/icon-48-disabled.png';
const CONFIG_KEYS = ['blurIntensity', 'pictureBlur', 'messageBlur', 'contactNameBlur', 'disableClicks'];

let currentTab = null;
let currentState = false;

const setlogoAccordingToExtensionState = () => {
  const logoPath = currentState ? DEFAULT_LOGO : DISABLED_LOGO;
  document.querySelector('header img').src = logoPath;
}

const setConfigsAccordingToExtensionState = () => {
  const configsDiv = document.querySelector('.configs');
  configsDiv.classList.toggle('active', currentState);
}

const isOnWhatsappWeb = () => currentTab.url.startsWith(WHATSAPP_WEB_URL);

const getCurrentTab = async () => {
  const currentTabFilters = { active: true, currentWindow: true };
  [currentTab] = await chrome.tabs.query(currentTabFilters);
  return currentTab;
}

const addExtensionToggleListener = () => {
  const currentStateToggle = document.querySelector('#currentState input');
  currentStateToggle.addEventListener('change', async () => {
    currentState = !currentState;
    storage.set('currentState', currentState);

    if (!isOnWhatsappWeb()) return;

    const toggleMethod = currentState 
      ? addAllActiveConfigScripts
      : removeAllActiveConfigScripts;

    toggleMethod(currentTab);
    setlogoAccordingToExtensionState();
    setConfigsAccordingToExtensionState();
  });
};

const startExtension = async () => {
  currentTab = await getCurrentTab();

  CONFIG_KEYS.forEach(async (key) => {
    const value = await storage.get(key);
    const relatedInput = document.querySelector(`#${key} input`);
    
    relatedInput.checked = value;
    relatedInput.addEventListener('change', () => {
      storage.set(key, relatedInput.checked);

      const toggleMethod = relatedInput.checked ? addScript : removeScript;
      toggleMethod(key, currentTab);
    });
  });

  if (currentState && isOnWhatsappWeb()) addAllActiveConfigScripts(tab);

  setlogoAccordingToExtensionState();
  setConfigsAccordingToExtensionState();
  addExtensionToggleListener();
};

startExtension();
