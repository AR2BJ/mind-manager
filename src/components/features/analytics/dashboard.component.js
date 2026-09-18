import {
  BOOKMARK_CATEGORIES,
  CHEATSHEET_CATEGORIES,
  NOTE_CATEGORIES,
  SNIPPET_CATEGORIES,
} from "@/utils/constants/options-value.constants";

import { StateManager } from "@/models/state.model.js";

export const DashboardComponent = {
  render(notes = [], snippets = [], bookmarks = [], cheatsheets = []) {
    const safeNotes = Array.isArray(notes) ? notes : [];
    const safeSnippets = Array.isArray(snippets) ? snippets : [];
    const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
    const safeCheatsheets = Array.isArray(cheatsheets) ? cheatsheets : [];

    const totalEntities =
      safeNotes.length +
      safeSnippets.length +
      safeBookmarks.length +
      safeCheatsheets.length;

    const pinnedCount = safeNotes.filter((item) => item?.pinned).length;

    const FavoriteCount = safeSnippets.filter(
      (item) => item?.isFavorite,
    ).length;

    return `
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full col-span-full"
      >
        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-yellow-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-article-filled absolute -right-4 -bottom-6 text-[12rem] text-yellow-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Total Notes</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              >Pinned: ${pinnedCount}</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeNotes.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Registered notes & thoughts
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Global Share:</span>
            <span class="font-bold text-color"
              >${totalEntities > 0 ? Math.round((safeNotes.length / totalEntities) * 100) : 0}%</span
            >
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-code absolute -right-4 -bottom-6 text-[12rem] text-purple-500 opacity-[0.04] dark:opacity-[0.06] rotate-20 pointer-events-none group-hover:scale-110 group-hover:rotate-10 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Code Snippets</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20"
              >Favorite: ${FavoriteCount}</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeSnippets.length}
            </div>
            <div
              class="w-1/4 h-1.5 bg-surface rounded-full overflow-hidden mt-2"
            >
              <div
                class="h-full bg-purple-500 transition-all duration-500 rounded-full"
                style="width: ${totalEntities > 0 ? (safeSnippets.length / totalEntities) * 100 : 0}%"
              ></div>
            </div>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Library Density:</span>
            <span class="font-bold text-purple-500"
              >${safeSnippets.length > 0 ? "Active" : "Empty"}</span
            >
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-bookmark-filled absolute -right-4 -bottom-6 text-[12rem] text-emerald-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Bookmarks</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeBookmarks.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Curated web resources
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Sync Status:</span>
            <span class="font-bold text-emerald-500">Synced Local</span>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-sky-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-stack-2-filled absolute -right-6 -bottom-8 text-[14rem] text-sky-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >CheatSheets</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeCheatsheets.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Reference documentation
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Blueprint Index:</span>
            <span class="font-bold text-sky-500">Ready</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full col-span-2 sm:col-span-full mt-4"
      >
        <div
          class="lg:col-span-2 bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div>
              <h4 class="text-lg font-bold text-color flex items-center gap-2">
                <i class="ti ti-chart-dots-3 text-brand text-xl"></i>
                Execution Velocity & Heatmap
              </h4>
              <p class="text-xs text-secondary mt-1">
                Volume of activity logs and entry interactions across timeline.
              </p>
            </div>

            <div class="relative flex items-center justify-end">
              <button
                id="heatmap-mobile-menu-toggle"
                class="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-surface text-secondary hover:text-color transition shadow-sm cursor-pointer"
                aria-label="Open view menu"
              >
                <i class="ti ti-ellipsis-vertical text-lg"></i>
              </button>

              <div
                id="heatmap-mobile-menu"
                class="hidden absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border bg-surface-2 shadow-lg z-20 overflow-hidden"
              >
                <button
                  data-view="weekly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Weekly
                </button>
                <button
                  data-view="monthly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Monthly
                </button>
                <button
                  data-view="yearly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Yearly
                </button>
              </div>

              <div
                id="chart-view-switcher"
                class="hidden sm:flex relative overflow-hidden rounded-xl border border-border/80 bg-surface p-1 isolation-auto"
              >
                <div
                  id="heatmap-tab-indicator"
                  class="absolute top-1 left-1 h-[calc(100%-8px)] w-24 rounded-lg bg-brand/80 transition-all duration-300 ease-out z-0 shadow-sm"
                ></div>

                <button
                  data-view="weekly"
                  id="view-btn-weekly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Weekly
                </button>
                <button
                  data-view="monthly"
                  id="view-btn-monthly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Monthly
                </button>
                <button
                  data-view="yearly"
                  id="view-btn-yearly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>

          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-heatmap-chart"
              class="w-full"
            ></div>
          </div>
        </div>

        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-chart-bar text-brand text-xl rotate-90"></i>
              Weekday Distribution
            </h4>
            <p class="text-xs text-secondary mt-1">
              Density of items created or updated per weekday.
            </p>
          </div>

          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-weekday-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 gap-6 w-full col-span-full mt-6"
      >
        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-compass text-brand text-xl"></i>
              Module Distribution
            </h4>
            <p class="text-xs text-secondary mt-1">
              Proportion of entries across Notes, Snippets, Bookmarks, and CheatSheets.
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-category-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full col-span-full mt-6"
      >
        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-tags text-brand text-xl"></i>
              Top Tags
            </h4>
            <p class="text-xs text-secondary mt-1">
              Most frequently used tags across your data modules.
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-tas-chart"
              class="w-full"
            ></div>
          </div>
        </div>

        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i
                class="ti ti-adjustments-horizontal text-brand text-xl"
              ></i>
              Entity Metrics
            </h4>
            <p class="text-xs text-secondary mt-1">
              Distribution of total, pinned, and archived records.
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-status-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="w-full col-span-full mt-6 bg-surface-2 border border-border/75 rounded-2xl p-6 shadow-sm"
      >
        <div
          class="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between gap-4 pb-4 border-b border-border/40"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-stack-3 text-brand text-xl"></i>
              Entities Detailed Breakdown
            </h4>
            <p class="text-xs text-secondary mt-0.5">
              Switch tabs to review underlying system modules.
            </p>
          </div>

          <div
            id="entity-tab-switcher"
            class="relative flex items-center p-1 bg-surface rounded-xl border border-border/80 shadow-inner"
          >
            <div
              id="entity-tab-indicator"
              class="absolute h-[calc(100%-8px)] top-1 left-1 bg-brand rounded-lg transition-all duration-300 ease-out shadow-xs pointer-events-none"
            ></div>

            <button
              data-entity-tab="notes"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-white transition cursor-pointer"
            >
              Notes (${safeNotes.length})
            </button>
            <button
              data-entity-tab="snippets"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-secondary transition cursor-pointer"
            >
              Snippets (${safeSnippets.length})
            </button>
            <button
              data-entity-tab="bookmarks"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-secondary transition cursor-pointer"
            >
              Bookmarks (${safeBookmarks.length})
            </button>
            <button
              data-entity-tab="cheatsheets"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-secondary transition cursor-pointer"
            >
              CheatSheets (${safeCheatsheets.length})
            </button>
          </div>
        </div>

        <div class="mt-6">
          <div
            id="tab-panel-notes"
            class="entity-panel space-y-3"
          >
            ${this.renderGenericList(safeNotes, "notes")}
          </div>
          <div
            id="tab-panel-snippets"
            class="entity-panel hidden space-y-3"
          >
            ${this.renderGenericList(safeSnippets, "snippets")}
          </div>
          <div
            id="tab-panel-bookmarks"
            class="entity-panel hidden space-y-3"
          >
            ${this.renderGenericList(safeBookmarks, "bookmarks")}
          </div>
          <div
            id="tab-panel-cheatsheets"
            class="entity-panel hidden space-y-3"
          >
            ${this.renderGenericList(safeCheatsheets, "cheatsheets")}
          </div>
        </div>
      </div>
    `;
  },

  initTabSwitcher() {
    const switcher = document.getElementById("entity-tab-switcher");
    if (!switcher) return;

    const buttons = switcher.querySelectorAll(".entity-tab-btn");
    const indicator = document.getElementById("entity-tab-indicator");

    const updateTabState = (activeBtn) => {
      if (!activeBtn) return;

      if (indicator) {
        indicator.style.left = `${activeBtn.offsetLeft}px`;
        indicator.style.width = `${activeBtn.offsetWidth}px`;
      }

      buttons.forEach((btn) => {
        if (btn === activeBtn) {
          btn.classList.remove("text-secondary");
          btn.classList.add("text-white");
        } else {
          btn.classList.remove("text-white");
          btn.classList.add("text-secondary");
        }
      });

      const targetTab = activeBtn.dataset.entityTab;
      document.querySelectorAll(".entity-panel").forEach((panel) => {
        if (panel.id === `tab-panel-${targetTab}`) {
          panel.classList.remove("hidden");
        } else {
          panel.classList.add("hidden");
        }
      });
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => updateTabState(btn));
    });

    const initialActiveBtn = switcher.querySelector(
      '.entity-tab-btn[data-entity-tab="notes"]',
    );
    if (initialActiveBtn) {
      updateTabState(initialActiveBtn);
    }
  },

  _getCategoryBadgeHtml(category, itemType) {
    const badges = {
      notes: NOTE_CATEGORIES,
      snippets: SNIPPET_CATEGORIES,
      bookmarks: BOOKMARK_CATEGORIES,
      cheatsheets: CHEATSHEET_CATEGORIES,
    };

    const target = badges[itemType] || badges.notes;

    const matched = target.find((cat) => String(cat.id) === String(category));

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

  _getModuleBadgeHtml(itemType) {
    const badges = {
      notes: {
        color: "border-sky-500/30 bg-sky-500/10 text-sky-400",
        icon: "ti-note",
        label: "Note",
      },
      snippets: {
        color: "border-purple-500/30 bg-purple-500/10 text-purple-400",
        icon: "ti-code",
        label: "Snippet",
      },
      bookmarks: {
        color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        icon: "ti-bookmark",
        label: "Bookmark",
      },
      cheatsheets: {
        color: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        icon: "ti-stack-2",
        label: "CheatSheet",
      },
    };

    const target = badges[itemType] || badges.notes;

    return `
      <span class="inline-flex items-center gap-1 rounded-md border ${target.color} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
        <i class="ti ${target.icon} text-[11px]"></i>
        <span>${target.label}</span>
      </span>
    `;
  },

  renderGenericList(items = [], itemType = "notes") {
    if (!Array.isArray(items) || items.length === 0) {
      return `<div
        class="p-12 text-center text-secondary text-sm border border-dashed border-border/80 rounded-2xl bg-surface/30"
      >
        No ${itemType} records registered in current state repository.
      </div>`;
    }

    return items
      .map((item) => {
        const isPinned = item?.pinned;
        const isFavorite = item?.isFavorite;
        const typeBadge = this._getModuleBadgeHtml(itemType);
        const categoryBadge = this._getCategoryBadgeHtml(
          item?.category,
          itemType,
        );

        const statusBadge = isPinned
          ? `<span class="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
               <i class="ti ti-pinned-filled text-[11px]"></i> Pinned
             </span>`
          : isFavorite
            ? `<span class="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                 <i class="ti ti-star-filled text-[10px]"></i> Favorite
               </span>`
            : "";

        const tagsHtml =
          Array.isArray(item?.tags) && item.tags.length > 0
            ? item.tags
                .map(
                  (tag) => `
                  <span class="inline-flex items-center gap-1 rounded-md bg-surface-3/50 px-2 py-0.5 text-[10px] text-secondary/80 border border-border/30">
                    <i class="ti ti-tags text-[10px] opacity-60"></i>
                    <span>${tag}</span>
                  </span>
                `,
                )
                .join("")
            : "";

        return `
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-border/50 hover:bg-surface transition group shadow-2xs"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                ${typeBadge}
                ${categoryBadge}
                ${statusBadge}
                ${tagsHtml}
              </div>
              <h5
                class="text-sm font-bold text-color group-hover:text-brand transition-colors truncate"
              >
                ${item?.title || item?.name || "Untitled"}
              </h5>
              <p
                class="text-xs text-secondary/90 line-clamp-1 mt-0.5 font-normal"
              >
                ${item?.description || item?.content || item?.url || "No additional description provided."}
              </p>
            </div>

            <div class="text-left shrink-0 text-[8px] xs:text-[9px] sm:text-xs text-secondary font-medium">
              <span
                class="bg-surface px-2.5 py-1 rounded-lg border border-border/40 flex font-sans"
                >ID: ${item?.id || "N/A"}</span
              >
            </div>
          </div>
        `;
      })
      .join("");
  },
};
