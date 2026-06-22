import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getTimeFromNow(dateStr) {
  const diff = new Date(dateStr) - new Date();
  if (diff < 0) return "Started";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `In ${days}d ${hours}h`;
  if (hours > 0) return `In ${hours}h ${mins}m`;
  return `In ${mins}m`;
}

export const PLATFORM_CONFIG = {
  CODEFORCES: { color: "#f44336", label: "Codeforces", short: "CF" },
  LEETCODE:   { color: "#ffa116", label: "LeetCode",   short: "LC" },
  CODECHEF:   { color: "#b87333", label: "CodeChef",   short: "CC" },
  ATCODER:    { color: "#00bcd4", label: "AtCoder",    short: "AC" },
};