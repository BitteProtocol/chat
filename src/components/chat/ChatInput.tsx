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
      className='relative mb-0 flex w-full items-center justify-center gap-4 max-lg:flex-wrap'
      style={{ color: textColor }}
      onSubmit={handleSubmit}
    >
      <div className='w-full relative'>
        {agentName ? <AgentPill name={agentName} ref={agentNameRef} /> : null}
        <Textarea
          placeholder='Message Smart Actions'
          style={{
            paddingLeft: `${paddingLeft}px`,
            background: backgroundColor,
            borderColor: borderColor,
          }}
          className='h-[42px] w-full resize-none min-h-0'
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
        className='h-[42px] lg:w-[42px] p-0 disabled:opacity-20'
        style={{ backgroundColor: buttonColor, color: textColor }}
      >
        <ArrowUp className='h-[16px] w-[16px] hidden lg:block' />
        <span className='lg:hidden'>Send</span>
      </Button>
    </form>
  );
};
