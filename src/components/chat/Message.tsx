import React, { FC, memo } from "react";

import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MarkdownTable } from "./MarkdownTable";
import { isMarkdownTableString } from "../../lib/regex";

const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

const LinkRenderer = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      href={href as string}
      target='_blank'
      rel='noopener noreferrer'
      className="bitte-text-blue-300"
      {...props}
    >
      {children}
    </a>
  );
};

export const SAMessage = memo(({ content }: { content: string }) => {
  return isMarkdownTableString(content) ? (
    <MarkdownTable content={content} />
  ) : (
    <MemoizedReactMarkdown
      className="bitte-prose bitte-dark:prose-invert bitte-prose-p:leading-relaxed bitte-prose-pre:p-0 bitte-break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        a: LinkRenderer,
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  );
});

SAMessage.displayName = "SAMessage";
