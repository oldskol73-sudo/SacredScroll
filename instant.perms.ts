// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react-native";

const rules = {
  notes: {
    bind: ["isOwner", "auth.id != null && auth.id in data.ref('owner.id')"],
    allow: {
      view: "isOwner",
      create: "isOwner",
      delete: "isOwner",
      update: "isOwner",
    },
  },
  $files: {
    allow: {
      view: "auth.id != null && data.path.startsWith('narrations/' + auth.id + '/')",
      create:
        "auth.id != null && data.path.startsWith('narrations/' + auth.id + '/')",
      delete:
        "auth.id != null && data.path.startsWith('narrations/' + auth.id + '/')",
    },
  },
  settings: {
    bind: ["isOwner", "auth.id != null && auth.id in data.ref('owner.id')"],
    allow: {
      view: "isOwner",
      create: "isOwner",
      delete: "isOwner",
      update: "isOwner",
    },
  },
  bookmarks: {
    bind: ["isOwner", "auth.id != null && auth.id in data.ref('owner.id')"],
    allow: {
      view: "isOwner",
      create: "isOwner",
      delete: "isOwner",
      update: "isOwner",
    },
  },
  highlights: {
    bind: ["isOwner", "auth.id != null && auth.id in data.ref('owner.id')"],
    allow: {
      view: "isOwner",
      create: "isOwner",
      delete: "isOwner",
      update: "isOwner",
    },
  },
  narrations: {
    bind: ["isOwner", "auth.id != null && auth.id in data.ref('owner.id')"],
    allow: {
      view: "isOwner",
      create: "isOwner",
      delete: "isOwner",
      update: "isOwner",
    },
  },
  planProgress: {
    bind: ["isOwner", "auth.id != null && auth.id in data.ref('owner.id')"],
    allow: {
      view: "isOwner",
      create: "isOwner",
      delete: "isOwner",
      update: "isOwner",
    },
  },
} satisfies InstantRules;

export default rules;
