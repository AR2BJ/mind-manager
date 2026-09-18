import { generateId, todayISO } from "@/utils/helpers.js";

export const MindService = {
  // ==========================================
  // 1. NOTES
  // ==========================================
  createNote(currentNotes = [], noteData = {}) {
    const rawTitle = typeof noteData === "string" ? noteData : noteData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Note title must be between 2 and 120 characters");
    }

    const newNote = {
      id: String(noteData.id || generateId()),
      title: cleanedTitle,
      content: (noteData.content || "").trim(),
      category: String(noteData.category || "general"),
      tags: Array.isArray(noteData.tags) ? noteData.tags : [],
      pinned: Boolean(noteData.pinned),
      createdAt: todayISO(),
      updatedAt: todayISO(),
    };

    return [newNote, ...currentNotes];
  },

  editNote(currentNotes = [], noteId, updatedFields = {}) {
    const note = currentNotes.find((n) => String(n.id) === String(noteId));
    if (!note) throw new Error("Note not found");

    let cleanedTitle = note.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Note title must be between 2 and 120 characters");
      }
    }

    return currentNotes.map((n) => {
      if (String(n.id) !== String(noteId)) return n;

      return {
        ...n,
        ...updatedFields,
        title: cleanedTitle,
        tags: Array.isArray(updatedFields.tags) ? updatedFields.tags : n.tags,
        updatedAt: todayISO(),
      };
    });
  },

  toggleNotePin(currentNotes = [], noteId) {
    return currentNotes.map((n) => {
      if (String(n.id) !== String(noteId)) return n;
      return {
        ...n,
        pinned: !n.pinned,
        updatedAt: todayISO(),
      };
    });
  },

  deleteNote(currentNotes = [], noteId) {
    return currentNotes.filter((n) => String(n.id) !== String(noteId));
  },

  // ==========================================
  // 2. SNIPPETS
  // ==========================================
  createSnippet(currentSnippets = [], snippetData = {}) {
    const rawTitle =
      typeof snippetData === "string" ? snippetData : snippetData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Snippet title must be between 2 and 120 characters");
    }

    const newSnippet = {
      id: String(snippetData.id || generateId()),
      title: cleanedTitle,
      description: (snippetData.description || "").trim(),
      code: (snippetData.code || "").trim(),
      category: String(snippetData.category || "javascript"),
      tags: Array.isArray(snippetData.tags) ? snippetData.tags : [],
      isFavorite: Boolean(snippetData.isFavorite),
      createdAt: todayISO(),
      updatedAt: todayISO(),
    };

    return [newSnippet, ...currentSnippets];
  },

  editSnippet(currentSnippets = [], snippetId, updatedFields = {}) {
    const snippet = currentSnippets.find(
      (s) => String(s.id) === String(snippetId),
    );
    if (!snippet) throw new Error("Snippet not found");

    let cleanedTitle = snippet.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Snippet title must be between 2 and 120 characters");
      }
    }

    return currentSnippets.map((s) => {
      if (String(s.id) !== String(snippetId)) return s;

      return {
        ...s,
        ...updatedFields,
        title: cleanedTitle,
        tags: Array.isArray(updatedFields.tags) ? updatedFields.tags : s.tags,
        updatedAt: todayISO(),
      };
    });
  },

  toggleSnippetFavorite(currentSnippets = [], snippetId) {
    return currentSnippets.map((s) => {
      if (String(s.id) !== String(snippetId)) return s;
      return {
        ...s,
        isFavorite: !s.isFavorite,
        updatedAt: todayISO(),
      };
    });
  },

  deleteSnippet(currentSnippets = [], snippetId) {
    return currentSnippets.filter((s) => String(s.id) !== String(snippetId));
  },

  // ==========================================
  // 3. BOOKMARKS
  // ==========================================
  createBookmark(currentBookmarks = [], bookmarkData = {}) {
    const rawTitle =
      typeof bookmarkData === "string" ? bookmarkData : bookmarkData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Bookmark title must be between 2 and 120 characters");
    }

    const rawUrl = (bookmarkData.url || "").trim();
    if (!rawUrl) {
      throw new Error("URL is required for bookmark");
    }

    const newBookmark = {
      id: String(bookmarkData.id || generateId()),
      title: cleanedTitle,
      url: rawUrl,
      description: (bookmarkData.description || "").trim(),
      category: String(bookmarkData.category || "uncategorized"),
      tags: Array.isArray(bookmarkData.tags) ? bookmarkData.tags : [],
      favicon: (bookmarkData.favicon || "").trim(),
      createdAt: todayISO(),
      updatedAt: todayISO(),
    };

    return [newBookmark, ...currentBookmarks];
  },

  editBookmark(currentBookmarks = [], bookmarkId, updatedFields = {}) {
    const bookmark = currentBookmarks.find(
      (b) => String(b.id) === String(bookmarkId),
    );
    if (!bookmark) throw new Error("Bookmark not found");

    let cleanedTitle = bookmark.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Bookmark title must be between 2 and 120 characters");
      }
    }

    return currentBookmarks.map((b) => {
      if (String(b.id) !== String(bookmarkId)) return b;

      return {
        ...b,
        ...updatedFields,
        title: cleanedTitle,
        tags: Array.isArray(updatedFields.tags) ? updatedFields.tags : b.tags,
        updatedAt: todayISO(),
      };
    });
  },

  deleteBookmark(currentBookmarks = [], bookmarkId) {
    return currentBookmarks.filter((b) => String(b.id) !== String(bookmarkId));
  },

  // ==========================================
  // 4. CHEATSHEETS
  // ==========================================
  createCheatSheet(currentCheatSheets = [], sheetData = {}) {
    const rawTitle =
      typeof sheetData === "string" ? sheetData : sheetData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("CheatSheet title must be between 2 and 120 characters");
    }

    const newSheet = {
      id: String(sheetData.id || generateId()),
      title: cleanedTitle,
      description: (sheetData.description || "").trim(),
      category: String(sheetData.category || "general"),
      items: Array.isArray(sheetData.items)
        ? sheetData.items.map((item) => ({
            id: String(item.id || generateId()),
            key: (item.key || "").trim(),
            value: (item.value || "").trim(),
          }))
        : [],
      tags: Array.isArray(sheetData.tags) ? sheetData.tags : [],
      createdAt: todayISO(),
      updatedAt: todayISO(),
    };

    return [newSheet, ...currentCheatSheets];
  },

  editCheatSheet(currentCheatSheets = [], sheetId, updatedFields = {}) {
    const sheet = currentCheatSheets.find(
      (s) => String(s.id) === String(sheetId),
    );
    if (!sheet) throw new Error("CheatSheet not found");

    let cleanedTitle = sheet.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error(
          "CheatSheet title must be between 2 and 120 characters",
        );
      }
    }

    return currentCheatSheets.map((s) => {
      if (String(s.id) !== String(sheetId)) return s;

      return {
        ...s,
        ...updatedFields,
        title: cleanedTitle,
        items: Array.isArray(updatedFields.items)
          ? updatedFields.items.map((item) => ({
              id: String(item.id || generateId()),
              key: (item.key || "").trim(),
              value: (item.value || "").trim(),
            }))
          : s.items,
        tags: Array.isArray(updatedFields.tags) ? updatedFields.tags : s.tags,
        updatedAt: todayISO(),
      };
    });
  },

  deleteCheatSheet(currentCheatSheets = [], sheetId) {
    return currentCheatSheets.filter((s) => String(s.id) !== String(sheetId));
  },
};
