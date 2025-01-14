import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bitte-flex bitte-h-10 bitte-w-full bitte-rounded-md bitte-border bitte-border-border bitte-bg-background bitte-px-3 bitte-py-2 bitte-text-base bitte-font-normal bitte-ring-offset-background bitte-file:border-0 bitte-file:bg-transparent bitte-file:text-base bitte-file:font-medium bitte-placeholder:text-muted-foreground bitte-focus-visible:outline-none bitte-focus-visible:ring-2 bitte-focus-visible:ring-transparent bitte-focus-visible:ring-offset-2 bitte-disabled:cursor-not-allowed bitte-disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
