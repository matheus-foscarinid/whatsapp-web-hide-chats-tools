const DEFAULT_ICON = 'images/icon/icon-16.png';
const DISABLED_ICON = 'images/icon/icon-16-disabled.png';

const setIconAccordingToExtensionState = (state) => {
  const iconPath = state ? DEFAULT_ICON : DISABLED_ICON;
  chrome.action.setIcon({ path: iconPath });
}

const addExtensionStateListener = () => {
  chrome.storage.onChanged.addListener((changes) => {
    const { currentState } = changes;
    setIconAccordingToExtensionState(currentState.newValue);
  });
}

const initializeExtensionState = async () => {
  const { currentState } = await chrome.storage.local.get(['currentState']);
  setIconAccordingToExtensionState(currentState);
  addExtensionStateListener();
}

initializeExtensionState();