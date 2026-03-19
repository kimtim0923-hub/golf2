const KEY = 'golf_ref_history';

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 30)));
}
