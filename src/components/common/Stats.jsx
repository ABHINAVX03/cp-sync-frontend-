import { motion } from "framer-motion";

const STATS = [
  { value: "4", label: "Platforms tracked" },
  { value: "24h", label: "Sync cadence" },
  { value: "0", label: "Duplicates ever" },
  { value: "100%", label: "Open source" },
];

export default function Stats() {
  return (
    <section className="border-y border-border bg-card/20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-4xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}