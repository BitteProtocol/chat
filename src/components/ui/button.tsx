import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'bitte-inline-flex bitte-items-center bitte-justify-center bitte-gap-2 bitte-whitespace-nowrap bitte-rounded-md bitte-text-sm bitte-font-medium bitte-transition-colors focus-visible:bitte-outline-none focus-visible:bitte-ring-1 focus-visible:bitte-ring-ring disabled:bitte-pointer-events-none disabled:bitte-opacity-50 [&_svg]:bitte-pointer-events-none [&_svg]:bitte-size-4 [&_svg]:bitte-shrink-0',
  {
    variants: {
      variant: {
        default:
          'bitte-bg-white bitte-text-black bitte-shadow hover:bitte-bg-opacity-80',
        destructive:
          'bitte-bg-destructive bitte-text-destructive-foreground bitte-shadow-sm hover:bitte-bg-destructive/90',
        outline:
          'bitte-border bitte-border-input bitte-bg-transparent bitte-shadow-sm hover:bitte-bg-accent hover:bitte-text-accent-foreground',
        secondary:
          'bitte-bg-secondary bitte-text-secondary-foreground bitte-shadow-sm hover:bitte-bg-secondary/80',
        ghost: 'hover:bitte-bg-accent hover:bitte-text-accent-foreground',
        link: 'bitte-text-primary bitte-underline-offset-4 hover:bitte-underline',
      },
      size: {
        default: 'bitte-h-9 bitte-px-4 bitte-py-2',
        sm: 'bitte-h-8 bitte-rounded-md bitte-px-3 bitte-text-xs',
        lg: 'bitte-h-10 bitte-rounded-md bitte-px-8',
        icon: 'bitte-h-9 bitte-w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
