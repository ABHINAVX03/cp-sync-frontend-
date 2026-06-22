import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestAccess() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");
  const [serverReady, setServerReady] = useState(false);
  const [waking, setWaking] = useState(false);
  const [wakeFailed, setWakeFailed] = useState(false);
  const wakeAttemptsRef = useRef(0);
  const maxWakeAttempts = 3;

  // Pre‑warm the backend as soon as the component mounts
  useEffect(() => {
    wakeUpServer();
  }, []);

  async function wakeUpServer() {
    setWaking(true);
    setWakeFailed(false);

    for (let i = 0; i < maxWakeAttempts; i++) {
      try {
        const res = await fetch(
          "https://cp-sync-backend.onrender.com/actuator/health",
          { signal: AbortSignal.timeout(15000) } // 15s per try
        );
        if (res.ok) {
          setServerReady(true);
          setWaking(false);
          return;
        }
      } catch (e) {
        // continue to next attempt
      }
      wakeAttemptsRef.current++;
      // wait a bit before the next attempt (the cold start might be in progress)
      await new Promise((r) => setTimeout(r, 5000));
    }

    // All attempts failed
    setWakeFailed(true);
    setWaking(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(
        "https://cp-sync-backend.onrender.com/api/request-access",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          signal: AbortSignal.timeout(30000), // 30s, server should be warm now
        }
      );

      const text = await res.text();

      if (res.ok) {
        setMessage("Request received! We'll activate your account within 12 hours.");
        setStatus("success");
        setEmail("");
      } else {
        setMessage(text || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (e) {
      setMessage("Network error. The server might still be starting. Please wait a moment and try again.");
      setStatus("error");
    }
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-black mb-2">Get Early Access</h2>
        <p className="text-sm text-muted-foreground mb-6">
          We're in testing mode. Enter your email and we'll add you as an approved user within 12 hours.
        </p>

        {/* Show pre‑warm status */}
        {waking && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Waking up the server (free tier)… This may take up to a minute.
          </div>
        )}

        {wakeFailed && (
          <div className="mb-4 text-sm text-red-400">
            The server is not responding. It may be down for maintenance. Please try again later.
          </div>
        )}

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
            >
              {message}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={!serverReady}
                className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={status === "loading"}
                disabled={!serverReady || status === "loading"}
              >
                {status === "loading" ? "Submitting..." : "Request Access"}
              </Button>
              {!serverReady && !waking && !wakeFailed && (
                <p className="text-xs text-muted-foreground">
                  Waiting for the server to wake up…
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-400">{message}</p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}