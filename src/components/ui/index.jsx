import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
        variant === "default" && "border border-transparent bg-primary/15 text-primary",
        variant === "secondary" && "border border-border bg-secondary text-secondary-foreground",
        variant === "outline" && "border border-border text-muted-foreground",
        variant === "success" && "border border-green-500/30 bg-green-500/10 text-green-400",
        variant === "warning" && "border border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("rounded-lg skeleton", className)}
      {...props}
    />
  );
}

export function Switch({ checked = false, onCheckedChange, className, disabled = false, label, ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCheckedChange?.(!checked);
        }
      }}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary shadow-[0_0_12px_oklch(0.58_0.22_285/0.4)]" : "bg-muted",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      aria-label={label}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export function Divider({ className, ...props }) {
  return <div className={cn("h-px w-full bg-border", className)} {...props} />;
}