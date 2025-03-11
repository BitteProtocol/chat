import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'bitte-inline-flex bitte-items-center bitte-rounded-md bitte-border bitte-px-2.5 bitte-py-0.5 bitte-text-xs bitte-font-semibold bitte-transition-colors focus:bitte-outline-none focus:bitte-ring-2 focus:bitte-ring-ring focus:bitte-ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bitte-border-transparent bitte-bg-primary bitte-text-primary-foreground bitte-shadow hover:bitte-bg-primary/80',
        secondary:
          'bitte-border-transparent bitte-bg-secondary bitte-text-secondary-foreground hover:bitte-bg-secondary/80',
        destructive:
          'bitte-border-transparent bitte-bg-destructive bitte-text-destructive-foreground bitte-shadow hover:bitte-bg-destructive/80',
        outline: 'bitte-text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
