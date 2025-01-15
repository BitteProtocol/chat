import * as React from "react"

import { cn } from "../../lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "bitte-flex bitte-min-h-[60px] bitte-w-full bitte-rounded-md bitte-border bitte-border-input bitte-bg-transparent bitte-px-3 bitte-py-2 bitte-text-base bitte-shadow-sm placeholder:bitte-text-muted-foreground focus-visible:bitte-outline-none focus-visible:bitte-ring-1 focus-visible:bitte-ring-ring disabled:bitte-cursor-not-allowed disabled:bitte-opacity-50 md:bitte-text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
