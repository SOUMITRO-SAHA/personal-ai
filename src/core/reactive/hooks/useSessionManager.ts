/**
 * Hook to manage application sessions including chat, tab, and extensions.
 * It supports features like managing sidebars, reloading sessions with persistence,
 * and handling 3rd-party extensions.
 */

import * as React from "react";

import { ChatService, ISendLLMMessageParams } from "@/core/platform/services";
import { IApiConfig } from "@/core/types/apiConfig";
import { EAiProvider } from "@/core/types/enum";
import { useApiConfigStore } from "../store/config/apiConfigStore";
import { useActivityExtensionStore } from "../store/sessionManager/activityExtensionManager";
import useChatSessionStore, {
  ChatSessionData,
} from "../store/sessionManager/chatSessionManager";
import useGeneralSessionStore from "../store/sessionManager/generalSessionManager";
import {
  ITab,
  useTabSessionStore,
} from "../store/sessionManager/tabSessionManager";

interface INewSessionResponse {
  chat: ChatSessionData;
  tab: ITab;
}

interface ISendMessageToLLM {
  tabId: string;
  message: string;
}

export const useSessionManager = () => {
  // ----- Store
  const tabSessionManager = useTabSessionStore();
  const chatSessionManager = useChatSessionStore();
  const apiConfigStore = useApiConfigStore();
  const activityExtensionManager = useActivityExtensionStore();
  const generalSessionManager = useGeneralSessionStore();

  // ----- Api Config
  const apiConfig: IApiConfig = React.useMemo(
    () => ({
      model: apiConfigStore.model,
      variant: apiConfigStore.variant ?? "",
      localConfigs: apiConfigStore.localConfigs,
      anthropicConfigs: apiConfigStore.anthropicConfigs,
      geminiConfigs: apiConfigStore.geminiConfigs,
      openaiConfigs: apiConfigStore.openaiConfigs,
      ollamaConfigs: apiConfigStore.ollamaConfigs,
    }),
    [apiConfigStore]
  );

  // ----- Chat Service
  const chatService = React.useMemo(
    () => new ChatService(apiConfig),
    [apiConfig]
  );

  // ----- Actions
  function onActivityExtensionClick(extensionId: string) {
    const extension = activityExtensionManager.extensions.find(
      (extension) => extension.id === extensionId
    );

    if (extension) {
      let newTab;
      if (extension.newTab) {
        const label = extension.label;
        newTab = tabSessionManager.createTab(label)?.id;
      }

      generalSessionManager.createNewTabSession(newTab, extension);
      activityExtensionManager.setActiveExtensionTab(extensionId);
    }
  }

  function onTabClose(tabId: string) {
    tabSessionManager.closeTab(tabId);
    generalSessionManager.removeSession(tabId);

    // Now set the active tab to and active session
    const activeSession = tabSessionManager.activeTab;

    if (activeSession) {
      generalSessionManager.setActiveSession(activeSession.id);
    }

    // if there is no active session the reload the extension
    if (tabSessionManager.tabs.size === 1) {
      activityExtensionManager.getDefaultExtension();
    }
  }

  function onTabClick(tabId: string) {
    generalSessionManager.setActiveSession(tabId);
    tabSessionManager.setActiveTab(tabId);
  }

  /**
   * Start a new chat session tied to a specific tab.
   * @param params The model and variant for the chat session.
   */
  function startChatSession({
    model,
    variant,
  }: {
    model: EAiProvider;
    variant: string;
  }): INewSessionResponse | null {
    const label = `Chat with ${model}`;
    const tab = tabSessionManager.createTab(label);

    if (!tab) return null;
    const chat = chatSessionManager.startNewChat(tab.id, model, variant);

    return { chat, tab };
  }
  /**
   * Remove a specific session.
   */
  const removeSession = (sessionId: string) => {
    generalSessionManager.removeSession(sessionId);
  };

  /**
   * Close all active sessions.
   */
  const closeAllSessions = () => {
    // First Clear all the sessions
    generalSessionManager.resetSession();

    // Then Set the active extension to the chat
    activityExtensionManager.getDefaultExtension();
  };

  async function sendMessageToLLM(params: ISendMessageToLLM): Promise<void> {
    const chatSession = chatSessionManager.getChatSession(params.tabId);

    if (!chatSession) throw new Error("Chat session not found.");

    // Adding the last message to the chat session
    chatSessionManager.addOrUpdateChatMessage(
      params.tabId,
      params.message,
      "user"
    );

    const messages = chatSessionManager.getChatMessages(params.tabId);

    if (messages && messages.length > 0) {
      // If First Message then create a new Active Session
      if (messages.length === 1) {
        startChatSession({
          model: apiConfig.model,
          variant: apiConfig.variant,
        });
      }

      try {
        const chatServiceParam: ISendLLMMessageParams = {
          messages,
          onText: (_, fullText) => {
            chatSessionManager.addOrUpdateChatMessage(
              params.tabId,
              fullText,
              "assistant"
            );
          },
          onFinalMessage: (fullText) => {
            chatSessionManager.addOrUpdateChatMessage(
              params.tabId,
              fullText,
              "assistant"
            );
          },
          onError: (error) => {
            console.error("Error in chat:", error);
            chatSessionManager.addOrUpdateChatMessage(
              params.tabId,
              "An error occurred.",
              "assistant"
            );
          },
        };

        const { abort } = chatService.sendMessage(chatServiceParam);
        chatSessionManager.setAbortFunction(params.tabId, abort);
      } catch (error) {
        console.error("Failed to send message to LLM", error);
      }
    }
  }

  /**
   * Abort a chat session.
   * @param sessionId The session ID to abort.
   */
  async function abortFunction(sessionId: string) {
    chatSessionManager.abortSession(sessionId);
  }

  // --- Effects
  React.useEffect(() => {
    (async function () {
      apiConfigStore.setModel(EAiProvider.LOCAL);
      apiConfigStore.setVariant("llama3.2");
    })();
  }, []);

  return {
    startChatSession,
    removeSession,
    closeAllSessions,
    sendMessageToLLM,
    abortFunction,
    onActivityExtensionClick,
    onTabClose,
    onTabClick,
  };
};