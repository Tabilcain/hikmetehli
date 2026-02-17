import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkButtonVariants = cva(
  "group relative flex items-center justify-center gap-4 w-full max-w-md mx-auto px-8 py-5 rounded-2xl font-medium text-base transition-all duration-400 ease-out overflow-hidden active:scale-[0.97] active:transition-transform active:duration-150",
  {
    variants: {
      variant: {
        default:
          "bg-card border border-border text-foreground hover:border-primary/30 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.25)] hover:-translate-y-1",
        primary:
          "bg-primary text-primary-foreground border border-primary hover:bg-emerald-light hover:shadow-elevated hover:shadow-primary/20 hover:-translate-y-1",
        ghost:
          "bg-transparent border border-border/50 text-foreground hover:bg-card hover:border-border hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkButtonVariants> {
  icon?: React.ReactNode;
  label: string;
  description?: string;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, icon, label, description, ...props }, ref) => {
    return (
      <a
        className={cn(linkButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {/* Subtle shimmer effect on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" 
              style={{ backgroundSize: '200% 100%' }} />
        
        {/* Icon container */}
        {icon && (
          <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/80 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
            {icon}
          </span>
        )}
        
        {/* Text content */}
        <span className="relative flex flex-col items-start flex-1">
          <span className="font-semibold tracking-wide">{label}</span>
          {description && (
            <span className="text-sm text-muted-foreground font-normal mt-0.5">
              {description}
            </span>
          )}
        </span>
        
        {/* Arrow indicator */}
        <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-transparent transition-all duration-300 group-hover:bg-secondary">
          <svg 
            className="w-4 h-4 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </a>
    );
  }
);
LinkButton.displayName = "LinkButton";

export { LinkButton, linkButtonVariants };
