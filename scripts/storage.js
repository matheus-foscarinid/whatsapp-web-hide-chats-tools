class Storage {
  constructor() {
    console.log('Storage constructor');
    this.chromeStorage = chrome.storage.local;
  }

  async get(key) {
    if (Array.isArray(key)) {
      return this.chromeStorage.get(key);
    }

    const result = await this.chromeStorage.get([key]);
    return result[key];
  }

  async set(key, value) {
    return this.chromeStorage.set({ [key]: value });
  }

  async remove(key) {
    return this.chromeStorage.remove(key);
  }
}

const storage = new Storage();
export default storage;