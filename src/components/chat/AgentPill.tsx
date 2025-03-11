import { forwardRef } from 'react';

interface AgentPillProps {
  name: string;
}

export const AgentPill = forwardRef<HTMLDivElement, AgentPillProps>(
  ({ name }, ref) => (
    <div
      ref={ref}
      className="bitte-w-fit bitte-rounded-full bitte-border bitte-border-dashed bitte-border-gray-40 bitte-px-2 bitte-py-1 bitte-text-xs bitte-font-semibold bitte-uppercase bitte-text-purple-400 bitte-mb-2 lg:bitte-mb-0 lg:bitte-absolute lg:bitte-left-2 lg:bitte-top-1/2 lg:bitte--translate-y-1/2"
    >
      {name}
    </div>
  ),
);

AgentPill.displayName = 'AgentPill';
