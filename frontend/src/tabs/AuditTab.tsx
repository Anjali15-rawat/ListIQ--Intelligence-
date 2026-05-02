import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Wrench, Sparkles, Star, TrendingUp, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { ScoreRing } from "@/components/ScoreRing";
import { MetricBar } from "@/components/MetricBar";
import { mockAudit } from "@/lib/mockData";
import { KitiMascot } from "@/components/KitiMascot";

const priorityStyles: Record<string, { badge: string; icon: string; bar: string }> = {
  high:   { badge: "bg-rose-100 text-rose-700 border border-rose-200",   icon: "🔴", bar: "bg-gradient-to-r from-rose-400 to-rose-500" },
  medium: { badge: "bg-amber-100 text-amber-700 border border-amber-200", icon: "🟡", bar: "bg-gradient-to-r from-amber-400 to-amber-500" },
  low:    { badge: "bg-sky-100 text-sky-700 border border-sky-200",       icon: "🔵", bar: "bg-gradient-to-r from-sky-400 to-sky-500" },
};

const severityConfig: Record<string, { dot: string; label: string }> = {
  high:   { dot: "bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]",  label: "Critical" },
  medium: { dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]", label: "Moderate" },
  low:    { dot: "bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.6)]",   label: "Minor" },
};

function verdictColor(verdict: string) {
  if (verdict === "Strong") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (verdict === "Needs Work") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export function AuditTab({ data }: { data?: any }) {
  const a = data || mockAudit;

  return (
    <div className="space-y-6">
      {/* Product header + score */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard className="h-full card-lift">
            <div className="flex gap-5">
              <div className="relative shrink-0">
                <img
                  src={a.product.image}
                  alt={a.product.title}
                  className="h-28 w-28 rounded-2xl object-cover shadow-soft"
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" title="Live data" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md">{a.product.asin}</span>
                  {a.product.bsr && <span className="text-xs text-muted-foreground">{a.product.bsr}</span>}
                </div>
                <h2 className="font-semibold text-lg leading-snug mt-2 line-clamp-2">{a.product.title}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm">
                  <span className="font-bold text-foreground text-base">{a.product.price}</span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-current" /> {a.product.rating}
                  </span>
                  <span className="text-muted-foreground">{(a.product.reviews || 0).toLocaleString()} reviews</span>
                </div>
                <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${verdictColor(a.verdict)}`}>
                  <Sparkles className="h-3 w-3" /> {a.verdict}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="h-full flex flex-col items-center justify-center relative overflow-hidden card-lift">
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ background: "conic-gradient(from 0deg, #e64980, #c084fc, #7ec8e3, #e64980)" }}
            />
            <div className="absolute top-2 right-2 pointer-events-none">
              <KitiMascot type={a.overallScore > 75 ? "happycheer" : "insightready"} size={72} />
            </div>
            <div className="relative z-10 pulse-ring rounded-full p-1">
              <ScoreRing score={a.overallScore} label="Overall" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Score breakdown + Pain points + What's working */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="h-full card-lift">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-8 rounded-xl bg-primary-gradient grid place-items-center shadow-soft">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold">Score breakdown</h3>
            </div>
            <div className="space-y-4">
              {a.factors.map((f: any, i: number) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                >
                  <MetricBar label={f.label} value={f.value} delay={0.1 * i} />
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Pain points */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="h-full card-lift">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-rose-100 grid place-items-center">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
              </div>
              <h3 className="font-semibold">Pain points</h3>
              <span className="ml-auto text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">
                {a.painPoints.length}
              </span>
            </div>
            <ul className="space-y-3">
              {a.painPoints.map((p: any, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex gap-3 text-sm group"
                >
                  {p.isReview ? (
                    // Real review quote — speech bubble icon
                    <>
                      <span className="text-rose-400 shrink-0 mt-0.5 text-base leading-none">"</span>
                      <span className="text-foreground/80 leading-relaxed italic group-hover:text-foreground transition-colors">{p.text?.replace(/^"|"$/g, '')}</span>
                    </>
                  ) : (
                    // Data-driven issue — dot
                    <>
                      <span className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${severityConfig[p.severity]?.dot || "bg-rose-500"}`} />
                      <span className="text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">{p.text}</span>
                    </>
                  )}
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>

        {/* What's working */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="h-full card-lift">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 grid place-items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="font-semibold">What's working</h3>
              <span className="ml-auto text-xs bg-emerald-100 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">
                {(a.whatsWorking || []).length}
              </span>
            </div>
            <ul className="space-y-3">
              {(a.whatsWorking || []).map((w: string, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="flex gap-3 text-sm group"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">{w}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recommended fixes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-8 w-8 rounded-xl bg-[var(--primary-soft)] grid place-items-center">
              <Wrench className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <h3 className="font-semibold">Recommended fixes</h3>
            <span className="ml-auto text-xs text-muted-foreground">{a.fixes.length} actions</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {a.fixes.map((f: any, i: number) => {
              const style = priorityStyles[f.priority] || priorityStyles.medium;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.05 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="rounded-2xl bg-card border border-border/50 p-4 flex items-start gap-3 shadow-soft hover:shadow-elegant transition-shadow cursor-default group"
                >
                  <span className="text-sm">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium leading-snug group-hover:text-[var(--primary)] transition-colors">{f.title}</div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${style.badge}`}>
                        {f.priority}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">{f.impact}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}