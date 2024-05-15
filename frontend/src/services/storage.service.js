const LocalStorageService = {
  setItem(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  removeItem(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

export { LocalStorageService };
