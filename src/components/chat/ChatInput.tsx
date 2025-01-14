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
}

export const SmartActionsInput = ({
  input,
  isLoading,
  agentName,
  handleChange,
  handleSubmit,
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
      className="bitte-relative bitte-mb-0 bitte-flex bitte-w-full bitte-items-center bitte-justify-center bitte-gap-4 bitte-max-lg:flex-wrap"
      onSubmit={handleSubmit}
    >
      <div className="bitte-w-full bitte-relative">
        {agentName ? (
          <AgentPill name={agentName} ref={agentNameRef} />
        ) : (
          <div
            ref={agentNameRef}
            className="bitte-w-fit bitte-rounded-full bitte-border bitte-text-gray-40 bitte-border-gray-40 bitte-border-dashed bitte-px-2 bitte-py-1 bitte-text-xs bitte-font-semibold bitte-uppercase bitte-absolute bitte-left-2 bitte-top-1/2 bitte--translate-y-1/2 bitte-text-opacity-0"
          >
            {previousAgentName}
          </div>
        )}
        <Textarea
          placeholder='Message Smart Actions'
          style={{
            paddingLeft: `${paddingLeft}px`,
          }}
          className="h-[42px] bitte-w-full bitte-resize-none bitte-min-h-0"
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
        className="h-[42px] bitte-w-full lg:w-[42px] bitte-p-0 bitte-disabled:opacity-20 bitte-bg-gray-800"
      >
        <ArrowUp className="h-[16px] w-[16px] bitte-hidden bitte-lg:block" />
        <span className="bitte-lg:hidden">Send</span>
      </Button>
    </form>
  );
};
