// SSR-safe localStorage helper
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") return null;
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key, value) => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, value); } catch {}
  },
  removeItem: (key) => {
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(key); } catch {}
  },
};

export default safeLocalStorage;

