const addScript = async (scriptName, tab) => {
  await chrome.scripting.insertCSS({
    files: [`styles/configs/${scriptName}.css`],
    target: { tabId: tab.id },
  });
};

const removeBlurScript = async (scriptName, tab) => {
  await chrome.scripting.removeCSS({
    files: [`styles/configs/${scriptName}.css`],
    target: { tabId: tab.id },
  });
};

const addAllActiveConfigScripts = async (tab) => {
  await addScript('chat-name-blur', tab);
  await addScript('chat-picture-blur', tab);
  await addScript('last-message-blur', tab);
}

const removeAllActiveConfigScripts = async (tab) => {
  await removeBlurScript('chat-name-blur', tab);
  await removeBlurScript('chat-picture-blur', tab);
  await removeBlurScript('last-message-blur', tab);
}