import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatDate,
  formatDuration,
  getTimeFromNow,
  PLATFORM_CONFIG,
} from "@/lib/utils";

export default function ContestCard({ contest, index = 0 }) {
  const config = PLATFORM_CONFIG[contest.platform] || {
    color: "#888",
    label: contest.platform,
    short: "??",
  };

  // Live countdown – re-render every 30 seconds
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const timeFromNow = getTimeFromNow(contest.startTime);
  const isSoon = new Date(contest.startTime) - now < 86400000 * 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.04, 0.4),
      }}
    >
      <Card
        glow
        className="group overflow-hidden hover:-translate-y-0.5 transition-all duration-200 bg-card/70 backdrop-blur-sm"
      >
        <div
          className="h-0.5 w-full"
          style={{ background: config.color }}
        />

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide"
                  style={{
                    color: config.color,
                    background: `${config.color}15`,
                    border: `1px solid ${config.color}30`,
                  }}
                >
                  {config.short} · {config.label}
                </span>

                {isSoon && (
                  <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-yellow-400 bg-yellow-400/10 border border-yellow-400/20">
                    <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    Soon
                  </span>
                )}
              </div>

              <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-2 truncate pr-2">
                {contest.name}
              </h3>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon />
                  {formatDate(contest.startTime)}
                </span>

                {contest.durationSeconds > 0 && (
                  <span className="flex items-center gap-1.5">
                    <ClockIcon />
                    {formatDuration(contest.durationSeconds)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
              <div
                className="text-sm font-semibold"
                style={{
                  color: isSoon ? "#facc15" : config.color,
                }}
              >
                {timeFromNow}
              </div>

              <a
                href={contest.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all duration-150"
              >
                View
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}