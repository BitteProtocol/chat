import React from "react";

interface CodeBlockProps {
  content: string;
}

export const CodeBlock = ({ content }: CodeBlockProps) => {
  return (
    <div className="bitte-w-full">
      <pre className="bitte-disable-scrollbars bitte-w-full bitte-overflow-x-auto bitte-rounded-lg bitte-bg-secondary bitte-p-4 bitte-text-secondary-foreground">
        <code
          className="bitte-block w-[400px] bitte-font-mono bitte-text-sm"
          aria-label='Code example'
        >
          {content}
        </code>
      </pre>
    </div>
  );
};
