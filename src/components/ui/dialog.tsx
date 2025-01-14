import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bitte-fixed bitte-inset-0 z-[60] bitte-bg-black/80",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] bitte-fixed bitte-left-1/2 bitte-top-1/2 z-[60] bitte-grid bitte-w-full bitte-max-w-3xl bitte--translate-x-1/2 bitte--translate-y-1/2 bitte-gap-4 bitte-border bitte-border-border bitte-bg-background bitte-p-6 bitte-shadow-lg bitte-duration-200 bitte-sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="bitte-absolute bitte-right-4 bitte-top-4 bitte-rounded-sm bitte-opacity-70 bitte-ring-offset-background bitte-transition-opacity bitte-hover:opacity-100 bitte-focus:outline-none bitte-focus:ring-2 bitte-focus:ring-ring bitte-focus:ring-offset-2 bitte-disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <div className="bitte-inline-flex bitte-size-8 bitte-items-center bitte-justify-center bitte-whitespace-nowrap bitte-rounded-md bitte-border bitte-border-input bitte-bg-background bitte-p-0 bitte-text-sm bitte-font-medium bitte-ring-offset-background bitte-transition-colors bitte-hover:bg-accent bitte-hover:text-accent-foreground bitte-focus-visible:outline-none bitte-focus-visible:ring-2 bitte-focus-visible:ring-ring bitte-focus-visible:ring-offset-2 bitte-disabled:pointer-events-none bitte-disabled:opacity-50">
          <X className="bitte-size-4" />
        </div>
        <span className="bitte-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bitte-flex bitte-flex-col bitte-space-y-1.5 bitte-text-center bitte-sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bitte-flex bitte-flex-col-reverse bitte-sm:flex-row bitte-sm:justify-end bitte-sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "bitte-text-lg bitte-font-semibold bitte-leading-none bitte-tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("bitte-text-sm bitte-text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
