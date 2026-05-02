import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Target, Star } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { mockCompetitors, mockAudit } from "@/lib/mockData";
import { KitiMascot } from "@/components/KitiMascot";

export function CompetitorSpyTab({ data, analysisScore }: { data?: any, analysisScore?: number }) {
  // Use real API data when available, fall back to mock
  const competitorsData = (data && Array.isArray(data) && data.length > 0) ? data : mockCompetitors;
  const isRealData = data && Array.isArray(data) && data.length > 0;

  const chartData = [
    { name: "You", score: analysisScore ?? mockAudit.overallScore },
    ...competitorsData.map((c: any) => ({ name: c.name.split(" ")[0], score: c.score })),
  ];

  // Generate dynamic gap opportunities from real competitor data
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

    // Price gap
    const topPrice = parseFloat(String(topCompetitor.price).replace(/[^0-9.]/g, ''));
    if (!isNaN(topPrice)) {
      items.push(`Consider pricing within 10% of ${topCompetitor.name} (${topCompetitor.price}) to stay competitive`);
    }

    // Strengths gap
    const allStrengths = competitorsData.flatMap((c: any) => c.strengths || []);
    if (allStrengths.some((s: string) => s.toLowerCase().includes('a+'))) {
      items.push('Add A+ Content (Enhanced Brand Content) — multiple competitors have it and it lifts conversion by 5-10%');
    }
    if (allStrengths.some((s: string) => s.toLowerCase().includes('image') || s.toLowerCase().includes('lifestyle'))) {
      items.push('Invest in lifestyle photography — competitors using it are winning on visual search');
    }
    if (allStrengths.some((s: string) => s.toLowerCase().includes('review'))) {
      items.push(`Build review velocity — ${topCompetitor.name} has ${topCompetitor.reviews?.toLocaleString()} reviews vs your current count`);
    }

    // Always add a keyword tip
    items.push('Run a keyword gap analysis against top competitor ASINs and add missing terms to your backend search terms');

    return items.slice(0, 4);
  };

  const gapItems = generateGapItems();

  return (
    <div className="space-y-6">
      {/* Data source label */}
      {isRealData && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 w-fit">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Showing real Amazon competitors from live search results
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {competitorsData.map((c: any, i: number) => (
          <motion.div
            key={c.name + i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <GlassCard hover className="h-full flex flex-col">
              {/* Header: rank + score */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary-gradient grid place-items-center text-white text-xs font-bold shadow-soft shrink-0">
                    #{i + 1}
                  </div>
                  {c.isReal && (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gradient tabular-nums">{c.score}</div>
                  <div className="text-xs text-muted-foreground">score</div>
                </div>
              </div>

              {/* Product image if real */}
              {c.image && (
                <div className="mb-3 flex justify-center">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-20 w-20 object-contain rounded-xl bg-muted/40 p-1"
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              <h3 className="font-semibold leading-snug text-sm line-clamp-2 flex-1">{c.name}</h3>

              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="font-bold text-foreground">{c.price}</span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Star className="h-3 w-3 fill-current" />{c.rating}
                </span>
                <span>{(c.reviews || 0).toLocaleString()} reviews</span>
              </div>

              {c.asin && (
                <a
                  href={`https://www.amazon.com/dp/${c.asin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-[10px] text-[var(--primary)] hover:underline font-mono"
                >
                  {c.asin} ↗
                </a>
              )}

              <div className="mt-4 space-y-2">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 mb-1">Strengths</div>
                  {(c.strengths || []).map((s: string) => (
                    <div key={s} className="text-xs text-foreground/70 leading-relaxed">+ {s}</div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-semibold text-rose-600 mb-1 mt-2">Weaknesses</div>
                  {(c.weaknesses || []).map((w: string) => (
                    <div key={w} className="text-xs text-foreground/70 leading-relaxed">− {w}</div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl bg-[var(--sky-soft)] grid place-items-center">
              <Trophy className="h-4 w-4 text-[var(--sky)]" />
            </div>
            <h3 className="font-semibold">Score comparison</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 320)" vertical={false} />
                <XAxis dataKey="name" stroke="oklch(0.5 0.03 290)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0.03 290)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.02 320)", borderRadius: 12 }} />
                <Bar dataKey="score" fill="oklch(0.78 0.15 350)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-4 right-4 pointer-events-none opacity-90 z-0">
            <KitiMascot type="curious" size={80} />
          </div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="h-8 w-8 rounded-xl bg-[var(--primary-soft)] grid place-items-center">
              <Target className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <h3 className="font-semibold">Gap opportunities & action plan</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {gapItems.map((item, i) => (
              <div key={i} className="rounded-2xl bg-soft-gradient border border-border/40 p-4 text-sm font-medium">
                <span className="text-[var(--primary)] mr-2">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}