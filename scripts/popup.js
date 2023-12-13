import storage from './storage.js';
import { addAllActiveConfigScripts, removeAllActiveConfigScripts } from './script-manipulation.js';

// Constants
const WHATSAPP_WEB_URL = 'https://web.whatsapp.com/'
const DEFAULT_LOGO = 'images/icon/icon-48.png';
const DISABLED_LOGO = 'images/icon/icon-48-disabled.png';

let mainToggle = null;
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
  mainToggle.addEventListener('change', async () => {
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
  currentState = await storage.get('currentState');

  mainToggle = document.querySelector('#main-toggle input');
  mainToggle.checked = currentState;

  if (currentState && isOnWhatsappWeb()) addAllActiveConfigScripts(tab);

  setlogoAccordingToExtensionState();
  setConfigsAccordingToExtensionState();
  addExtensionToggleListener();
};

startExtension();
