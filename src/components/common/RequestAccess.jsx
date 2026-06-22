import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestAccess() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("Waking up the server (free tier can take up to 60 seconds)...");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 1‑minute timeout

    try {
      const res = await fetch(
        "https://cp-sync-backend.onrender.com/api/request-access",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);
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
      clearTimeout(timeout);
      if (e.name === "AbortError") {
        setMessage("The server took too long to respond. Please try again later.");
      } else {
        setMessage("Network error. Please try again.");
      }
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
                className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={status === "loading"}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Waking up server..." : "Request Access"}
              </Button>
              {status === "loading" && (
                <p className="text-xs text-muted-foreground">
                  First request can take 30–60 seconds while the free server starts.
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