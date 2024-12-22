import * as React from "react";

import { useSessionManager } from "@/core/reactive/hooks/useSessionManager";
import { useKeyDown } from "@/hooks/useKeyDown";
import { globalEvents } from "@/core/constants/globalEvents";
import { EGlobalEvent } from "@/core/types/enum";
import { IShortCut } from "@/constants";
import { useLocalFirstStore } from "@/store";

interface IPlatformContextProps {
  // ----- Sessions Managers
  sessionManager: ReturnType<typeof useSessionManager>;
}

const PlatformContext = React.createContext<IPlatformContextProps | undefined>(
  undefined
);

export const PlatformProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // ----- Store
  const { onActivityExtensionClick } = useSessionManager();
  const { showSideBar, setShowSideBar } = useLocalFirstStore();

  // --- Functions
  function handleCustomEvent(event: {
    eventId: string;
    keyPressed: IShortCut[];
  }) {
    switch (event.eventId) {
      case EGlobalEvent.CHAT:
      case EGlobalEvent.SEARCH:
      case EGlobalEvent.IMPORTANT_CHAT:
      case EGlobalEvent.CHAT_WITH_PDF:
      case EGlobalEvent.CODE:
      case EGlobalEvent.SETTINGS:
        onActivityExtensionClick(event.eventId);
        break;
      case EGlobalEvent.TOGGLE_SIDEBAR:
        setShowSideBar(!showSideBar);
        break;
      case EGlobalEvent.CLOSE_ACTIVE_TAB:
        // TODO
        console.log("Closing the active tab!!!");
        break;
      case EGlobalEvent.ARCHIVED_CHATS:
        // TODO
        console.log("Archiving active chat!!!");
        break;
      case EGlobalEvent.BOOKMARKED_CHATS:
        // TODO
        console.log("Bookmarking active chat!!!");
        break;
      case EGlobalEvent.ACTIVE_TAB:
        // TODO
        console.log("Activating the active tab!!!");
        break;
      case EGlobalEvent.LOCK_ACTIVE_TAB:
        // TODO
        console.log("Locking the active tab!!!");
        break;
      case EGlobalEvent.NEW_CHAT_WITH_DEFAULT_MODEL:
        // TODO
        console.log("Creating a new chat with default model!!!");
        break;
      case EGlobalEvent.NEW_CHAT_TEMPORARY:
        // TODO
        console.log("Creating a new temporary chat!!!");
        break;
      case EGlobalEvent.RENAME_ACTIVE_CHAT:
        // TODO
        console.log("Renaming the active chat!!!");
        break;
      default:
        console.log("Unhandled global event.");
    }
  }

  // --- Hooks
  const sessionManager = useSessionManager();
  useKeyDown(globalEvents, handleCustomEvent);

  return (
    <PlatformContext.Provider
      value={{
        sessionManager,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatformContext = () => {
  const context = React.useContext(PlatformContext);
  if (!context) {
    throw new Error(
      "usePlatformContext must be used within a PlatformProvider"
    );
  }
  return context;
};
