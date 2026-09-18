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
      duration: 3000,
    });
  },

  handleToggleSnippetFavorite(snippetId) {
    const snippets = StateManager.getSnippets() || [];
    const targetSnippet = snippets.find(
      (s) => String(s.id) === String(snippetId),
    );
    if (!targetSnippet) return;

    const updatedSnippets = MindService.toggleSnippetFavorite(
      snippets,
      snippetId,
    );
    StateManager.save({ snippets: updatedSnippets });

    if (
      this.mainController &&
      typeof this.mainController.refreshUI === "function"
    ) {
      this.mainController.refreshUI();
    }

    NotificationService.show({
      type: "info",
      message: !targetSnippet.isFavorite
        ? `Marked "${targetSnippet.title}" as favorite`
        : `Removed "${targetSnippet.title}" from favorites`,
      icon: !targetSnippet.isFavorite ? "ti-star-filled" : "ti-star",
      duration: 3000,
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
      duration: 3000,
    });
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("mind-list");
    if (!listContainer) return;

    listContainer.addEventListener("click", (e) => {
      const target = e.target;

      // 1. PIN NOTE
      const pinBtn = target.closest(".pin-note-btn");
      if (pinBtn) {
        e.stopPropagation();
        const id = pinBtn.dataset.id;
        if (id) this.handleToggleNotePin(id);
        return;
      }

      // 2. FAVORITE SNIPPET
      const favoriteBtn = target.closest(".favorite-snippet-btn");
      if (favoriteBtn) {
        e.stopPropagation();
        const id = favoriteBtn.dataset.id;
        if (id) this.handleToggleSnippetFavorite(id);
        return;
      }

      // 3. EDIT MODAL TRIGGER
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

      // 4. DELETE MODAL TRIGGER
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

      // 5. DIRECT DELETE ITEM HANDLER
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
