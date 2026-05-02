import { motion } from "framer-motion";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { mockTimeMachine } from "@/lib/mockData";
import { KitiMascot } from "@/components/KitiMascot";

const trendBadge: Record<string, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-sky-100 text-sky-700",
};

export function TimeMachineTab({ data }: { data?: any }) {
  const t = data || mockTimeMachine;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Sentiment trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 7 months · % of reviews</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Positive</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Negative</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={t.sentimentTrend}>
                <defs>
                  <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.16 160)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.72 0.16 160)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 320)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.5 0.03 290)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0.03 290)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.02 320)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="positive" stroke="oklch(0.72 0.16 160)" strokeWidth={2.5} fill="url(#posGrad)" />
                <Area type="monotone" dataKey="negative" stroke="oklch(0.65 0.22 25)" strokeWidth={2.5} fill="url(#negGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-8 rounded-xl bg-amber-100 grid place-items-center">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
              <h3 className="font-semibold">Emerging complaints</h3>
            </div>
            <ul className="space-y-3">
              {t.emergingIssues.map((i, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center justify-between rounded-2xl bg-card/60 border border-border/60 p-3 text-sm"
                >
                  <span className="font-medium">{i.issue}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trendBadge[i.severity]}`}>{i.trend}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="h-full relative overflow-hidden">
            <div className="absolute top-4 right-4 pointer-events-none opacity-90">
              <KitiMascot type="thinking" size={70} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-[var(--lavender-soft)] grid place-items-center">
                <AlertCircle className="h-4 w-4 text-[var(--lavender)]" />
              </div>
              <h3 className="font-semibold">AI summary</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{t.summary}</p>

            <div className="mt-5 flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-[var(--primary)]" />
              <h4 className="text-sm font-semibold">Suggested updates</h4>
            </div>
            <ul className="space-y-2">
              {t.suggested.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/80">
                  <span className="text-[var(--primary)]">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}