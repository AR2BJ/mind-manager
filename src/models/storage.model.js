import { generateId, todayISO } from "@/utils/helpers.js";

export const STORAGE_KEY = "mind_manager";
export const STORAGE_VERSION = 1;

/**
 * Extract clean domain name from URL string
 * @param {string} url
 * @returns {string}
 */
function extractDomain(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch (error) {
    return url;
  }
}

/**
 * Tag Entity Normalizer
 * entityType: "notes" | "snippets" | "bookmarks" | "cheatsheets"
 */
export function normalizeTag(data = {}) {
  return {
    id: String(data.id || generateId()),
    name: data.name ? String(data.name).trim() : "Untitled Tag",
    entityType: data.entityType || "notes",
  };
}

/**
 * Note Entity Normalizer
 */
export function normalizeNote(data = {}) {
  return {
    id: String(data.id || generateId()),
    title: data.title || "Untitled Note",
    content: data.content || "",
    category: data.category || "general",
    pinned: Boolean(data.pinned),
    tagIds: Array.isArray(data.tagIds)
      ? data.tagIds.map((t) => (typeof t === "object" ? t.id : String(t)))
      : [],
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

/**
 * Code Snippet Entity Normalizer
 */
export function normalizeSnippet(data = {}) {
  return {
    id: String(data.id || generateId()),
    title: data.title || "Untitled Snippet",
    description: data.description || "",
    code: data.code || "",
    category: data.category || "general",
    pinned: Boolean(data.pinned || data.isFavorite),
    tagIds: Array.isArray(data.tagIds)
      ? data.tagIds.map((t) => (typeof t === "object" ? t.id : String(t)))
      : [],
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

/**
 * Bookmark Entity Normalizer
 */
export function normalizeBookmark(data = {}) {
  const url = data.url || "";
  const domain = data.domain || extractDomain(url);

  return {
    id: String(data.id || generateId()),
    title: data.title || "Untitled Bookmark",
    url: url,
    domain: domain,
    description: data.description || "",
    category: data.category || "general",
    pinned: Boolean(data.pinned || data.isPinned),
    tagIds: Array.isArray(data.tagIds)
      ? data.tagIds.map((t) => (typeof t === "object" ? t.id : String(t)))
      : [],
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

/**
 * CheatSheet Entity Normalizer
 */
export function normalizeCheatSheet(data = {}) {
  return {
    id: String(data.id || generateId()),
    title: data.title || "Untitled CheatSheet",
    description: data.description || "",
    category: data.category || "general",
    pinned: Boolean(data.pinned),
    items: Array.isArray(data.items)
      ? data.items.map((item) => ({
          id: String(item.id || generateId()),
          key: item.key || "",
          value: item.value || "",
          description: item.description || "",
        }))
      : [],
    tagIds: Array.isArray(data.tagIds)
      ? data.tagIds.map((t) => (typeof t === "object" ? t.id : String(t)))
      : [],
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

/**
 * Save State Structure to LocalStorage
 */
export function saveToStorage(data = {}) {
  try {
    const payload = {
      version: STORAGE_VERSION,
      tags: data.tags || [],
      notes: data.notes || [],
      snippets: data.snippets || [],
      bookmarks: data.bookmarks || [],
      cheatsheets: data.cheatsheets || [],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save mind repository state:", error);
  }
}

/**
 * Load State Structure from LocalStorage
 */
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    return {
      version: STORAGE_VERSION,
      tags: (data.tags || []).map(normalizeTag),
      notes: (data.notes || []).map(normalizeNote),
      snippets: (data.snippets || []).map(normalizeSnippet),
      bookmarks: (data.bookmarks || []).map(normalizeBookmark),
      cheatsheets: (data.cheatsheets || []).map(normalizeCheatSheet),
    };
  } catch (error) {
    console.error("Failed to load mind repository state:", error);
    return null;
  }
}
