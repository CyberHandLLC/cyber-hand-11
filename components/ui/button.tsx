import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type _ButtonVariant = "primary" | "outline" | "secondary" | "ghost" | "link" | "destructive";
type _ButtonSize = "sm" | "md" | "lg";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50",
  {
    variants: {
      variant: {
        primary: "bg-cyan-500 text-white cyber-shadow-sm hover:cyber-shadow-lg",
        outline:
          "cyber-border text-cyan-400 cyber-shadow-sm hover:cyber-shadow-md hover:bg-cyan-500/10",
        secondary: "bg-sky-700 text-white cyber-shadow-sm hover:cyber-shadow-md",
        ghost: "text-cyan-400 hover:bg-cyan-500/10",
        link: "text-cyan-400 underline-offset-4 hover:underline",
        destructive: "bg-red-500 text-white cyber-shadow-sm hover:cyber-shadow-md",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm sm:text-base",
        lg: "px-5 py-2.5 text-base sm:text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          transitionDuration: "var(--transition-medium)",
        }}
        ref={ref}
        {...props}
      >
        <span className="flex items-center justify-center">{props.children}</span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
