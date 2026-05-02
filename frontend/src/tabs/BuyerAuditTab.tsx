import { motion } from "framer-motion";
import { ShoppingCart, Star, CheckCircle2, AlertTriangle, TrendingUp, Users, ThumbsUp, ThumbsDown } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { ScoreRing } from "@/components/ScoreRing";
import { mockAudit } from "@/lib/mockData";

function BuyerScoreLabel(score: number) {
  if (score >= 80) return { label: "Highly Recommended", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  if (score >= 60) return { label: "Worth Considering", color: "text-amber-600 bg-amber-50 border-amber-200" };
  return { label: "Proceed with Caution", color: "text-rose-600 bg-rose-50 border-rose-200" };
}

export function BuyerAuditTab({ data }: { data?: any }) {
  const a = data || mockAudit;
  const { label, color } = BuyerScoreLabel(a.overallScore);

  // Translate seller pain points into buyer-relevant questions
  const buyerConcerns = (a.painPoints || []).map((p: any) => {
    const text = typeof p === "string" ? p : p.text;
    return text;
  });

  const buyerPros = (a.whatsWorking || []);

  return (
    <div className="space-y-6">
      {/* Product overview for buyer */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard className="h-full card-lift">
            <div className="flex gap-5">
              <img src={a.product.image} alt={a.product.title} className="h-28 w-28 rounded-2xl object-cover shadow-soft shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md">{a.product.asin}</span>
                </div>
                <h2 className="font-semibold text-lg leading-snug mt-2 line-clamp-2">{a.product.title}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm">
                  <span className="font-bold text-foreground text-base">{a.product.price}</span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-current" /> {a.product.rating}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {(a.product.reviews || 0).toLocaleString()} verified buyers
                  </span>
                </div>
                <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${color}`}>
                  <ShoppingCart className="h-3 w-3" /> {label}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Buyer trust score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="h-full flex flex-col items-center justify-center card-lift relative overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ background: "conic-gradient(from 0deg, #7ec8e3, #c084fc, #e64980, #7ec8e3)" }}
            />
            <div className="relative z-10 text-center">
              <ScoreRing score={a.overallScore} label="Trust Score" />
              <p className="mt-2 text-xs text-muted-foreground px-4 text-center">Based on listing quality & buyer feedback</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Pros and Concerns for buyer */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="h-full card-lift">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 grid place-items-center">
                <ThumbsUp className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="font-semibold">Why buyers like this</h3>
              <span className="ml-auto text-xs bg-emerald-100 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">{buyerPros.length}</span>
            </div>
            <ul className="space-y-3">
              {buyerPros.map((w: string, i: number) => (
                <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }} className="flex gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 leading-relaxed">{w}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="h-full card-lift">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-rose-100 grid place-items-center">
                <ThumbsDown className="h-4 w-4 text-rose-600" />
              </div>
              <h3 className="font-semibold">Buyer concerns</h3>
              <span className="ml-auto text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">{buyerConcerns.length}</span>
            </div>
            <ul className="space-y-3">
              {buyerConcerns.map((text: string, i: number) => (
                <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.06 }} className="flex gap-3 text-sm">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 leading-relaxed">{text}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      {/* Buyer score breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-8 w-8 rounded-xl bg-sky-100 grid place-items-center">
              <TrendingUp className="h-4 w-4 text-sky-600" />
            </div>
            <h3 className="font-semibold">What the listing signals to you as a buyer</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(a.factors || []).map((f: any, i: number) => {
              const pct = typeof f.value === "number" ? (f.value <= 10 ? f.value * 10 : f.value) : 0;
              const color = pct >= 70 ? "from-emerald-400 to-emerald-500" : pct >= 50 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500";
              const buyerLabel: Record<string, string> = {
                "Title Optimization":   "Clear product description",
                "Rating & Sentiment":   "Buyer satisfaction",
                "Review Volume":        "Purchase popularity",
                "Feature Bullets":      "Information quality",
                "Pricing":              "Value for money",
              };
              return (
                <motion.div key={f.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.05 }} className="rounded-2xl bg-card border border-border/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{buyerLabel[f.label] || f.label}</span>
                    <span className="text-sm font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                    />
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
