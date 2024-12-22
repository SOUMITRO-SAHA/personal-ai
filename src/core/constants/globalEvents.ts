import { APPLICATION_SHORTCUTS, IShortCut } from "@/constants";
import { EGlobalEvent } from "../types/enum";

export interface IGlobalEventObject {
  eventId: EGlobalEvent;
  keyPressed: IShortCut[];
}

export interface IGlobalEvent {
  active_tab: IGlobalEventObject;
  archive_active_chat: IGlobalEventObject;

  bookmark_active_chat: IGlobalEventObject;

  chat: IGlobalEventObject;
  chat_with_pdf: IGlobalEventObject;
  code: IGlobalEventObject;
  chat_history: IGlobalEventObject;
  close_active_tab: IGlobalEventObject;

  important_chat: IGlobalEventObject;

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
    keyPressed: APPLICATION_SHORTCUTS.ACTIVE_TAB,
  },

  archive_active_chat: {
    eventId: EGlobalEvent.ARCHIVED_CHATS,
    keyPressed: APPLICATION_SHORTCUTS.ARCHIVE_ACTIVE_CHATS,
  },

  bookmark_active_chat: {
    eventId: EGlobalEvent.BOOKMARKED_CHATS,
    keyPressed: APPLICATION_SHORTCUTS.BOOKMARK_ACTIVE_CHATS,
  },

  close_active_tab: {
    eventId: EGlobalEvent.CLOSE_ACTIVE_TAB,
    keyPressed: APPLICATION_SHORTCUTS.CLOSE_ACTIVE_TAB,
  },

  chat_history: {
    eventId: EGlobalEvent.CHAT_HISTORY,
    keyPressed: APPLICATION_SHORTCUTS.CHAT_HISTORY,
  },

  lock_active_tab: {
    eventId: EGlobalEvent.LOCK_ACTIVE_TAB,
    keyPressed: APPLICATION_SHORTCUTS.LOCK_ACTIVE_TAB,
  },

  new_chat_with_default_model: {
    eventId: EGlobalEvent.NEW_CHAT_WITH_DEFAULT_MODEL,
    keyPressed: APPLICATION_SHORTCUTS.NEW_CHAT_WITH_DEFAULT_MODEL,
  },

  settings: {
    eventId: EGlobalEvent.SETTINGS,
    keyPressed: APPLICATION_SHORTCUTS.SETTINGS,
  },

  toggle_sidebar: {
    eventId: EGlobalEvent.TOGGLE_SIDEBAR,
    keyPressed: APPLICATION_SHORTCUTS.TOGGLE_SIDEBAR,
  },

  // --- [ ctrl + shift + <key>] --- //
  chat: {
    eventId: EGlobalEvent.CHAT,
    keyPressed: APPLICATION_SHORTCUTS.CHAT,
  },

  chat_with_pdf: {
    eventId: EGlobalEvent.CHAT_WITH_PDF,
    keyPressed: APPLICATION_SHORTCUTS.CHAT_WITH_PDF,
  },

  code: {
    eventId: EGlobalEvent.CODE,
    keyPressed: APPLICATION_SHORTCUTS.CODE,
  },

  important_chat: {
    eventId: EGlobalEvent.IMPORTANT_CHAT,
    keyPressed: APPLICATION_SHORTCUTS.IMPORTANT_CHAT,
  },

  new_chat_temporary: {
    eventId: EGlobalEvent.NEW_CHAT_TEMPORARY,
    keyPressed: APPLICATION_SHORTCUTS.NEW_CHAT_TEMPORARY,
  },

  search: {
    eventId: EGlobalEvent.SEARCH,
    keyPressed: APPLICATION_SHORTCUTS.CONTEXT_SEARCH,
  },

  // --- [ alt + <key>] --- //
  rename_active_chat: {
    eventId: EGlobalEvent.RENAME_ACTIVE_CHAT,
    keyPressed: APPLICATION_SHORTCUTS.RENAME_ACTIVE_CHAT,
  },
};
