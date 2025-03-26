import * as React from "react";

import { cn } from "../../lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, style, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "bitte:flex bitte:w-full bitte:rounded-md bitte:border bitte:border-input bitte:bg-transparent bitte:px-3 bitte:py-2 bitte:text-base bitte:shadow-sm bitte:placeholder:text-muted-foreground bitte:focus-visible:outline-hidden bitte:focus-visible:ring-1 bitte:focus-visible:ring-ring bitte:disabled:cursor-not-allowed bitte:disabled:opacity-50",
        className
      )}
      ref={ref}
      style={style}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
