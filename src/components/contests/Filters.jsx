import { PLATFORM_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PLATFORMS = ["All", "CODEFORCES", "LEETCODE", "CODECHEF", "ATCODER"];

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search contests..."
        className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export function PlatformFilter({ selected, onChange, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((p) => {
        const config = PLATFORM_CONFIG[p];
        const isActive = selected === p;
        const count = p === "All"
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[p] || 0;

        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
              isActive
                ? p === "All"
                  ? "bg-primary text-primary-foreground shadow-[0_0_12px_oklch(0.58_0.22_285/0.3)]"
                  : "text-white shadow-md"
                : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-secondary"
            )}
            style={isActive && p !== "All" ? {
              background: config?.color,
              borderColor: config?.color,
            } : {}}
          >
            {config && (
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full",
                  isActive ? "bg-white/70" : "opacity-70"
                )}
                style={!isActive ? { background: config.color } : {}}
              />
            )}
            {p === "All" ? "All" : config?.label || p}
            {count > 0 && (
              <span className={cn(
                "rounded-full px-1.5 py-0 text-[10px] font-bold",
                isActive ? "bg-white/20 text-white" : "bg-border text-muted-foreground"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}