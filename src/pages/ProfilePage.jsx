import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch, Skeleton } from "@/components/ui/index.jsx";
import { PLATFORM_CONFIG } from "@/lib/utils";
import { api } from "@/lib/api";
import { clearToken, isLoggedIn } from "@/lib/auth";

const ALL_PLATFORMS = ["CODEFORCES", "LEETCODE", "ATCODER", "CODECHEF"];

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "??";
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary font-bold text-lg shrink-0">
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/", { replace: true });
      return;
    }
    loadProfile();
  }, [navigate]);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function togglePlatform(platform, enabled) {
    const current = new Set(profile.enabledPlatforms);
    if (enabled) current.add(platform);
    else current.delete(platform);

    setSaving(true);
    try {
      const updated = await api.updatePlatforms(Array.from(current));
      setProfile(updated);
      flashSaved();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(active) {
    setSaving(true);
    try {
      const updated = active ? await api.resumeSync() : await api.pauseSync();
      setProfile(updated);
      flashSaved();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogout() {
    clearToken();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-lg px-6 py-10 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-2xl font-black">Profile</h1>
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="ml-auto text-xs text-green-400 flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              Saved
            </motion.span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-48 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card><CardContent className="p-5"><Skeleton className="h-20 w-full rounded-lg" /></CardContent></Card>
            <Card><CardContent className="p-5"><Skeleton className="h-40 w-full rounded-lg" /></CardContent></Card>
          </div>
        ) : profile ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* User card */}
            <Card glow>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <Avatar name={profile.name} />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{profile.name || "User"}</p>
                    <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">ID #{profile.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sync toggle */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold mb-0.5">Daily auto-sync</p>
                    <p className="text-xs text-muted-foreground">
                      {profile.active
                        ? "Contests sync to your calendar every day at 3 AM."
                        : "Sync is paused. Your calendar won't update."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium ${profile.active ? "text-green-400" : "text-muted-foreground"}`}>
                      {profile.active ? "Active" : "Paused"}
                    </span>
                    <Switch
                      checked={profile.active}
                      disabled={saving}
                      onCheckedChange={toggleActive}
                      label="Toggle daily sync"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Tracked platforms</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Only enabled platforms get synced to your calendar.
                </p>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                {ALL_PLATFORMS.map((p) => {
                  const config = PLATFORM_CONFIG[p];
                  const enabled = profile.enabledPlatforms.includes(p);
                  return (
                    <div
                      key={p}
                      className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                          style={{
                            color: config.color,
                            background: `${config.color}18`,
                          }}
                        >
                          {config.short}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{config.label}</p>
                          {enabled && (
                            <p className="text-xs text-green-400/80">Syncing</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full transition-all ${enabled
                              ? "bg-green-500/15 text-green-400 border border-green-500/30"
                              : "bg-zinc-700/40 text-zinc-400 border border-zinc-600"
                            }`}
                        >
                          {enabled ? "ON" : "OFF"}
                        </span>

                        <Switch
                          checked={enabled}
                          disabled={saving}
                          onCheckedChange={(val) => togglePlatform(p, val)}
                          label={`Toggle ${config.label}`}
                          className="
      data-[state=checked]:bg-violet-600
      data-[state=unchecked]:bg-zinc-600
    "
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-red-500/20">
              <CardContent className="p-5">
                <p className="text-sm font-semibold mb-1">Sign out</p>
                <p className="text-xs text-muted-foreground mb-4">
                  You can sign back in with Google anytime. Your calendar entries remain.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign out
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}