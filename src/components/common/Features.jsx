import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Google Calendar Sync",
    description: "Contests land directly on your calendar with the correct time, duration, and a direct link — no manual entry.",
    accent: "oklch(0.58 0.22 285)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
    title: "Daily Auto‑Sync",
    description: "A background scheduler runs every morning at 3 AM, fetching new contests and pushing only the latest ones to your calendar.",
    accent: "oklch(0.65 0.18 195)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    title: "Choose Your Platforms",
    description: "Enable only the platforms you care about: Codeforces, LeetCode, CodeChef, or AtCoder. Your calendar stays clutter‑free.",
    accent: "oklch(0.72 0.18 75)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Secure by Design",
    description: "OAuth tokens are AES‑256‑GCM encrypted at rest. JWTs expire after 7 days. No passwords are ever stored.",
    accent: "oklch(0.58 0.18 145)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "One‑Click Manual Sync",
    description: "Hit “Sync now” from the dashboard to force a fresh fetch and push the latest contests instantly — no waiting until tomorrow.",
    accent: "oklch(0.68 0.22 285)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Zero Duplicates",
    description: "Every synced event is tracked. Re‑syncing never creates duplicates — it skips contests already on your calendar.",
    accent: "oklch(0.62 0.2 25)",
  },
];

function FeatureCard({ icon, title, description, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Card
        glow
        className="h-full p-6 bg-card/60 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 border-l-2"
        style={{ borderLeftColor: accent }}
      >
        <div
          className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: `${accent}18`, color: accent }}
        >
          {icon}
        </div>
        <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-primary uppercase tracking-widest mb-3"
        >
          Why CPSync
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-4xl md:text-5xl font-black tracking-tight"
        >
          Built for competitive programmers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-lg mx-auto text-muted-foreground"
        >
          Everything you need to keep your contest schedule on autopilot.
        </motion.p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} {...f} index={i} />
        ))}
      </div>
    </section>
  );
}