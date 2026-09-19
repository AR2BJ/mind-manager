import {
  BOOKMARK_CATEGORIES,
  CHEATSHEET_CATEGORIES,
  NOTE_CATEGORIES,
  SNIPPET_CATEGORIES,
} from "@/utils/constants/options-value.constants.js";
import {
  STORAGE_KEY,
  loadFromStorage,
  saveToStorage,
} from "./storage.model.js";

import { eventBus } from "@/services/event-bus.service.js";

export const state = {
  tags: [],
  notes: [],
  snippets: [],
  bookmarks: [],
  cheatsheets: [],
  activeTab: "notes", // "notes" | "snippets" | "bookmarks" | "cheatsheets"
  currentView: "mind",
  analyticsUI: {
    heatmapView: "weekly", // 'weekly' | 'monthly' | 'yearly'
  },
  notesUI: {
    selectedCategory: "all",
    filterBy: "all",
    searchQuery: "",
    sortBy: "updated_desc",
  },
  snippetsUI: {
    selectedCategory: "all",
    filterBy: "all",
    searchQuery: "",
    sortBy: "updated_desc",
  },
  bookmarksUI: {
    selectedCategory: "all",
    filterBy: "all",
    searchQuery: "",
    sortBy: "created_desc",
  },
  cheatsheetsUI: {
    selectedCategory: "all",
    filterBy: "all",
    searchQuery: "",
    sortBy: "title_asc",
  },
  lastDeletedItem: null,
};

export const StateManager = {
  _rawCache: "",

  init() {
    this.reloadFromStorage(false);
    this.setupReactiveEngine();
    return state;
  },

  reloadFromStorage(notify = true) {
    const saved = loadFromStorage();
    if (saved) {
      state.tags = saved.tags || [];
      state.notes = saved.notes || [];
      state.snippets = saved.snippets || [];
      state.bookmarks = saved.bookmarks || [];
      state.cheatsheets = saved.cheatsheets || [];
    } else {
      state.tags = [];
      state.notes = [];
      state.snippets = [];
      state.bookmarks = [];
      state.cheatsheets = [];
    }

    this._rawCache = localStorage.getItem(STORAGE_KEY) || "";

    if (notify) {
      this.dispatchStateEvents();
    }
  },

  dispatchStateEvents() {
    eventBus.emit("store:tags:changed", state.tags);
    eventBus.emit("store:notes:changed", state.notes);
    eventBus.emit("store:snippets:changed", state.snippets);
    eventBus.emit("store:bookmarks:changed", state.bookmarks);
    eventBus.emit("store:cheatsheets:changed", state.cheatsheets);
    eventBus.emit("ui:tab:changed", state.activeTab);
    eventBus.emit("store:changed", state);
  },

  setupReactiveEngine() {
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
        try {
          this.reloadFromStorage(true);
        } catch (error) {
          console.error("Error syncing cross-tab storage:", error);
        }
      }
    });
  },

  // --- GETTERS ---
  getState() {
    return state;
  },

  getActiveTab() {
    return state.activeTab;
  },

  getTags() {
    return state.tags || [];
  },

  getNotes() {
    return state.notes || [];
  },

  getSnippets() {
    return state.snippets || [];
  },

  getBookmarks() {
    return state.bookmarks || [];
  },

  getCheatSheets() {
    return state.cheatsheets || [];
  },

  getCategories() {
    const tab = state.activeTab;

    if (tab === "notes") return NOTE_CATEGORIES || [];
    if (tab === "snippets") return SNIPPET_CATEGORIES || [];
    if (tab === "bookmarks") return BOOKMARK_CATEGORIES || [];
    if (tab === "cheatsheets") return CHEATSHEET_CATEGORIES || [];
    return [];
  },

  getActiveUIState() {
    const key = `${state.activeTab}UI`;
    return state[key] || {};
  },

  getHeatmapView() {
    return state.analyticsUI?.heatmapView || "weekly";
  },

  getFilteredDataForActiveTab() {
    const tab = state.activeTab;
    const ui = this.getActiveUIState();

    let list = [];
    if (tab === "notes") list = [...state.notes];
    else if (tab === "snippets") list = [...state.snippets];
    else if (tab === "bookmarks") list = [...state.bookmarks];
    else if (tab === "cheatsheets") list = [...state.cheatsheets];

    if (!Array.isArray(list)) return [];

    // Filter by Category
    if (ui.selectedCategory && ui.selectedCategory !== "all") {
      list = list.filter(
        (item) => String(item.category) === String(ui.selectedCategory),
      );
    }

    // Filter by Custom Flags (Pinned, Favorites)
    if (ui.filterBy && ui.filterBy !== "all") {
      list = this.filterItemsByTab(list, tab, ui.filterBy);
    }

    // Search Query
    if (ui.searchQuery && ui.searchQuery.trim() !== "") {
      const query = ui.searchQuery.toLowerCase().trim();
      const globalTagsMap = new Map(
        (state.tags || []).map((t) => [t.id, t.name.toLowerCase()]),
      );

      list = list.filter((item) => {
        const titleMatch = (item.title || "").toLowerCase().includes(query);
        const descMatch = (item.description || "")
          .toLowerCase()
          .includes(query);
        const contentMatch = (item.content || "").toLowerCase().includes(query);
        const codeMatch = (item.code || "").toLowerCase().includes(query);
        const urlMatch = (item.url || "").toLowerCase().includes(query);

        const tagMatch =
          Array.isArray(item.tagIds) &&
          item.tagIds.some((tagId) => {
            const tagName = globalTagsMap.get(tagId);
            return tagName ? tagName.includes(query) : false;
          });

        return (
          titleMatch ||
          descMatch ||
          contentMatch ||
          codeMatch ||
          urlMatch ||
          tagMatch
        );
      });
    }

    return this.sortItemsByTab(list, ui.sortBy);
  },

  filterItemsByTab(items, tab, filterValue) {
    return items.filter((item) => {
      if (tab === "notes") {
        if (filterValue === "pinned") return Boolean(item.pinned);
        if (filterValue === "unpinned") return !item.pinned;
      }

      if (tab === "snippets") {
        if (filterValue === "pinned") return Boolean(item.pinned);
        if (filterValue === "unpinned") return !item.pinned;
      }

      if (tab === "bookmarks") {
        if (filterValue === "pinned") return Boolean(item.pinned);
        if (filterValue === "unpinned") return !item.pinned;
      }

      if (tab === "cheatsheets") {
        if (filterValue === "pinned") return Boolean(item.pinned);
        if (filterValue === "unpinned") return !item.pinned;
      }

      return true;
    });
  },

  sortItemsByTab(items, sortBy) {
    return [...items].sort((a, b) => {
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "", "fa");
      }

      switch (sortBy) {
        case "created_desc":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "created_asc":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "updated_desc":
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        case "updated_asc":
          return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
        default:
          return 0;
      }
    });
  },

  // --- SETTERS & UI CONTROL ---
  setView(view) {
    state.currentView = view;
    eventBus.emit("ui:view:changed", view);
    eventBus.emit("store:changed", state);
  },

  setTab(tab) {
    if (["notes", "snippets", "bookmarks", "cheatsheets"].includes(tab)) {
      state.activeTab = tab;
      eventBus.emit("ui:tab:changed", tab);
      eventBus.emit("store:changed", state);
    }
  },

  setHeatmapView(view) {
    if (!state.analyticsUI) state.analyticsUI = {};
    state.analyticsUI.heatmapView = view;
    eventBus.emit("store:changed", state);
  },

  setCategoryFilter(category) {
    const ui = this.getActiveUIState();
    ui.selectedCategory = category;
    eventBus.emit("ui:filter:category", category);
    this.notifyActiveTabChanged();
  },

  setFilterBy(filterValue) {
    const ui = this.getActiveUIState();
    ui.filterBy = filterValue;
    eventBus.emit("ui:filter:changed", filterValue);
    this.notifyActiveTabChanged();
  },

  setSortBy(sortBy) {
    const ui = this.getActiveUIState();
    ui.sortBy = sortBy;
    eventBus.emit("ui:sort:changed", sortBy);
    this.notifyActiveTabChanged();
  },

  setSearchQuery(query) {
    const ui = this.getActiveUIState();
    ui.searchQuery = query;
    eventBus.emit("ui:search:changed", query);
    this.notifyActiveTabChanged();
  },

  notifyActiveTabChanged() {
    const currentTab = state.activeTab;
    eventBus.emit(`store:${currentTab}:changed`, state[currentTab]);
    eventBus.emit("store:changed", state);
  },

  // --- PERSISTENCE ---
  save(data = {}) {
    Object.assign(state, data);

    saveToStorage({
      tags: state.tags,
      notes: state.notes,
      snippets: state.snippets,
      bookmarks: state.bookmarks,
      cheatsheets: state.cheatsheets,
    });

    this._rawCache = localStorage.getItem(STORAGE_KEY) || "";
    this.dispatchStateEvents();
  },
};
