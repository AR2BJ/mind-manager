import { StateManager, state } from "@/models/state.model.js";

import { capitalize } from "@/utils/helpers";

export const MindItemComponent = {
  // --- HELPERS ---

  _getCategoryBadgeHtml(category) {
    const categories = StateManager.getCategories();

    const matched = categories.find(
      (cat) => String(cat.id) === String(category),
    );

    const catData = matched || {
      name: category || "General",
      icon: "ti ti-folder-filled text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = catData.icon;

    return `
      <span
        class="inline-flex items-center gap-1 rounded-md border ${catData.class} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      >
        <i class="${iconClass} text-xs pb-0.5"></i>
        <span>${catData.name}</span>
      </span>
    `;
  },

  _renderTagsHtml(tagIds) {
    const allTags = StateManager.getTags() || [];

    if (!Array.isArray(tagIds) || tagIds.length === 0) return "";

    const matchedTags = allTags.filter((tag) => tagIds.includes(tag.id));
    if (matchedTags.length === 0) return "";

    return `
      <div class="flex items-center gap-1.5 flex-wrap">
        ${matchedTags
          .map(
            (tag) => `
              <span
                class="inline-flex items-center gap-1 rounded-md bg-surface-3/50 px-2 py-0.5 text-[10px] text-secondary/80 border border-border/30"
              >
                <i class="ti ti-tag text-xs pb-0.5"></i>
                <span>${tag.name}</span>
              </span>
            `,
          )
          .join("")}
      </div>
    `;
  },

  _renderActionButtons(data) {
    const itemName = state.activeTab.slice(0, state.activeTab.length - 1);

    return `
      <div class="shrink-0">
        <div class="hidden md:flex items-center gap-2">
          <button
            type="button"
            data-id="${data.id}"
            class="pin-${itemName}-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-amber-500/10 border border-border flex items-center justify-center cursor-pointer transition group"
            title="${data.pinned ? `Unpin ${capitalize(itemName)}` : `Pin ${capitalize(itemName)}`}"
          >
            <i
              class="ti ${data.pinned ? "ti-pinned-filled" : "ti-pin"} text-amber-400 group-hover:text-amber-400 text-base lg:text-lg transition-all"
            ></i>
          </button>

          <button
            type="button"
            data-id="${data.id}"
            class="edit-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-blue-600/10 border border-border flex items-center justify-center cursor-pointer transition group"
            title="Edit Item"
          >
            <i
              class="ti ti-edit-circle text-blue-500/80 text-base lg:text-lg group-hover:text-blue-500"
            ></i>
          </button>

          <button
            type="button"
            data-id="${data.id}"
            class="delete-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-red-600/10 border border-border flex items-center justify-center cursor-pointer transition group"
            title="Delete Item"
          >
            <i
              class="ti ti-trash text-red-500/80  text-base lg:text-lg group-hover:text-red-500"
            ></i>
          </button>
        </div>

        <div class="flex md:hidden relative dropdown-container">
          <button
            type="button"
            data-id="${data.id}"
            class="dropdown-toggle-btn h-8 w-8 rounded-lg border border-border text-secondary hover:text-color hover:bg-surface flex items-center justify-center transition shadow-sm cursor-pointer"
          >
            <i class="ti ti-dots-vertical  text-base lg:text-lg"></i>
          </button>

          <div
            data-id="${data.id}"
            class="dropdown-menu absolute right-0 mt-1.5 w-48 rounded-xl border border-border bg-surface p-1 shadow-xl hidden z-30 flex-col gap-0.5"
          >
            <button
              type="button"
              data-id="${data.id}"
              class="pin-${itemName}-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-color hover:bg-surface-2 transition cursor-pointer"
            >
              <i
                class="ti ${
                  data.pinned ? "ti-pinned-filled" : "ti-pin"
                } text-amber-400 text-xs"
              ></i>
              <span>${data.pinned ? `Unpin ${capitalize(itemName)}` : `Pin ${capitalize(itemName)}`}</span>
            </button>

            <button
              type="button"
              data-id="${data.id}"
              class="edit-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-color hover:bg-surface-2 transition cursor-pointer"
            >
              <i class="ti ti-edit-circle text-blue-500 text-xs"></i>
              <span>Edit Item</span>
            </button>

            <div class="my-0.5 border-t border-border/40"></div>

            <button
              type="button"
              data-id="${data.id}"
              class="delete-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-red-500 hover:bg-red-500/10 transition cursor-pointer"
            >
              <i class="ti ti-trash text-xs"></i>
              <span>Delete Item</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // --- MAIN RENDER ROUTER ---
  render(item, activeTab = "notes") {
    if (!item) return "";

    if (item.content !== undefined || activeTab === "notes") {
      return this.renderNote(item);
    }
    if (item.code !== undefined || activeTab === "snippets") {
      return this.renderSnippet(item);
    }
    if (item.url !== undefined || activeTab === "bookmarks") {
      return this.renderBookmark(item);
    }
    if (item.items !== undefined || activeTab === "cheatsheets") {
      return this.renderCheatSheet(item);
    }

    return this.renderNote(item);
  },

  renderNote(note) {
    const categoryBadge = this._getCategoryBadgeHtml(note.category);
    const tagIdsHtml = this._renderTagsHtml(note.tagIds);

    return `
      <div
        data-id="${note.id}"
        class="note-item group relative flex flex-col justify-between gap-3 p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40 shadow-xs"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${categoryBadge}

              ${
                note.pinned
                  ? `<span
                      class="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                      <i class="ti ti-pinned-filled text-[11px]"></i> Pinned
                    </span>`
                  : ""
              }

              ${tagIdsHtml}
            </div>

            <h3 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${note.title || "Untitled Note"}
            </h3>

            ${
              note.content
                ? `<p
                    class="text-xs text-secondary/90 leading-relaxed wrap-break-word whitespace-pre-line mt-1"
                  >
                    ${note.content}
                  </p>`
                : ""
            }
          </div>

          ${this._renderActionButtons(note)}
        </div>

        <div
          class="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted"
        >
          <span class="flex items-center gap-1.5">
            <i class="ti ti-calendar-time text-sm pb-0.5"></i>
            ${note.createdAt || "Recently"}
          </span>
        </div>
      </div>
    `;
  },

  renderSnippet(snippet) {
    const categoryBadge = this._getCategoryBadgeHtml(snippet.category);
    const tagIdsHtml = this._renderTagsHtml(snippet.tagIds);

    return `
      <div
        data-id="${snippet.id}"
        class="snippet-item group relative flex flex-col justify-between gap-3 p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40 shadow-xs"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${categoryBadge}
              
              ${
                snippet.pinned
                  ? `<span
                      class="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                      <i class="ti ti-pinned-filled text-[11px]"></i> Pinned
                    </span>`
                  : ""
              }

              ${tagIdsHtml}
            </div>

            <h3 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${snippet.title || "Untitled Snippet"}
            </h3>

            ${
              snippet.description
                ? `<p class="text-xs text-secondary/90 leading-relaxed wrap-break-word">${snippet.description}</p>`
                : ""
            }
          </div>

          ${this._renderActionButtons(snippet)}
        </div>

        ${
          snippet.code
            ? `
              <div class="relative mt-2 rounded-lg bg-surface/90 border border-border/60 p-3 font-mono text-xs overflow-x-auto">
                <pre class="text-color/90 leading-snug"><code>${snippet.code}</code></pre>
              </div>
            `
            : ""
        }

        <div
          class="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted"
        >
          <span class="flex items-center gap-1.5">
            <i class="ti ti-calendar-time text-sm pb-0.5"></i>
            ${snippet.createdAt || "Recently"}
          </span>
        </div>
      </div>
    `;
  },

  renderBookmark(bookmark) {
    const categoryBadge = this._getCategoryBadgeHtml(bookmark.category);
    const tagIdsHtml = this._renderTagsHtml(bookmark.tagIds);

    return `
      <div
        data-id="${bookmark.id}"
        class="bookmark-item group relative flex flex-col justify-between gap-3 p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${categoryBadge}

              ${
                bookmark.pinned
                  ? `<span
                      class="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                      <i class="ti ti-pinned-filled text-[11px]"></i> Pinned
                    </span>`
                  : ""
              }

              ${tagIdsHtml}
            </div>

            <h3 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${bookmark.title || "Untitled Bookmark"}
            </h3>

            ${
              bookmark.description
                ? `<p class="text-xs text-secondary/90 leading-relaxed wrap-break-word">${bookmark.description}</p>`
                : ""
            }
            ${
              bookmark.url
                ? `
                  <a
                    href="${bookmark.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-fit inline-flex items-center gap-1 text-xs text-brand hover:border-b hover:border-brand font-medium break-all mt-1"
                  >
                    <i class="ti ti-external-link text-sm pb-0.5"></i>
                    <span>${bookmark.url}</span>
                  </a>
                `
                : ""
            }
          </div>

          ${this._renderActionButtons(bookmark)}
        </div>

        <div
          class="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted"
        >
          <span class="flex items-center gap-1.5">
            <i class="ti ti-calendar-time text-sm pb-0.5"></i>
            ${bookmark.createdAt || "Recently"}
          </span>
        </div>
      </div>
    `;
  },

  renderCheatSheet(cheatSheet) {
    const categoryBadge = this._getCategoryBadgeHtml(cheatSheet.category);
    const tagIdsHtml = this._renderTagsHtml(cheatSheet.tagIds);
    const items = Array.isArray(cheatSheet.items) ? cheatSheet.items : [];

    return `
      <div
        data-id="${cheatSheet.id}"
        class="cheatsheet-item group relative flex flex-col justify-between gap-3 p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${categoryBadge}

              ${
                cheatSheet.pinned
                  ? `<span
                      class="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                      <i class="ti ti-pinned-filled text-[11px]"></i> Pinned
                    </span>`
                  : ""
              }

              ${tagIdsHtml}
            </div>

            <h3 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${cheatSheet.title || "Untitled CheatSheet"}
            </h3>

            ${
              cheatSheet.description
                ? `<p class="text-xs text-secondary/90 leading-relaxed wrap-break-word">${cheatSheet.description}</p>`
                : ""
            }
          </div>

          ${this._renderActionButtons(cheatSheet)}
        </div>

        ${
          items.length > 0
            ? `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  ${items
                    .map(
                      (it) => `
                      <div
                        class="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface/80 border border-border/40 text-xs"
                      >
                        <span class="font-bold text-color/90 truncate"
                          >${it.key}</span
                        >
                        <span class="font-mono text-secondary truncate"
                          >${it.value}</span
                        >
                      </div>
                    `,
                    )
                    .join("")}
                </div>
              `
            : ""
        }

        <div
          class="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted"
        >
          <span class="flex items-center gap-1.5">
            <i class="ti ti-calendar-time text-sm pb-0.5"></i>
            ${cheatSheet.createdAt || "Recently"}
          </span>
        </div>
      </div>
    `;
  },
};
