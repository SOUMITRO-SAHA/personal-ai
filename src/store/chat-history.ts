import { idbStorage } from "@/core/reactive/store";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ICurrentChatHistoryState {
  chatHistory: string[];
}

interface ICurrentChatHistoryAction {
  addMessage: (message: string) => void;
  getMessage: (key: "ArrowUp" | "ArrowDown") => string;
  clearHistory: () => void;
}

interface ICurrentChatHistory
  extends ICurrentChatHistoryState,
    ICurrentChatHistoryAction {}

export const useCurrentChatHistoryStore = create<ICurrentChatHistory>()(
  devtools(
    persist(
      (set, get) => {
        let currentIndex = -1;

        return {
          // --- States
          chatHistory: [],

          // --- Actions
          addMessage: (message) => {
            set({ chatHistory: [...get().chatHistory, message] });
            currentIndex = get().chatHistory.length;
          },

          getMessage: (key) => {
            const history = get().chatHistory;
            const length = history.length;

            if (length === 0) return "";

            if (key === "ArrowDown") {
              currentIndex = (currentIndex + 1) % length;
            } else if (key === "ArrowUp") {
              currentIndex = (currentIndex - 1 + length) % length;
            }

            return history?.[currentIndex] || "";
          },
          clearHistory: () => {
            set({ chatHistory: [] });
            currentIndex = -1;
          },
        };
      },
      {
        name: "current-chat-history",
        storage: idbStorage(),
        partialize: (state) => ({ chatHistory: state.chatHistory }),
      }
    ),
    {
      name: "CurrentChatHistoryStore",
    }
  )
);

export default useCurrentChatHistoryStore;
