import { EGlobalEvent } from "../types/enum";

export interface IGlobalEventObject {
  eventId: EGlobalEvent;
  keyPressed: string;
}

export interface IGlobalEvent {
  active_tab: IGlobalEventObject;
  archive_active_chat: IGlobalEventObject;

  bookmark_active_chat: IGlobalEventObject;

  chat: IGlobalEventObject;
  chat_with_pdf: IGlobalEventObject;
  code: IGlobalEventObject;

  lock_active_tab: IGlobalEventObject;

  new_chat_with_default_model: IGlobalEventObject;
  new_chat_temporary: IGlobalEventObject;

  rename_active_chat: IGlobalEventObject;

  search: IGlobalEventObject;
  settings: IGlobalEventObject;

  toggle_sidebar: IGlobalEventObject;
}

export const globalEvents: IGlobalEvent = {
  // --- [ ctrl + <key> ] --- //
  active_tab: {
    eventId: EGlobalEvent.ACTIVE_TAB,
    keyPressed: "ctrl+t",
  },

  archive_active_chat: {
    eventId: EGlobalEvent.ARCHIVED_CHATS,
    keyPressed: "ctrl+a",
  },

  bookmark_active_chat: {
    eventId: EGlobalEvent.BOOKMARKED_CHATS,
    keyPressed: "ctrl+b",
  },

  lock_active_tab: {
    eventId: EGlobalEvent.LOCK_ACTIVE_TAB,
    keyPressed: "ctrl+l",
  },

  new_chat_with_default_model: {
    eventId: EGlobalEvent.NEW_CHAT_WITH_DEFAULT_MODEL,
    keyPressed: "ctrl+t",
  },

  rename_active_chat: {
    eventId: EGlobalEvent.RENAME_ACTIVE_CHAT,
    keyPressed: "ctrl+space",
  },

  settings: {
    eventId: EGlobalEvent.SETTINGS,
    keyPressed: "ctrl+,",
  },

  toggle_sidebar: {
    eventId: EGlobalEvent.IMPORTANT_CHAT,
    keyPressed: "ctrl+e",
  },

  // --- [ ctrl + shift + <key>] --- //
  chat: {
    eventId: EGlobalEvent.CHAT,
    keyPressed: "ctrl+shift+c",
  },

  chat_with_pdf: {
    eventId: EGlobalEvent.CHAT_WITH_PDF,
    keyPressed: "ctrl+shift+p",
  },

  code: {
    eventId: EGlobalEvent.CODE,
    keyPressed: "ctrl+shift+e",
  },

  new_chat_temporary: {
    eventId: EGlobalEvent.NEW_CHAT_TEMPORARY,
    keyPressed: "ctrl+shift+n",
  },

  search: {
    eventId: EGlobalEvent.SEARCH,
    keyPressed: "ctrl+shift+f",
  },
};
