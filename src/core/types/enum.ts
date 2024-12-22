export enum EAiProvider {
  ANTHROPIC = "anthropic",
  GREPTILE = "greptile",
  GEMINI = "gemini",
  OPENAI = "openai",
  OLLAMA = "ollama",
  LOCAL = "local",
  EMBEDDING = "embedding",
}

export enum EChatHistoryTime {
  TODAY = "today",
  YESTERDAY = "yesterday",
  PAST_7_DAYS = "week",
  PAST_30_DAYS = "month",
}

export enum EXTENSION_KEY {
  CHAT = "chat",
  CODE = "code",
  CONTEXT_SEARCH = "context_search",
  CHAT_WITH_PDF = "chat_with_pdf",
  IMPORTANT_CHAT = "important_chat",
  EXTENSION = "extension",
  SETTINGS = "settings",
}

export enum EGlobalEvent {
  // --- a
  ACTIVE_TAB = "active_tab",
  ARCHIVED_CHATS = "archive_active_chat",

  // --- b
  BOOKMARKED_CHATS = "bookmarked_chat",

  // --- c
  CHAT = "chat",
  CHAT_HISTORY = "chat_history",
  CHAT_WITH_PDF = "chat_with_pdf",
  CODE = "code",
  CLOSE_ACTIVE_TAB = "close_active_tab",

  // --- d

  // --- e

  // --- f

  // --- g

  // --- h

  // --- i
  IMPORTANT_CHAT = "important_chat",

  // --- j

  // --- k

  // --- l
  LOCK_ACTIVE_TAB = "lock_active_tab",

  // --- m

  // --- n
  NEW_CHAT_WITH_DEFAULT_MODEL = "new_chat_with_default_model",
  NEW_CHAT_TEMPORARY = "new_chat_temporary",

  // --- o

  // --- p

  // --- q

  // --- r
  RENAME_ACTIVE_CHAT = "rename_active_chat",

  // --- s
  SEARCH = "context_search",
  SETTINGS = "settings",

  // --- t
  TOGGLE_SIDEBAR = "toggle_sidebar",

  // --- u

  // --- v

  // --- w

  // --- x

  // --- y

  // --- z
}

export enum SIDEBAR_ITEM_OPTION {
  RENAME = "rename",
  BOOKMARK = "bookmark",
  ARCHIVED = "archived",
  IMPORTANT = "important",
  DELETE = "delete",
}
