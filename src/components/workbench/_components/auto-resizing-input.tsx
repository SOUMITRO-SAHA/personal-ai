import { Check, Paperclip, Square } from "lucide-react";
import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCurrentChatHistoryStore from "@/store/chat-history";
import { ISelect } from "@/core/types";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CommandGroup } from "cmdk";

interface IAutoResizingInputProps {
  value?: string;
  isError?: boolean;
  isGenerating?: boolean;
  onEnter?: (value: string) => void;
  onAbort?: () => void;

  className?: string;
  placeholder?: string;
}

export const AutoResizingInput: React.FC<IAutoResizingInputProps> = ({
  value,
  onEnter,
  className,
  isGenerating,
  isError,
  placeholder,
  onAbort,
}) => {
  // --- State
  const [text, setText] = React.useState("");
  const [showPopover, setShowPopover] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [options, setOptions] = React.useState<ISelect[]>([]);

  // --- Ref
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // --- Store
  const { chatHistory, addMessage, getMessage } = useCurrentChatHistoryStore();

  // --- Effect
  React.useEffect(() => {
    // Load the Options Here
  }, []);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  React.useEffect(() => {
    if (isError && chatHistory.length > 0) {
      setText(chatHistory[chatHistory.length - 1] || "");
    }
  }, [isError, chatHistory]);

  // --- Handlers
  const handleOptionSelect = (option: string) => {
    setText((prev) => prev + option);
    setShowPopover(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentValue = e.target.value;
    setText(currentValue);

    // Check if `@` is typed
    if (currentValue.endsWith("@")) {
      console.log("Pressed @");
      // @ -> Mention Another conversation
      setShowPopover(true);
    } else if (currentValue.endsWith("#")) {
      // # -> Tags
      console.log("Pressed #");
    } else if (currentValue.endsWith("/")) {
      // `/` -> Features like chat, search, so on...
      console.log("Pressed /");
    } else {
      setShowPopover(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return;

      e.preventDefault();
      if (onEnter) {
        onEnter(text);
        addMessage(text);
        setText("");
      }
    } else if (e.key === "ArrowUp") {
      const message = getMessage("ArrowUp");
      setText(message);
    } else if (e.key === "ArrowDown") {
      const message = getMessage("ArrowDown");
      setText(message);
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full border-2 shadow-xl border-muted-foreground/40",
        text.length > 0
          ? "rounded-3xl overflow-y-auto h-fit"
          : "rounded-full overflow-hidden h-14",
        className
      )}
    >
      <div className={cn("mx-2", text.length > 0 && "mb-2 mt-auto")}>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant={"ghost"}
              size={"icon"}
              className={cn("rounded-full [&_svg]:size-5")}
            >
              <Paperclip className="w-6 h-6 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border border-muted-foreground/40">
            <p>Attach File</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Popover */}
      <Popover open={showPopover}>
        <PopoverTrigger asChild>
          <ScrollArea
            className={cn("max-h-80 h-fit w-full", text.length > 600 && "h-80")}
          >
            <Textarea
              autoFocus
              ref={textareaRef}
              rows={1}
              value={value ?? text}
              placeholder={placeholder ?? "Type your message..."}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "p-0 py-5 overflow-hidden leading-relaxed tracking-wider border-none resize-none text-md h-fit focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground text-secondary-foreground"
              )}
            />
          </ScrollArea>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="p-2 rounded-md shadow-lg border-muted-foreground/40 min-h-40 bg-background-1 max-h-fit"
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowPopover((prev) => !prev);
                  textareaRef.current?.focus();
                }
              }}
            />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option, _idx) => (
                  <CommandItem
                    key={`${option.value}__${_idx}`}
                    value={option.value}
                    onSelect={(value) => {
                      setSelectedOption(value);
                      setShowPopover(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className={cn("mx-3", text.length > 0 && "mb-2 mt-auto")}>
        {isGenerating ? (
          <Button
            size={"icon"}
            className="rounded-full bg-secondary-foreground"
            onClick={onAbort}
          >
            <Square className="fill-background" />
          </Button>
        ) : (
          <Button
            size={"icon"}
            className={cn(
              "rounded-full bg-secondary-foreground p-0 [&_svg]:size-7"
            )}
            disabled={text.length === 0}
            onClick={() => {
              if (onEnter) {
                onEnter?.(text);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-arrow-up"
            >
              <path d="m16 12-4-4-4 4" />
              <path d="M12 16V8" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};
AutoResizingInput.displayName = "AutoResizingInput";

export default AutoResizingInput;
