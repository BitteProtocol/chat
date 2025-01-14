import * as React from "react";
import { cn } from "../../lib/utils";
  
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "bitte-flex min-h-[80px] bitte-w-full bitte-rounded-md bitte-border bitte-border-border bitte-bg-background bitte-px-3 bitte-py-2 bitte-text-base bitte-ring-border bitte-ring-offset-background bitte-placeholder:text-muted-foreground bitte-focus:border-border bitte-focus-visible:outline-none bitte-focus-visible:ring-2 bitte-focus-visible:ring-ring bitte-focus-visible:ring-offset-2 bitte-disabled:cursor-not-allowed bitte-disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
