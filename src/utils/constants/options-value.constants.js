export const NOTE_CATEGORIES = [
  {
    id: "general",
    name: "General",
    icon: "ti ti-folder text-yellow-400",
    class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    id: "ideas",
    name: "Ideas & Brainstorm",
    icon: "ti ti-bulb text-emerald-400",
    class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "personal",
    name: "Personal",
    icon: "ti ti-user text-lime-400",
    class: "bg-lime-500/10 text-lime-400 border-lime-500/20",
  },
  {
    id: "work",
    name: "Work & Career",
    icon: "ti ti-briefcase text-cyan-400",
    class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    id: "learning",
    name: "Learning & Research",
    icon: "ti ti-school text-violet-400",
    class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
];

export const BOOKMARK_CATEGORIES = [
  {
    id: "uncategorized",
    name: "Uncategorized",
    icon: "ti ti-folder-open text-yellow-400",
    class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    id: "development",
    name: "Development & Docs",
    icon: "ti ti-code text-cyan-400",
    class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    id: "tools",
    name: "Tools & Utilities",
    icon: "ti ti-tool text-violet-400",
    class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  {
    id: "design",
    name: "Design & Inspiration",
    icon: "ti ti-palette text-pink-400",
    class: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  {
    id: "articles",
    name: "Articles & Reading",
    icon: "ti ti-news text-emerald-400",
    class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
];

export const CHEATSHEET_CATEGORIES = [
  {
    id: "general",
    name: "General Reference",
    icon: "ti ti-list text-yellow-400",
    class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    id: "cli",
    name: "Terminal & Commands",
    icon: "ti ti-terminal text-emerald-400",
    class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "frameworks",
    name: "Frameworks & Libraries",
    icon: "ti ti-packages text-violet-400",
    class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  {
    id: "shortcuts",
    name: "Shortcuts & Hotkeys",
    icon: "ti ti-keyboard text-cyan-400",
    class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
];

export const SNIPPET_CATEGORIES = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: "ti ti-brand-javascript text-yellow-400",
    class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "ti ti-brand-typescript text-blue-400",
    class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "html",
    name: "HTML",
    icon: "ti ti-brand-html5 text-orange-500",
    class: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  {
    id: "css",
    name: "CSS",
    icon: "ti ti-brand-css3 text-blue-500",
    class: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    id: "python",
    name: "Python",
    icon: "ti ti-brand-python text-yellow-500",
    class: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  {
    id: "bash",
    name: "Bash / Shell",
    icon: "ti ti-terminal text-emerald-400",
    class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "json",
    name: "JSON",
    icon: "ti ti-json text-indigo-400",
    class: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  {
    id: "sql",
    name: "SQL",
    icon: "ti ti-database text-rose-400",
    class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
];

export const FILTER_OPTIONS_BY_TAB = {
  notes: [
    {
      value: "all",
      title: "All Notes",
      icon: "ti ti-stack-2 text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      value: "pinned",
      title: "Pinned Only",
      icon: "ti ti-pinned text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "unpinned",
      title: "Unpinned Only",
      icon: "ti ti-note text-slate-400",
      class: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
  ],
  snippets: [
    {
      value: "all",
      title: "All Snippets",
      icon: "ti ti-stack-2 text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      value: "favorites",
      title: "Favorites Only",
      icon: "ti ti-star text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
  ],
  bookmarks: [
    {
      value: "all",
      title: "All Bookmarks",
      icon: "ti ti-stack-2 text-violet-400",
      class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
  ],
  cheatsheets: [
    {
      value: "all",
      title: "All CheatSheets",
      icon: "ti ti-stack-2 text-pink-400",
      class: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
  ],
};

export const SORT_OPTIONS_BY_TAB = {
  notes: [
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "ti ti-clock text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "created_desc",
      title: "Created (Newest First)",
      icon: "ti ti-calendar-down text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      value: "created_asc",
      title: "Created (Oldest First)",
      icon: "ti ti-calendar-up text-violet-400",
      class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "ti ti-sort-ascending text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ],
  snippets: [
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "ti ti-clock text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "created_desc",
      title: "Created (Newest First)",
      icon: "ti ti-calendar text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "ti ti-sort-ascending text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ],
  bookmarks: [
    {
      value: "created_desc",
      title: "Created (Newest First)",
      icon: "ti ti-calendar text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "ti ti-clock text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "ti ti-sort-ascending text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ],
  cheatsheets: [
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "ti ti-sort-ascending text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "ti ti-clock text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "created_desc",
      title: "Created (Newest First)",
      icon: "ti ti-calendar text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
  ],
};
