import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/lib/auth";

const STEPS = [
  {
    num: "01",
    title: "Sign in with Google",
    desc: "One click grants calendar access. No new account, no passwords.",
  },
  {
    num: "02",
    title: "Pick your platforms",
    desc: "Toggle which platforms to track from your profile page.",
  },
  {
    num: "03",
    title: "Contests appear in Calendar",
    desc: "CPSync pushes every upcoming contest automatically. Sync manually anytime.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-primary uppercase tracking-widest mb-3"
        >
          How it works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black tracking-tight"
        >
          Three steps, then done.
        </motion.h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            {i < STEPS.length - 1 && (
              <div className="hidden md:block absolute top-7 left-[calc(50%+3rem)] right-0 h-px bg-gradient-to-r from-border to-transparent" />
            )}
            <div className="text-5xl font-black gradient-text mb-4">{s.num}</div>
            <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/60 to-accent/8 p-12 text-center overflow-hidden"
      >
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-primary/10 blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Start syncing in 30 seconds.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Free forever. No setup beyond signing in with Google.
          </p>
          <Button
            size="xl"
            onClick={() => { window.location.href = getLoginUrl(); }}
            className="group"
          >
            <GoogleIcon />
            Get started — it's free
            <svg
              className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}