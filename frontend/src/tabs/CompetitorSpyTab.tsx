import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Target, Star, DollarSign, AlertCircle, ThumbsUp, Lightbulb, Activity, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { mockCompetitors, mockAudit } from "@/lib/mockData";
import { KitiMascot } from "@/components/KitiMascot";

export function CompetitorSpyTab({ data, analysisScore, isBuyer = false }: { data?: any, analysisScore?: number, isBuyer?: boolean }) {
  // Handle new structured data from backend or fallback to mock
  const competitorsData = data?.competitors || (Array.isArray(data) && data.length > 0 ? data : mockCompetitors);
  const marketAnalysis = data?.marketAnalysis;
  const isRealData = !!(data?.competitors || (Array.isArray(data) && data.length > 0));

  const chartData = [
    { name: isBuyer ? "This Item" : "You", score: analysisScore ?? mockAudit.overallScore },
    ...competitorsData.map((c: any) => ({ name: c.name.split(" ")[0] || "Comp", score: c.score })),
  ];

  // Old gap generation for buyer or fallback
  const generateGapItems = () => {
    if (!isRealData) {
      return [
        "Match competitor pricing tier ($29-32 range) for entry SKU",
        "Add bundled mineral oil — top 2 competitors include it",
        "Strengthen A+ content with lifestyle scenes",
        "Highlight unique product edge vs top competitor",
      ];
    }
    const topCompetitor = competitorsData[0];
    const items: string[] = [];
    const topPrice = parseFloat(String(topCompetitor.price).replace(/[^0-9.]/g, ''));
    if (!isNaN(topPrice)) {
      items.push(`Consider pricing within 10% of ${topCompetitor.name} (${topCompetitor.price}) to stay competitive`);
    }
    items.push('Add A+ Content (Enhanced Brand Content) — multiple competitors have it and it lifts conversion by 5-10%');
    items.push('Invest in lifestyle photography — competitors using it are winning on visual search');
    items.push(`Build review velocity — ${topCompetitor.name} has ${topCompetitor.reviews?.toLocaleString()} reviews vs your current count`);
    return items.slice(0, 4);
  };

  const gapItems = marketAnalysis?.suggestions?.length > 0 ? marketAnalysis.suggestions : generateGapItems();

  return (
    <div className="space-y-6">
      {/* Data source label */}
      {isRealData && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 w-fit">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {isBuyer ? "Showing alternative products from live search results" : "Showing live Amazon competitors & market analysis"}
        </div>
      )}

      {/* Seller Deep Analysis Header Sections */}
      {!isBuyer && marketAnalysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-[var(--primary-soft)] grid place-items-center">
                <Target className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-lg">Purchase Criteria (What they care about)</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {marketAnalysis.purchaseCriteria?.map((pc: any, i: number) => (
                <div key={i} className="bg-muted/30 rounded-xl p-3 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-foreground">{pc.factor}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${pc.importance === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{pc.importance}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{pc.description}</div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <h4 className="text-sm font-semibold mb-2">Market Comparison</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{marketAnalysis.comparison}</p>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp className="h-4 w-4 text-emerald-500" />
                <h3 className="font-semibold text-sm">Common Praises</h3>
              </div>
              <ul className="space-y-2">
                {marketAnalysis.commonPraises?.slice(0, 3).map((p: string, i: number) => (
                  <li key={i} className="text-xs flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /> <span className="text-muted-foreground">{p}</span></li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-rose-500" />
                <h3 className="font-semibold text-sm">Common Complaints</h3>
              </div>
              <ul className="space-y-2">
                {marketAnalysis.commonComplaints?.slice(0, 3).map((c: string, i: number) => (
                  <li key={i} className="text-xs flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" /> <span className="text-muted-foreground">{c}</span></li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* Competitors List */}
      <div className="flex items-center gap-2 mt-6">
        <h3 className="font-semibold text-lg">{isBuyer ? "Alternative Products" : "Top Competitors"}</h3>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {competitorsData.map((c: any, i: number) => (
          <motion.div
            key={c.name + i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <GlassCard hover className="h-full flex flex-col p-4">
              {/* Header: rank + score */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary-gradient grid place-items-center text-white text-[10px] font-bold shadow-soft shrink-0">
                    #{i + 1}
                  </div>
                </div>
                {!isBuyer && c.score && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-gradient tabular-nums">{c.score}</div>
                    <div className="text-[10px] text-muted-foreground">score</div>
                  </div>
                )}
              </div>
                            {/* Product image if available */}
              <div className="mb-4 aspect-square rounded-2xl bg-muted/40 p-2 relative overflow-hidden group">
                <img
                  src={c.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
                  alt={c.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'; }}
                />
                {isBuyer && c.whyBetter && (
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-[9px] text-white font-medium line-clamp-2 leading-tight">
                       ✨ {c.whyBetter}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="font-bold leading-snug text-sm line-clamp-2 mb-2">{c.name}</h3>

              <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-foreground text-base">{c.price}</span>
                <div className="flex flex-col items-end">
                  <span className="flex items-center gap-0.5 text-amber-600 font-bold text-xs">
                    <Star className="h-3 w-3 fill-current" />{c.rating}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{(c.reviews || 0).toLocaleString()} revs</span>
                </div>
              </div>

              {/* Specific details why it is better (Buyer focus) */}
              {isBuyer && (
                <div className="mt-auto space-y-2">
                   <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100/50">
                      <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mb-1">
                        <ThumbsUp className="h-3 w-3" /> Why it beats your pick:
                      </div>
                      <div className="text-[10px] text-emerald-900/80 leading-tight">
                        {c.whyBetter || (c.strengths?.[0] || 'Better value for money & higher rating')}
                      </div>
                   </div>
                   <a
                      href={`https://www.amazon.com/dp/${c.asin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1 py-2 rounded-xl bg-sky-500 text-white text-[10px] font-bold hover:bg-sky-600 transition-colors shadow-sm"
                    >
                      View on Amazon ↗
                    </a>
                </div>
              )}

              {/* Seller Mode exclusively shows estimated revenue */}
              {!isBuyer && c.estimatedRevenue && (
                <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Est. Rev/Mo</span>
                  <span className="font-bold text-emerald-600">${c.estimatedRevenue.toLocaleString()}</span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {!isBuyer && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl bg-[var(--sky-soft)] grid place-items-center">
                  <Trophy className="h-4 w-4 text-[var(--sky)]" />
                </div>
                <h3 className="font-semibold">Listing Score Comparison</h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 320)" vertical={false} />
                    <XAxis dataKey="name" stroke="oklch(0.5 0.03 290)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.5 0.03 290)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.02 320)", borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="score" fill="oklch(0.78 0.15 350)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {!isBuyer && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={isBuyer ? "md:col-span-2" : ""}>
            <GlassCard className="relative overflow-hidden h-full">
              <div className="absolute bottom-[-10px] right-[-10px] pointer-events-none opacity-40 z-0 scale-75">
                <KitiMascot type="curious" size={100} />
              </div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="h-8 w-8 rounded-xl bg-[var(--primary-soft)] grid place-items-center">
                  <Lightbulb className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <h3 className="font-semibold">Seller Action Plan</h3>
              </div>
              <div className="grid gap-3 relative z-10">
                {gapItems.map((item: string, i: number) => (
                  <div key={i} className="rounded-xl bg-soft-gradient border border-border/40 p-3 text-sm font-medium flex gap-3 items-start">
                    <span className="h-5 w-5 rounded-full bg-[var(--primary)] text-white text-[10px] grid place-items-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}