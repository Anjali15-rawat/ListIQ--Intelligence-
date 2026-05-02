import { motion } from "framer-motion";

interface MetricBarProps {
  label: string;
  value: number;
  delay?: number;
}

export function MetricBar({ label, value, delay = 0 }: MetricBarProps) {
  const tone = value >= 80 ? "bg-[var(--success)]" : value >= 60 ? "bg-[var(--warning)]" : "bg-destructive";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground/80">{label}</span>
        <span className="font-semibold tabular-nums text-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${tone}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}