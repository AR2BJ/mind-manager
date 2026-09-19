import {
  setPendingDeleteId,
  setPendingEditId,
} from "./mind-form.controller.js";

import { MindService } from "@/services/mind.service.js";
import { NotificationService } from "@/services/notification.service.js";
import { StateManager } from "@/models/state.model.js";

export const MindActionController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindDynamicEvents();
  },

  handleToggleNotePin(noteId) {
    const notes = StateManager.getNotes() || [];
    const targetNote = notes.find((n) => String(n.id) === String(noteId));
    if (!targetNote) return;

    const updatedNotes = MindService.toggleNotePin(notes, noteId);
    StateManager.save({ notes: updatedNotes });

    if (
      this.mainController &&
      typeof this.mainController.refreshUI === "function"
    ) {
      this.mainController.refreshUI();
    }

    NotificationService.show({
      type: "info",
      message: !targetNote.pinned ? "Note pinned" : "Note unpinned",
      icon: !targetNote.pinned ? "ti-pinned-filled" : "ti-pin",
      duration: 5000,
    });
  },

  handleToggleSnippetPin(snippetId) {
    const snippets = StateManager.getSnippets() || [];
    const targetSnippet = snippets.find(
      (s) => String(s.id) === String(snippetId),
    );
    if (!targetSnippet) return;

    const updatedSnippets = MindService.toggleSnippetPin(snippets, snippetId);
    StateManager.save({ snippets: updatedSnippets });

    if (
      this.mainController &&
      typeof this.mainController.refreshUI === "function"
    ) {
      this.mainController.refreshUI();
    }

    NotificationService.show({
      type: "info",
      message: !targetSnippet.pinned ? "Snippet pinned" : "Snippet unpinned",
      icon: !targetSnippet.pinned ? "ti-pinned-filled" : "ti-pin",
      duration: 5000,
    });
  },

  handleToggleBookmarkPin(bookmarkId) {
    const bookmarks = StateManager.getBookmarks() || [];
    const targetBookmark = bookmarks.find(
      (b) => String(b.id) === String(bookmarkId),
    );
    if (!targetBookmark) return;

    const updatedBookmarks = MindService.toggleBookmarkPin(
      bookmarks,
      bookmarkId,
    );
    StateManager.save({ bookmarks: updatedBookmarks });

    if (
      this.mainController &&
      typeof this.mainController.refreshUI === "function"
    ) {
      this.mainController.refreshUI();
    }

    NotificationService.show({
      type: "info",
      message: !targetBookmark.pinned ? "Bookmark pinned" : "Bookmark unpinned",
      icon: !targetBookmark.pinned ? "ti-pinned-filled" : "ti-pin",
      duration: 5000,
    });
  },

  handleToggleCheatSheetPin(sheetId) {
    const cheatsheets = StateManager.getCheatSheets() || [];
    const targetSheet = cheatsheets.find(
      (s) => String(s.id) === String(sheetId),
    );
    if (!targetSheet) return;

    const updatedCheatSheets = MindService.toggleCheatSheetPin(
      cheatsheets,
      sheetId,
    );
    StateManager.save({ cheatsheets: updatedCheatSheets });

    if (
      this.mainController &&
      typeof this.mainController.refreshUI === "function"
    ) {
      this.mainController.refreshUI();
    }

    NotificationService.show({
      type: "info",
      message: !targetSheet.pinned
        ? "CheatSheet pinned"
        : "CheatSheet unpinned",
      icon: !targetSheet.pinned ? "ti-pinned-filled" : "ti-pin",
      duration: 5000,
    });
  },

  handleDirectDelete(itemId) {
    const activeTab = StateManager.getActiveTab() || "notes";
    const currentState = StateManager.getState();

    if (activeTab === "notes") {
      const notes = MindService.deleteNote(currentState.notes || [], itemId);
      StateManager.save({ notes });
    } else if (activeTab === "snippets") {
      const snippets = MindService.deleteSnippet(
        currentState.snippets || [],
        itemId,
      );
      StateManager.save({ snippets });
    } else if (activeTab === "bookmarks") {
      const bookmarks = MindService.deleteBookmark(
        currentState.bookmarks || [],
        itemId,
      );
      StateManager.save({ bookmarks });
    } else if (activeTab === "cheatsheets") {
      const cheatsheets = MindService.deleteCheatSheet(
        currentState.cheatsheets || [],
        itemId,
      );
      StateManager.save({ cheatsheets });
    }

    if (
      this.mainController &&
      typeof this.mainController.refreshUI === "function"
    ) {
      this.mainController.refreshUI();
    }

    NotificationService.show({
      type: "info",
      message: "Item deleted successfully",
      icon: "ti-trash",
      duration: 5000,
    });
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("mind-list");
    if (!listContainer) return;

    listContainer.addEventListener("click", (e) => {
      const target = e.target;

      // 1. PIN NOTE
      const pinNoteBtn = target.closest(".pin-note-btn");
      if (pinNoteBtn) {
        e.stopPropagation();
        const id = pinNoteBtn.dataset.id;
        if (id) this.handleToggleNotePin(id);
        return;
      }

      // 2. PIN SNIPPET
      const pinSnippetBtn = target.closest(".pin-snippet-btn");
      if (pinSnippetBtn) {
        e.stopPropagation();
        const id = pinSnippetBtn.dataset.id;
        if (id) this.handleToggleSnippetPin(id);
        return;
      }

      // 3. PIN BOOKMARK
      const pinBookmarkBtn = target.closest(".pin-bookmark-btn");
      if (pinBookmarkBtn) {
        e.stopPropagation();
        const id = pinBookmarkBtn.dataset.id;
        if (id) this.handleToggleBookmarkPin(id);
        return;
      }

      // 4. PIN CHEATSHEET
      const pinCheatSheetBtn = target.closest(".pin-cheatsheet-btn");
      if (pinCheatSheetBtn) {
        e.stopPropagation();
        const id = pinCheatSheetBtn.dataset.id;
        if (id) this.handleToggleCheatSheetPin(id);
        return;
      }

      // 5. EDIT MODAL TRIGGER
      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        e.stopPropagation();
        const id = editBtn.dataset.id;
        if (!id) return;

        setPendingEditId(id);
        if (
          this.mainController &&
          typeof this.mainController.toggleModal === "function"
        ) {
          this.mainController.toggleModal("edit-modal", true);
        }
        return;
      }

      // 6. DELETE MODAL TRIGGER
      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        e.stopPropagation();
        const id = deleteBtn.dataset.id;
        if (!id) return;

        setPendingDeleteId(id);
        if (
          this.mainController &&
          typeof this.mainController.toggleModal === "function"
        ) {
          this.mainController.toggleModal("delete-modal", true);
        }
        return;
      }

      // 7. DIRECT DELETE ITEM HANDLER
      const directDeleteBtn = target.closest(".direct-delete-btn");
      if (directDeleteBtn) {
        e.stopPropagation();
        const id = directDeleteBtn.dataset.id;
        if (id) this.handleDirectDelete(id);
        return;
      }
    });
  },
};
