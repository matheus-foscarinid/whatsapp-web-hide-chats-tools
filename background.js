const WHATSAPP_WEB_URL = 'https://web.whatsapp.com/'

let currentState = 'OFF';

const getCurrentStateFromStorage = async () => {
  const { currentState } = await chrome.storage.local.get(['currentState']);
  return currentState;
};

const addClickListener = async (tab) => {
  chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(WHATSAPP_WEB_URL)) {
      // Next state will always be the opposite
      const nextState =  currentState === 'OFF' ? 'ON' : 'OFF';
      currentState = nextState;

      // Save the next state
      chrome.storage.local.set({ currentState });
  
      if (nextState === 'ON') {
        // Insert the CSS file when the user turns the extension on
        await chrome.scripting.insertCSS({
          files: ['styles/chat-tools.css'],
          target: { tabId: tab.id },
        });
  
        return
      }
  
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['styles/chat-tools.css'],
        target: { tabId: tab.id },
      });
    }
  });
};

const startExtension = async () => {
  // Get the current state from storage
  currentState = await getCurrentStateFromStorage();
  // Add a click listener to the extension icon
  addClickListener();
};

startExtension();
