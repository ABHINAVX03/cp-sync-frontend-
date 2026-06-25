import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContestCard from "@/components/contests/ContestCard";
import { SearchBar, PlatformFilter } from "@/components/contests/Filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/index.jsx";

import { api } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { PLATFORM_CONFIG } from "@/lib/utils";

function StatCard({ value, label, accent }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="text-2xl font-black" style={{ color: accent }}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function ContestSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-0.5 w-full skeleton" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [lastSynced, setLastSynced] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/", { replace: true });
      return;
    }
    loadContests();
  }, [navigate]);

  // Auto-dismiss sync message after 8 seconds
  useEffect(() => {
    if (!syncMsg) return;
    const t = setTimeout(() => setSyncMsg(null), 8000);
    return () => clearTimeout(t);
  }, [syncMsg]);

  async function loadContests() {
    setLoading(true);
    setError("");
    try {
      const data = await api.getContests();
      setContests(data || []);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Failed to load contests.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    if (contests.length === 0) {
      setSyncMsg({
        type: "error",
        text: "Please enable at least one platform before syncing.",
      });
      return;
    }

    setSyncing(true);
    setSyncMsg(null);

    try {
      await api.triggerSync();
      setSyncMsg({
        type: "success",
        text: "Synced successfully! Please check or refresh your Google Calendar.",
      });
      setLastSynced(new Date());
    } catch (e) {
      const status = e.response?.status;
      const data = e.response?.data;

      if (status === 429) {
        // Backend returns retryAfterSeconds in the body
        const secs = data?.retryAfterSeconds ?? 300;
        const mins = Math.ceil(secs / 60);
        setSyncMsg({
          type: "error",
          text: `Sync limit reached. You can sync once every 5 minutes — try again in ${mins} minute${mins !== 1 ? "s" : ""}.`,
        });
      } else {
        setSyncMsg({
          type: "error",
          text: data?.error || e.message || "Sync failed. Please try again.",
        });
      }
    } finally {
      setSyncing(false);
    }
  }

  // Platform counts for the filter pill badges
  const platformCounts = useMemo(() => {
    const counts = {};
    contests.forEach((c) => {
      counts[c.platform] = (counts[c.platform] || 0) + 1;
    });
    return counts;
  }, [contests]);

  // Filtered list based on search + platform
  const filteredContests = useMemo(() => {
    return contests.filter((c) => {
      const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase());
      const matchPlatform = platform === "All" || c.platform === platform;
      return matchSearch && matchPlatform;
    });
  }, [contests, search, platform]);

  const totalContests = contests.length;
  const soonCount = contests.filter(
    (c) => new Date(c.startTime) - new Date() < 86400000 * 2
  ).length;
  const platformCount = Object.keys(platformCounts).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Sync overlay */}
      <AnimatePresence>
        {syncing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative flex w-[90%] max-w-sm flex-col items-center justify-center overflow-hidden rounded-3xl border border-primary/20 bg-card p-10 shadow-[0_0_60px_oklch(0.58_0.22_285/0.2)]"
            >
              <div className="absolute inset-0 grid-bg opacity-20" />
              <div className="absolute h-full w-full animate-pulse bg-primary/10 blur-[60px]" />

              <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent border-l-transparent opacity-70"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <polyline points="14 14 11 17 8 14" />
                  </svg>
                </motion.div>
              </div>

              <h3 className="relative z-10 text-xl font-black text-foreground">
                Syncing to Calendar
              </h3>
              <p className="relative z-10 mt-2 text-center text-sm text-muted-foreground leading-relaxed">
                Pushing your upcoming contests to Google Calendar. This will just take a second...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8 relative">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Upcoming Contests
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading
                ? "Loading contests…"
                : `${totalContests} contests across ${platformCount} platform${platformCount !== 1 ? "s" : ""}`}
              {lastSynced && (
                <span className="ml-2 text-muted-foreground/60">
                  · Synced {lastSynced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={loadContests} variant="outline" size="sm" disabled={loading}>
              <RefreshIcon className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button onClick={handleSync} loading={syncing} size="sm" variant="default">
              {syncing ? <SpinnerIcon /> : <CalendarSyncIcon />}
              {syncing ? "Syncing…" : "Sync to Calendar"}
            </Button>
          </div>
        </div>

        {/* Welcome banner — shown when user has no enabled platforms yet */}
        <AnimatePresence>
          {!loading && contests.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <polyline points="14 14 11 17 8 14" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">
                    Welcome to Contest Tracker!
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enable at least one platform in your settings to see upcoming contests and sync them to your calendar.
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate("/profile")}>
                  Enable Platforms
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats row */}
        {!loading && contests.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard value={totalContests} label="Total upcoming" accent="oklch(0.75 0.18 285)" />
            <StatCard value={soonCount} label="Starting in 48h" accent="#facc15" />
            <StatCard value={platformCount} label="Active platforms" accent="oklch(0.65 0.18 195)" />
          </div>
        )}

        {/* Sync message — success or error (including 429 rate limit) */}
        <AnimatePresence>
          {syncMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`mb-4 rounded-xl border px-4 py-3 text-sm flex items-center gap-2 ${
                syncMsg.type === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {syncMsg.type === "success" ? <CheckIcon /> : <AlertIcon />}
              {syncMsg.text}
              <button
                className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
                onClick={() => setSyncMsg(null)}
                aria-label="Dismiss"
              >
                <XIcon />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
            <AlertIcon />
            {error}
            <button
              className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
              onClick={() => setError("")}
              aria-label="Dismiss"
            >
              <XIcon />
            </button>
          </div>
        )}

        {/* Filters */}
        {contests.length > 0 && (
          <div className="mb-6 space-y-3">
            <SearchBar value={search} onChange={setSearch} />
            {!loading && (
              <PlatformFilter
                selected={platform}
                onChange={setPlatform}
                counts={platformCounts}
              />
            )}
          </div>
        )}

        {/* Contest list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <ContestSkeleton key={i} />)}
          </div>
        ) : contests.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-1">No platforms enabled</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enable at least one platform in your settings to see contests.
              </p>
            </Card>
          </motion.div>
        ) : filteredContests.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-1">No contests found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search
                  ? `No results for "${search}"`
                  : "No contests match the current filter."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearch(""); setPlatform("All"); }}
              >
                Clear filters
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredContests.map((contest, i) => (
              <ContestCard
                key={contest.contestKey || `${contest.platform}_${contest.contestId}_${i}`}
                contest={contest}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function RefreshIcon({ className = "" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
}

function CalendarSyncIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="14 14 11 17 8 14"/>
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
