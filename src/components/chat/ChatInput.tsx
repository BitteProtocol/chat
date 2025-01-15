import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { AgentPill } from "./AgentPill";

interface SmartActionsInputProps {
  input: string;
  isLoading: boolean;
  agentName?: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonColor: string;
  borderColor: string;
  textColor: string;
  backgroundColor: string;
}

export const SmartActionsInput = ({
  input,
  isLoading,
  agentName,
  handleChange,
  handleSubmit,
  buttonColor,
  borderColor,
  textColor,
  backgroundColor,
}: SmartActionsInputProps) => {
  const agentNameRef = useRef<HTMLDivElement>(null);
  const [paddingLeft, setPaddingLeft] = useState<number>(16);
  const [previousAgentName, setPreviousAgentName] = useState("Select Agent");

  useEffect(() => {
    if (agentNameRef.current) {
      setPaddingLeft(agentNameRef.current.offsetWidth + 16);
    } else {
      setPaddingLeft(16);
    }
  }, [agentName]);

  useEffect(() => {
    if (agentName && agentName !== previousAgentName) {
      setPreviousAgentName(agentName);
    }
  }, [agentName]);

  return (
    <form
      className="bitte-relative bitte-mb-0 bitte-flex bitte-w-full bitte-items-center bitte-justify-center bitte-gap-4 max-lg:bitte-flex-wrap"
      style={{ color: textColor }}
      onSubmit={handleSubmit}
    >
      <div className="bitte-w-full bitte-relative">
        <AgentPill name={agentName || previousAgentName} ref={agentNameRef} />

        <Textarea
          placeholder='Message Smart Actions'
          style={{
            paddingLeft: `${paddingLeft}px`,
            background: backgroundColor,
            borderColor: borderColor,
          }}
          className="bitte-h-[42px] bitte-w-full bitte-resize-none bitte-min-h-0"
          onChange={handleChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
          value={input}
        />
      </div>
      <Button
        type='submit'
        disabled={!input || isLoading}
        className="bitte-h-[42px] bitte-w-full lg:bitte-w-[42px] bitte-p-0 bitte-disabled:opacity-20"
        style={{ backgroundColor: buttonColor, color: textColor }}
      >
        <ArrowUp className="bitte-h-[16px] bitte-w-[16px] bitte-hidden bitte-lg:block" />
        <span className="bitte-lg:hidden">Send</span>
      </Button>
    </form>
  );
};
