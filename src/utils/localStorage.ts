export function getSessionStorageOrDefault(key: string, defaultValue: any) {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (!stored || stored === "undefined") {
      return defaultValue;
    }
    return stored && stored !== "" ? JSON.parse(stored) : defaultValue;
  }
  return defaultValue;
}

export function setSessionStorage(key: string, value: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
export function clearSessionStorage() {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
}
