import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="bitte-flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'bitte-flex bitte-flex-1 bitte-items-center bitte-justify-between bitte-text-sm bitte-font-medium bitte-transition-all bitte-text-left [&[data-state=open]>svg]:bitte-rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="bitte-h-4 bitte-w-4 bitte-shrink-0 bitte-text-muted-foreground bitte-transition-transform bitte-duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, style, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="bitte-overflow-hidden bitte-text-sm data-[state=closed]:bitte-animate-accordion-up data-[state=open]:bitte-animate-accordion-down"
    {...props}
  >
    <div className={cn('bitte-pb-4 bitte-pt-0', className)} style={style}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
