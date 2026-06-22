import { cn } from "@/lib/utils";

export function Card({ className, glow = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground transition-all duration-300",
        glow && "card-glow hover:border-primary/30 hover:shadow-[0_0_30px_oklch(0.58_0.22_285/0.1)]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <div className={cn("text-base font-semibold leading-none tracking-tight text-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}