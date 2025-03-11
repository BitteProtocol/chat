import React, { useEffect, useRef, useState } from 'react';
import { SendButtonComponentProps } from '../../types';
import { Textarea } from '../ui/textarea';
import { AgentPill } from './AgentPill';
import DefaultSendButton from './default-components/DefaultSendButtonComponent';

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
  mobileInputExtraButton?: React.JSX.Element;
  customSendButtonComponent?: React.ComponentType<SendButtonComponentProps>;
  placeholderText?: string;
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
  mobileInputExtraButton,
  customSendButtonComponent: SendButtonComponent = DefaultSendButton,
  placeholderText,
}: SmartActionsInputProps) => {
  const agentNameRef = useRef<HTMLDivElement>(null);
  const [paddingLeft, setPaddingLeft] = useState<number>(125);
  const [previousAgentName, setPreviousAgentName] = useState('Select Agent');

  useEffect(() => {
    if (agentNameRef.current) {
      setPaddingLeft(agentNameRef.current.offsetWidth + 16);
    } else {
      setPaddingLeft(125);
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
          placeholder={placeholderText || 'Message Smart Actions'}
          style={{
            paddingLeft: `${paddingLeft}px`,
            background: backgroundColor,
            borderColor: borderColor,
          }}
          className="bitte-h-[42px] bitte-w-full bitte-resize-none bitte-min-h-0 textarea-chat"
          onChange={handleChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
          value={input}
        />
      </div>
      <div className="bitte-flex bitte-gap-2 bitte-w-full lg:bitte-contents">
        {mobileInputExtraButton ? (
          <div className="bitte-w-full lg:bitte-hidden">
            {mobileInputExtraButton}
          </div>
        ) : null}
        <SendButtonComponent
          input={input}
          isLoading={isLoading}
          buttonColor={buttonColor}
          textColor={textColor}
        />
      </div>
    </form>
  );
};
