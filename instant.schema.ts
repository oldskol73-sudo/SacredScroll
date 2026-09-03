// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $streams: i.entity({
      abortReason: i.string().optional(),
      clientId: i.string().unique().indexed(),
      done: i.boolean().optional(),
      size: i.number().optional(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    bookmarks: i.entity({
      book: i.string(),
      chapter: i.number(),
      createdAt: i.number().indexed(),
      ref: i.string().indexed(),
      verse: i.number(),
    }),
    highlights: i.entity({
      book: i.string(),
      chapter: i.number(),
      color: i.string(),
      createdAt: i.number().indexed(),
      ref: i.string().indexed(),
      verse: i.number(),
    }),
    narrations: i.entity({
      bookChapter: i.string().unique().indexed(),
      name: i.string(),
    }),
    notes: i.entity({
      book: i.string(),
      chapter: i.number(),
      createdAt: i.number().indexed(),
      ref: i.string().indexed(),
      text: i.string(),
      verse: i.number(),
    }),
    planProgress: i.entity({
      key: i.string().indexed(),
      kind: i.string().indexed(),
    }),
    settings: i.entity({
      atmosphere: i.string(),
      language: i.string().optional(),
      notificationsOn: i.boolean(),
      readerFontSize: i.number(),
    }),
  },
  links: {
    $streams$files: {
      forward: {
        on: "$streams",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "$stream",
        onDelete: "cascade",
      },
    },
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    bookmarksOwner: {
      forward: {
        on: "bookmarks",
        has: "one",
        label: "owner",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "bookmarks",
      },
    },
    highlightsOwner: {
      forward: {
        on: "highlights",
        has: "one",
        label: "owner",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "highlights",
      },
    },
    narrationsAudioFile: {
      forward: {
        on: "narrations",
        has: "one",
        label: "audioFile",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "narration",
      },
    },
    narrationsOwner: {
      forward: {
        on: "narrations",
        has: "one",
        label: "owner",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "narrations",
      },
    },
    notesOwner: {
      forward: {
        on: "notes",
        has: "one",
        label: "owner",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "notes",
      },
    },
    planProgressOwner: {
      forward: {
        on: "planProgress",
        has: "one",
        label: "owner",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "planProgress",
      },
    },
    settingsOwner: {
      forward: {
        on: "settings",
        has: "one",
        label: "owner",
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "settings",
      },
    },
  },
  rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
