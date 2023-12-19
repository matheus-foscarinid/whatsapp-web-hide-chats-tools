import storage from './scripts/storage.js';

const DEFAULT_ICON = 'images/icon/icon-16.png';
const DISABLED_ICON = 'images/icon/icon-16-disabled.png';

// with this, we can add new configs to the extension without breaking the old ones
// and it will be automatically added to the storage when the user updates the extension
const DEFAULT_STATE = {
  currentState: false,
  blurIntensity: 10,
  pictureBlur: true,
  messageBlur: true,
  contactNameBlur: true,
  disableClicks: false,
}

const initializeExtensionState = async () => {
  const keys = Object.keys(DEFAULT_STATE);
  const storedValues = await storage.get(keys);

  keys.forEach((key) => {
    const currentValue = storedValues[key];
    currentValue === undefined && storage.set(key, DEFAULT_STATE[key]);
  });

  addExtensionStateListener();
}

const addExtensionStateListener = () => {
  chrome.storage.onChanged.addListener(setIconAccordingToExtensionState);
}

const setIconAccordingToExtensionState = async () => {
  const currentState = await storage.get('currentState')
  const iconPath = currentState ? DEFAULT_ICON : DISABLED_ICON;
  chrome.action.setIcon({ path: iconPath });
}

chrome.runtime.onInstalled.addListener(() => {
  initializeExtensionState();
})

setIconAccordingToExtensionState();