const STORAGE_KEY = 'trello-dnd-state';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { columns: [[], [], []] };
    }
    return JSON.parse(raw);
  } catch {
    return { columns: [[], [], []] };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
