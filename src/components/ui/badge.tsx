import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white shadow-xs",
        secondary: "border-slate-300 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:border-slate-700",
        destructive: "border-rose-300 bg-rose-100 text-rose-950 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700",
        outline: "border-slate-300 bg-background text-slate-800 dark:border-slate-700 font-semibold",
        success: "border-emerald-300 bg-emerald-100 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700",
        warning: "border-amber-300 bg-amber-100 text-amber-950 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700",
        info: "border-blue-300 bg-blue-100 text-blue-950 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
