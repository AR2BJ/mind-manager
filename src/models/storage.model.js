import { generateId, todayISO } from "@/utils/helpers.js";

export const STORAGE_KEY = "mind-manager";
export const STORAGE_VERSION = 1;

export function normalizeNote(data = {}) {
  return {
    id: String(data.id || generateId()),
    title: data.title || "Untitled Note",
    content: data.content || "",
    category: data.category || "general",
    tags: Array.isArray(data.tags) ? data.tags : [],
    pinned: Boolean(data.pinned),
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

export function normalizeSnippet(data = {}) {
  return {
    id: String(data.id || generateId()),
    title: data.title || "Untitled Snippet",
    description: data.description || "",
    code: data.code || "",
    category: data.category || "javascript",
    tags: Array.isArray(data.tags) ? data.tags : [],
    isFavorite: Boolean(data.isFavorite),
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

export function normalizeBookmark(data = {}) {
  return {
    id: String(data.id || generateId()),
    title: data.title || "Untitled Bookmark",
    url: data.url || "",
    description: data.description || "",
    category: data.category || "uncategorized",
    tags: Array.isArray(data.tags) ? data.tags : [],
    favicon: data.favicon || "",
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

export function normalizeCheatSheet(data = {}) {
  return {
    id: String(data.id || generateId()),
    title: data.title || "Untitled CheatSheet",
    description: data.description || "",
    category: data.category || "general",
    items: Array.isArray(data.items)
      ? data.items.map((item) => ({
          id: String(item.id || generateId()),
          key: item.key || "",
          value: item.value || "",
        }))
      : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

export function saveToStorage(data) {
  try {
    const payload = {
      version: STORAGE_VERSION,
      notes: data.notes || [],
      snippets: data.snippets || [],
      bookmarks: data.bookmarks || [],
      cheatsheets: data.cheatsheets || [],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save data structure:", error);
  }
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    return {
      version: STORAGE_VERSION,
      notes: (data.notes || []).map(normalizeNote),
      snippets: (data.snippets || []).map(normalizeSnippet),
      bookmarks: (data.bookmarks || []).map(normalizeBookmark),
      cheatsheets: (data.cheatsheets || []).map(normalizeCheatSheet),
    };
  } catch (error) {
    console.error("Failed to load data structure:", error);
    return null;
  }
}
