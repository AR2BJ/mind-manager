import {
  BOOKMARK_CATEGORIES,
  CHEATSHEET_CATEGORIES,
  NOTE_CATEGORIES,
  SNIPPET_CATEGORIES,
} from "@/utils/constants/options-value.constants";

import { AutocompleteComponent } from "@/components/ui/autocomplete.component.js";
import { GlobalLoaderService } from "@/services/loader.service.js";
import { MindService } from "@/services/mind.service.js";
import { NotificationService } from "@/services/notification.service.js";
import { StateManager } from "@/models/state.model.js";

let pendingDeleteId = null;
let pendingEditId = null;

let createNoteCategoryAutocomplete = null;
let createSnippetCategoryAutocomplete = null;
let createBookmarkCategoryAutocomplete = null;
let createCheatSheetCategoryAutocomplete = null;

let editNoteCategoryAutocomplete = null;
let editSnippetCategoryAutocomplete = null;
let editBookmarkCategoryAutocomplete = null;
let editCheatSheetCategoryAutocomplete = null;

export function setPendingDeleteId(id) {
  pendingDeleteId = id;
}

export function setPendingEditId(id) {
  pendingEditId = id;
  if (id) {
    MindFormController.populateEditModal(id);
  }
}

export const MindFormController = {
  init(mainController) {
    this.mainController = mainController;

    this.setupCreateAutocompletes();
    this.bindFormEvents();
  },

  refreshUI() {
    this.setupCreateAutocompletes();
    this.updateAddButtonText();
    this.toggleFormTabFields();
  },

  updateAddButtonText() {
    const activeTab = StateManager.getActiveTab() || "notes";
    const btnTextSpan = document.getElementById("add-plan-btn-text");
    const toggleTitleSpan = document.getElementById("form-toggle-title");

    if (!btnTextSpan) return;

    if (activeTab === "notes") {
      btnTextSpan.textContent = "Add Note";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Note";
    } else if (activeTab === "snippets") {
      btnTextSpan.textContent = "Add Snippet";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Snippet";
    } else if (activeTab === "bookmarks") {
      btnTextSpan.textContent = "Add Bookmark";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Bookmark";
    } else if (activeTab === "cheatsheets") {
      btnTextSpan.textContent = "Add CheatSheet";
      if (toggleTitleSpan)
        toggleTitleSpan.textContent = "Create New CheatSheet";
    }
  },

  toggleFormTabFields() {
    const activeTab = StateManager.getActiveTab() || "notes";
    const tabFields = document.querySelectorAll(
      ".mind-tab-fields, .mind-tab-field",
    );

    tabFields.forEach((fieldGroup) => {
      const fieldTabsAttr = fieldGroup.getAttribute("data-tab-fields") || "";
      const allowedTabs = fieldTabsAttr.split(",").map((t) => t.trim());

      if (allowedTabs.includes(activeTab)) {
        fieldGroup.classList.replace("hidden", "flex");
      } else {
        fieldGroup.classList.replace("flex", "hidden");
      }
    });

    this.updateAddButtonText();
  },

  setupCreateAutocompletes() {
    const noteCategoryContainer = document.getElementById(
      "create-note-category-autocomplete",
    );
    if (noteCategoryContainer) {
      if (createNoteCategoryAutocomplete)
        createNoteCategoryAutocomplete.destroy();
      createNoteCategoryAutocomplete = new AutocompleteComponent(
        noteCategoryContainer,
        NOTE_CATEGORIES,
        {
          label: "Category",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select category...",
        },
      );
      createNoteCategoryAutocomplete.setValue("general");
    }

    const snippetLangContainer = document.getElementById(
      "create-snippet-category-autocomplete",
    );
    if (snippetLangContainer) {
      if (createSnippetCategoryAutocomplete)
        createSnippetCategoryAutocomplete.destroy();
      createSnippetCategoryAutocomplete = new AutocompleteComponent(
        snippetLangContainer,
        SNIPPET_CATEGORIES,
        {
          label: "Category",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select category...",
        },
      );
      createSnippetCategoryAutocomplete.setValue("javascript");
    }

    const bookmarkCatContainer = document.getElementById(
      "create-bookmark-category-autocomplete",
    );
    if (bookmarkCatContainer) {
      if (createBookmarkCategoryAutocomplete)
        createBookmarkCategoryAutocomplete.destroy();
      createBookmarkCategoryAutocomplete = new AutocompleteComponent(
        bookmarkCatContainer,
        BOOKMARK_CATEGORIES,
        {
          label: "Category",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select category...",
        },
      );
      createBookmarkCategoryAutocomplete.setValue("general");
    }

    const cheatCatContainer = document.getElementById(
      "create-cheatsheet-category-autocomplete",
    );
    if (cheatCatContainer) {
      if (createCheatSheetCategoryAutocomplete)
        createCheatSheetCategoryAutocomplete.destroy();
      createCheatSheetCategoryAutocomplete = new AutocompleteComponent(
        cheatCatContainer,
        CHEATSHEET_CATEGORIES,
        {
          label: "Category",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select category...",
        },
      );
      createCheatSheetCategoryAutocomplete.setValue("general");
    }
  },

  populateEditModal(itemId) {
    this.toggleFormTabFields();

    if (editNoteCategoryAutocomplete) editNoteCategoryAutocomplete.destroy();
    if (editSnippetCategoryAutocomplete)
      editSnippetCategoryAutocomplete.destroy();
    if (editBookmarkCategoryAutocomplete)
      editBookmarkCategoryAutocomplete.destroy();
    if (editCheatSheetCategoryAutocomplete)
      editCheatSheetCategoryAutocomplete.destroy();

    const activeTab = StateManager.getActiveTab() || "notes";
    const stateData = StateManager.getState();

    let currentItem = null;
    if (activeTab === "notes") {
      currentItem = (stateData.notes || []).find(
        (n) => String(n.id) === String(itemId),
      );
    } else if (activeTab === "snippets") {
      currentItem = (stateData.snippets || []).find(
        (s) => String(s.id) === String(itemId),
      );
    } else if (activeTab === "bookmarks") {
      currentItem = (stateData.bookmarks || []).find(
        (b) => String(b.id) === String(itemId),
      );
    } else if (activeTab === "cheatsheets") {
      currentItem = (stateData.cheatsheets || []).find(
        (c) => String(c.id) === String(itemId),
      );
    }

    if (!currentItem) return;

    const titleInput = document.getElementById("edit-item-title");
    if (titleInput) titleInput.value = currentItem.title || "";

    if (activeTab === "notes") {
      const contentInput = document.getElementById("edit-note-content");
      const pinnedCheckbox = document.getElementById("edit-note-pinned");
      if (contentInput) contentInput.value = currentItem.content || "";
      if (pinnedCheckbox) pinnedCheckbox.checked = !!currentItem.pinned;

      const editNoteCatContainer = document.getElementById(
        "edit-note-category-autocomplete",
      );
      if (editNoteCatContainer) {
        editNoteCategoryAutocomplete = new AutocompleteComponent(
          editNoteCatContainer,
          NOTE_CATEGORIES,
          {
            label: "Category",
            itemTitle: "name",
            itemValue: "id",
            placeholder: "Select category...",
          },
        );
        editNoteCategoryAutocomplete.setValue(
          currentItem.category || "general",
        );
      }
    } else if (activeTab === "snippets") {
      const codeInput = document.getElementById("edit-snippet-code");
      const descInput = document.getElementById("edit-snippet-desc");
      const favoriteCheckbox = document.getElementById("edit-snippet-favorite");

      if (codeInput) codeInput.value = currentItem.code || "";
      if (descInput) descInput.value = currentItem.description || "";
      if (favoriteCheckbox) favoriteCheckbox.checked = !!currentItem.favorite;

      const editSnippetLangContainer = document.getElementById(
        "edit-snippet-category-autocomplete",
      );
      if (editSnippetLangContainer) {
        editSnippetCategoryAutocomplete = new AutocompleteComponent(
          editSnippetLangContainer,
          SNIPPET_CATEGORIES,
          {
            label: "Category",
            itemTitle: "name",
            itemValue: "id",
            placeholder: "Select category...",
          },
        );
        editSnippetCategoryAutocomplete.setValue(
          currentItem.category || "javascript",
        );
      }
    } else if (activeTab === "bookmarks") {
      const urlInput = document.getElementById("edit-bookmark-url");
      const descInput = document.getElementById("edit-bookmark-desc");

      if (urlInput) urlInput.value = currentItem.url || "";
      if (descInput) descInput.value = currentItem.description || "";

      const editBookmarkCatContainer = document.getElementById(
        "edit-bookmark-category-autocomplete",
      );
      if (editBookmarkCatContainer) {
        editBookmarkCategoryAutocomplete = new AutocompleteComponent(
          editBookmarkCatContainer,
          BOOKMARK_CATEGORIES,
          {
            label: "Category",
            itemTitle: "name",
            itemValue: "id",
            placeholder: "Select category...",
          },
        );
        editBookmarkCategoryAutocomplete.setValue(
          currentItem.category || "general",
        );
      }
    } else if (activeTab === "cheatsheets") {
      const descInput = document.getElementById("edit-cheatsheet-desc");
      if (descInput) descInput.value = currentItem.description || "";

      const editCheatCatContainer = document.getElementById(
        "edit-cheatsheet-category-autocomplete",
      );
      if (editCheatCatContainer) {
        editCheatSheetCategoryAutocomplete = new AutocompleteComponent(
          editCheatCatContainer,
          CHEATSHEET_CATEGORIES,
          {
            label: "Category",
            itemTitle: "name",
            itemValue: "id",
            placeholder: "Select category...",
          },
        );
        editCheatSheetCategoryAutocomplete.setValue(
          currentItem.category || "general",
        );
      }
    }
  },

  bindFormEvents() {
    this.updateAddButtonText();
    this.toggleFormTabFields();

    const titleInput = document.getElementById("create-item-title");
    const addBtn = document.getElementById("add-plan-btn");

    const handleCreateItem = () => {
      const activeTab = StateManager.getActiveTab() || "notes";

      GlobalLoaderService.show(`Creating item...`);

      setTimeout(() => {
        try {
          const currentStateData = StateManager.getState();
          const title = titleInput?.value.trim();

          if (activeTab === "notes") {
            const content =
              document.getElementById("create-note-content")?.value || "";
            const pinned =
              document.getElementById("create-note-pinned")?.checked || false;
            const category = createNoteCategoryAutocomplete
              ? createNoteCategoryAutocomplete.getValue()
              : "general";

            const updatedNotes = MindService.createNote(
              currentStateData.notes || [],
              { title, content, category, pinned },
            );
            StateManager.save({ notes: updatedNotes });
          } else if (activeTab === "snippets") {
            const code =
              document.getElementById("create-snippet-code")?.value || "";
            const description =
              document.getElementById("create-snippet-desc")?.value || "";
            const favorite =
              document.getElementById("create-snippet-favorite")?.checked ||
              false;
            const category = createSnippetCategoryAutocomplete
              ? createSnippetCategoryAutocomplete.getValue()
              : "javascript";

            const updatedSnippets = MindService.createSnippet(
              currentStateData.snippets || [],
              { title, code, description, category, favorite },
            );
            StateManager.save({ snippets: updatedSnippets });
          } else if (activeTab === "bookmarks") {
            const url =
              document.getElementById("create-bookmark-url")?.value || "";
            const description =
              document.getElementById("create-bookmark-desc")?.value || "";
            const category = createBookmarkCategoryAutocomplete
              ? createBookmarkCategoryAutocomplete.getValue()
              : "general";

            const updatedBookmarks = MindService.createBookmark(
              currentStateData.bookmarks || [],
              { title, url, description, category },
            );
            StateManager.save({ bookmarks: updatedBookmarks });
          } else if (activeTab === "cheatsheets") {
            const description =
              document.getElementById("create-cheatsheet-desc")?.value || "";
            const category = createCheatSheetCategoryAutocomplete
              ? createCheatSheetCategoryAutocomplete.getValue()
              : "general";

            const updatedCheatSheets = MindService.createCheatSheet(
              currentStateData.cheatsheets || [],
              { title, description, category },
            );
            StateManager.save({ cheatsheets: updatedCheatSheets });
          }

          this.resetForms();

          if (
            this.mainController &&
            typeof this.mainController.refreshUI === "function"
          ) {
            this.mainController.refreshUI();
          }

          NotificationService.show({
            type: "success",
            message: `Item created successfully!`,
            icon: "ti-check",
            duration: 5000,
          });
        } catch (error) {
          NotificationService.show({
            type: "error",
            message: error.message || "Failed to create item",
            icon: "ti-alert-triangle",
            duration: 5000,
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    };

    addBtn?.addEventListener("click", handleCreateItem);

    const addClick = (id, cb) =>
      document.getElementById(id)?.addEventListener("click", cb);
    addClick("confirm-delete-btn", () => this.executeDelete());
    addClick("confirm-edit", () => this.executeEdit());
    addClick("cancel-edit", () => {
      if (this.mainController?.toggleModal) {
        this.mainController.toggleModal("edit-modal", false);
      }
    });
    addClick("cancel-edit-modal", () => {
      if (this.mainController?.toggleModal) {
        this.mainController.toggleModal("edit-modal", false);
      }
    });
  },

  resetForms() {
    const inputsToClear = [
      "create-item-title",
      "create-note-content",
      "create-snippet-code",
      "create-snippet-desc",
      "create-bookmark-url",
      "create-bookmark-desc",
      "create-cheatsheet-desc",
    ];
    inputsToClear.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    const checkboxesToReset = ["create-note-pinned", "create-snippet-favorite"];
    checkboxesToReset.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
  },

  executeDelete() {
    const id = pendingDeleteId;
    if (!id) return;

    const activeTab = StateManager.getActiveTab() || "notes";
    const stateData = StateManager.getState();

    GlobalLoaderService.show(`Deleting item...`);
    setTimeout(() => {
      try {
        if (activeTab === "notes") {
          const notes = MindService.deleteNote(stateData.notes || [], id);
          StateManager.save({ notes });
        } else if (activeTab === "snippets") {
          const snippets = MindService.deleteSnippet(
            stateData.snippets || [],
            id,
          );
          StateManager.save({ snippets });
        } else if (activeTab === "bookmarks") {
          const bookmarks = MindService.deleteBookmark(
            stateData.bookmarks || [],
            id,
          );
          StateManager.save({ bookmarks });
        } else if (activeTab === "cheatsheets") {
          const cheatsheets = MindService.deleteCheatSheet(
            stateData.cheatsheets || [],
            id,
          );
          StateManager.save({ cheatsheets });
        }

        if (this.mainController?.toggleModal)
          this.mainController.toggleModal("delete-modal", false);
        pendingDeleteId = null;

        if (this.mainController?.refreshUI) this.mainController.refreshUI();

        NotificationService.show({
          type: "error",
          message: `Item deleted successfully`,
          icon: "ti-trash",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },

  executeEdit() {
    if (!pendingEditId) return;

    const activeTab = StateManager.getActiveTab() || "notes";
    const titleInput = document.getElementById("edit-item-title");

    GlobalLoaderService.show("Updating record...");

    setTimeout(() => {
      try {
        const stateData = StateManager.getState();

        if (activeTab === "notes") {
          const updatedNotes = MindService.editNote(
            stateData.notes || [],
            pendingEditId,
            {
              title: titleInput?.value,
              content: document.getElementById("edit-note-content")?.value,
              pinned: document.getElementById("edit-note-pinned")?.checked,
              category: editNoteCategoryAutocomplete
                ? editNoteCategoryAutocomplete.getValue()
                : "general",
            },
          );
          StateManager.save({ notes: updatedNotes });
        } else if (activeTab === "snippets") {
          const updatedSnippets = MindService.editSnippet(
            stateData.snippets || [],
            pendingEditId,
            {
              title: titleInput?.value,
              code: document.getElementById("edit-snippet-code")?.value,
              description: document.getElementById("edit-snippet-desc")?.value,
              favorite: document.getElementById("edit-snippet-favorite")
                ?.checked,
              category: editSnippetCategoryAutocomplete
                ? editSnippetCategoryAutocomplete.getValue()
                : "javascript",
            },
          );
          StateManager.save({ snippets: updatedSnippets });
        } else if (activeTab === "bookmarks") {
          const updatedBookmarks = MindService.editBookmark(
            stateData.bookmarks || [],
            pendingEditId,
            {
              title: titleInput?.value,
              url: document.getElementById("edit-bookmark-url")?.value,
              description: document.getElementById("edit-bookmark-desc")?.value,
              category: editBookmarkCategoryAutocomplete
                ? editBookmarkCategoryAutocomplete.getValue()
                : "general",
            },
          );
          StateManager.save({ bookmarks: updatedBookmarks });
        } else if (activeTab === "cheatsheets") {
          const updatedCheatSheets = MindService.editCheatSheet(
            stateData.cheatsheets || [],
            pendingEditId,
            {
              title: titleInput?.value,
              description: document.getElementById("edit-cheatsheet-desc")
                ?.value,
              category: editCheatSheetCategoryAutocomplete
                ? editCheatSheetCategoryAutocomplete.getValue()
                : "general",
            },
          );
          StateManager.save({ cheatsheets: updatedCheatSheets });
        }

        if (this.mainController?.toggleModal) {
          this.mainController.toggleModal("edit-modal", false);
        }

        pendingEditId = null;

        if (this.mainController?.refreshUI) {
          this.mainController.refreshUI();
        }

        NotificationService.show({
          type: "success",
          message: `Record updated successfully!`,
          icon: "ti-check",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to update item",
          icon: "ti-alert-triangle",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },
};
