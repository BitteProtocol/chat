import { forwardRef } from "react";

interface AgentPillProps {
  name: string;
}

export const AgentPill = forwardRef<HTMLDivElement, AgentPillProps>(
  ({ name }, ref) => (
    <div
      ref={ref}
      className="bitte-w-fit bitte-rounded-full bitte-border bitte-border-dashed bitte-border-gray-40 bitte-px-2 bitte-py-1 bitte-text-xs bitte-font-semibold bitte-uppercase bitte-text-purple-100 bitte-absolute bitte-left-2 bitte-top-1/2 bitte--translate-y-1/2"
    >
      {name}
    </div>
  )
);

AgentPill.displayName = "AgentPill";
