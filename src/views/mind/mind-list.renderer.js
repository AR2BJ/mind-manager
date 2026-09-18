import { MindItemComponent } from "@/components/features/mind/mind-item.component";

export function renderMindList(items, activeTab = "notes") {
  const container = document.getElementById("mind-list");
  const countBadge = document.getElementById("mind-count-badge");

  if (!container) return;

  if (countBadge) {
    const totalCount = items.length;
    const labels = {
      notes: totalCount === 1 ? "note" : "notes",
      snippets: totalCount === 1 ? "snippet" : "snippets",
      bookmarks: totalCount === 1 ? "bookmark" : "bookmarks",
      cheatsheets: totalCount === 1 ? "cheatsheet" : "cheatsheets",
    };

    const currentLabel = labels[activeTab] || "items";

    countBadge.innerHTML = `
      <p class="text-secondary font-semibold text-sm p-0.5 flex items-center gap-2">
        <span class="text-brand/80 font-extrabold">${totalCount}</span>
        <span>${currentLabel}</span>
      </p>
    `;
  }

  container.innerHTML = "";

  const emptyStateConfig = {
    notes: {
      icon: "<i class='ti ti-note text-brand/60'></i>",
      title: "No notes found",
      description:
        "Capture thoughts, ideas, and knowledge in structured notes.",
    },
    snippets: {
      icon: "<i class='ti ti-code text-brand/60'></i>",
      title: "No code snippets saved",
      description: "Save and organize reusable code snippets for easy access.",
    },
    bookmarks: {
      icon: "<i class='ti ti-bookmark text-brand/60'></i>",
      title: "No bookmarks added",
      description: "Keep track of useful links, docs, and online resources.",
    },
    cheatsheets: {
      icon: "<i class='ti ti-file-description text-brand/60'></i>",
      title: "No cheatSheets available",
      description: "Create quick reference guides and key-value shortcuts.",
    },
  };

  if (items.length === 0) {
    const currentEmpty = emptyStateConfig[activeTab] || emptyStateConfig.notes;

    container.innerHTML = `
      <div
        class="min-h-72 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-6xl mb-4 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-xl font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-sm text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>
    `;
    return;
  }

  const createCard = (itemData) => {
    const itemEl = document.createElement("div");
    itemEl.className =
      "bg-surface border border-border/70 hover:border-border/90 rounded-2xl p-5 transition duration-200 shadow-xs hover:shadow-md";
    itemEl.innerHTML = MindItemComponent.render(itemData, activeTab);
    return itemEl;
  };

  if (activeTab === "notes") {
    const pinnedNotes = items.filter((note) => note.pinned);
    const unpinnedNotes = items.filter((note) => !note.pinned);

    if (pinnedNotes.length > 0) {
      pinnedNotes.forEach((note) => {
        container.appendChild(createCard(note));
      });

      if (unpinnedNotes.length > 0) {
        const separatorWrapper = document.createElement("div");
        separatorWrapper.className = "w-full my-6 flex flex-col gap-4";

        separatorWrapper.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-border/60"></div>
            </div>
            <span class="relative bg-surface px-4 text-xs font-bold uppercase tracking-wider text-muted rounded-full border border-border/60 shadow-xs">
              Other Notes (${unpinnedNotes.length})
            </span>
          </div>
        `;

        container.appendChild(separatorWrapper);

        unpinnedNotes.forEach((note) => {
          container.appendChild(createCard(note));
        });
      }
    } else {
      unpinnedNotes.forEach((note) => {
        container.appendChild(createCard(note));
      });
    }
  } else {
    items.forEach((itemData) => {
      container.appendChild(createCard(itemData));
    });
  }
}
