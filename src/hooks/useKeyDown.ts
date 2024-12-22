import {
  IGlobalEvent,
  IGlobalEventObject,
} from "@/core/constants/globalEvents";
import * as React from "react";

export const useKeyDown = (
  globalEvents: IGlobalEvent,
  onCustomEvent?: (event: IGlobalEventObject) => void
) => {
  const [pressedKey, setPressedKey] = React.useState<string | null>(null);
  const isKeyHandled = React.useRef<boolean>(false);

  // --- Effects
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyCombination = `${event.ctrlKey ? "ctrl+" : ""}${
        event.shiftKey ? "shift+" : ""
      }${event.key.toLowerCase()}`;

      if (isKeyHandled.current) return;

      const matchingEvent = Object.values(globalEvents).find(
        (eventObj) => eventObj.keyPressed === keyCombination
      );

      if (matchingEvent) {
        setPressedKey(keyCombination);
        isKeyHandled.current = true;

        if (onCustomEvent) {
          onCustomEvent(matchingEvent);
        }

        const customEvent = new CustomEvent("globalKeyEvent", {
          detail: matchingEvent,
        });
        window.dispatchEvent(customEvent);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyCombination = `${event.ctrlKey ? "ctrl+" : ""}${
        event.shiftKey ? "shift+" : ""
      }${event.key.toLowerCase()}`;

      if (pressedKey === keyCombination) {
        isKeyHandled.current = false;
        setPressedKey(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [globalEvents, onCustomEvent, pressedKey]);

  return { pressedKey };
};
