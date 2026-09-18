export const EditModalsComponent = {
  renderEmptyState(message, iconClass = "ti ti-list-check") {
    return `
      <div class="w-full h-full min-h-45 overflow-y-auto scrollbar-thumb-surface-2 scrollbar-thin bg-surface rounded-2xl border border-dashed border-border/70 p-4 text-center flex flex-col justify-center items-center">
        <div class="h-full flex flex-col justify-center items-center">
          <div class="text-3xl text-brand/80">
            <i class="${iconClass}"></i>
          </div>
          <p class="mt-3 text-secondary max-w-sm mx-auto text-xs lg:text-sm">
            ${message}
          </p>
        </div>
      </div>
    `;
  },

  render() {
    return `
      <div
        id="edit-modal"
        class="fixed inset-0 z-50 hidden items-end lg:items-center justify-center p-0 lg:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="bg-surface xs:rounded-t-3xl lg:rounded-2xl p-4 lg:p-6 max-w-3xl w-full h-dvh xs:h-[96.5dvh] sm:h-[95dvh] lg:h-auto lg:max-h-[90vh] shadow-2xl flex flex-col border border-border overflow-hidden"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-4 shrink-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl bg-brand/10 text-brand/80 flex items-center justify-center text-lg lg:text-xl shrink-0"
              >
                <i class="ti ti-edit-circle"></i>
              </div>
              <div class="min-w-0">
                <h3 class="text-sm lg:text-base font-bold text-color truncate">
                  Edit Mind Item
                </h3>
                <p
                  class="text-[11px] w-40 xs:w-auto lg:text-xs text-secondary truncate"
                >
                  Update item details, categories, content, and metadata.
                </p>
              </div>
            </div>

            <button
              id="cancel-edit-modal"
              type="button"
              class="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-color flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <i class="ti ti-x text-xl"></i>
            </button>
          </div>

          <div
            id="edit-accordion-group"
            class="flex-1 min-h-0 flex flex-col gap-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-2 pe-1"
          >
            <div
              class="accordion-item flex flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 self-start shrink-0 items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="ti ti-file-description text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Basic Details
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Title and primary configuration.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon ti ti-chevron-up text-secondary text-lg lg:text-xl transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content p-3.5 lg:p-4 flex flex-col gap-3.5">
                <div
                  id="edit-title-container"
                  class="mind-tab-field flex flex-col flex-1 min-w-0"
                  data-tab-fields="notes,snippets,bookmarks,cheatsheets"
                >
                  <label
                    for="edit-item-title"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                  >
                    Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-item-title"
                    type="text"
                    placeholder="Enter title..."
                    class="h-10 lg:h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                  />
                </div>

                <!-- Notes Fields -->
                <div
                  id="edit-notes-fields"
                  class="mind-tab-field flex flex-col gap-3.5"
                  data-tab-fields="notes"
                >
                  <div class="flex flex-col">
                    <label
                      for="edit-note-content"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Content</label>
                    <textarea
                      id="edit-note-content"
                      rows="4"
                      placeholder="Note content..."
                      class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div id="edit-note-category-autocomplete" class="w-full"></div>
                    <div class="flex items-center gap-2 pt-2 sm:pt-6">
                      <label class="relative inline-flex items-center cursor-pointer gap-2.5 select-none">
                        <input id="edit-note-pinned" type="checkbox" class="sr-only peer" />
                        <div class="w-10 h-5.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand"></div>
                        <span class="text-xs font-semibold text-secondary whitespace-nowrap">Pin Note</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Snippets Fields -->
                <div
                  id="edit-snippets-fields"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="snippets"
                >
                  <div class="flex flex-col">
                    <label
                      for="edit-snippet-desc"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Description</label>
                    <input
                      id="edit-snippet-desc"
                      type="text"
                      placeholder="Short description..."
                      class="h-10 lg:h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>

                  <div class="flex flex-col">
                    <label
                      for="edit-snippet-code"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Code <span class="text-red-500">*</span></label>
                    <textarea
                      id="edit-snippet-code"
                      rows="4"
                      placeholder="Paste code..."
                      class="w-full font-mono text-xs scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div id="edit-snippet-category-autocomplete" class="w-full"></div>
                    <div class="flex items-center gap-2 pt-2 sm:pt-6">
                      <label class="relative inline-flex items-center cursor-pointer gap-2.5 select-none">
                        <input id="edit-snippet-favorite" type="checkbox" class="sr-only peer" />
                        <div class="w-10 h-5.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand"></div>
                        <span class="text-xs font-semibold text-secondary whitespace-nowrap">Mark as Favorite</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Bookmarks Fields -->
                <div
                  id="edit-bookmarks-fields"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="bookmarks"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div class="flex flex-col">
                      <label
                        for="edit-bookmark-url"
                        class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                      >URL <span class="text-red-500">*</span></label>
                      <input
                        id="edit-bookmark-url"
                        type="url"
                        placeholder="https://example.com"
                        class="h-10 lg:h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                      />
                    </div>
                    <div id="edit-bookmark-category-autocomplete" class="w-full"></div>
                  </div>

                  <div class="flex flex-col">
                    <label
                      for="edit-bookmark-desc"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Description</label>
                    <textarea
                      id="edit-bookmark-desc"
                      rows="2"
                      placeholder="Description..."
                      class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <!-- CheatSheets Fields -->
                <div
                  id="edit-cheatsheets-fields"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="cheatsheets"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div class="flex flex-col">
                      <label
                        for="edit-cheatsheet-desc"
                        class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                      >Description</label>
                      <input
                        id="edit-cheatsheet-desc"
                        type="text"
                        placeholder="Description..."
                        class="h-10 lg:h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                      />
                    </div>
                    <div id="edit-cheatsheet-category-autocomplete" class="w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="grid grid-cols-2 gap-3 pt-3 border-t border-border shrink-0 w-full bg-surface mt-auto"
            >
              <button
                id="cancel-edit"
                type="button"
                class="h-10 lg:h-11 rounded-lg lg:rounded-xl bg-surface-2 hover:border-primary text-secondary hover:text-color font-medium text-xs lg:text-sm transition border border-border cursor-pointer flex items-center justify-center"
              >
                Cancel
              </button>

              <button
                id="confirm-edit"
                type="button"
                class="h-10 lg:h-11 rounded-lg lg:rounded-xl bg-brand/80 hover:bg-brand text-white font-medium text-xs lg:text-sm transition shadow-md shadow-brand/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <i class="ti ti-check text-base lg:text-lg"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
