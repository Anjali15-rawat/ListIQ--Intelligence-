import {
  LayoutDashboard,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  Lightbulb,
  Target,
  CheckCircle2,
  Store,
  Activity,
  Search,
  MousePointerClick,
  Brain,
  Megaphone,
  CheckSquare,
  Zap,
  Crosshair,
  BarChart2,
  Star,
  Image as ImageIcon,
  Smartphone,
  HelpCircle,
  ArrowUpRight,
  TrendingDown,
  Eye,
  PenTool,
  Sparkles,
  X,
  Loader2
} from "lucide-react";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  PieChart, Pie, Cell
} from "recharts";

import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

function InteractiveButton({ children, className, variant = "default", size = "default", onClick, resultText }: any) {
  const [status, setStatus] = useState<'idle'|'loading'|'done'>('idle');
  const [showResult, setShowResult] = useState(false);
  const handleClick = async () => {
    if (status !== 'idle') return;
    setStatus('loading');
    if (onClick) await onClick();
    else await new Promise(r => setTimeout(r, 1500));
    setStatus('done');
    const msg = resultText || "Action completed successfully!";
    toast.success(msg, { duration: 4000 });
    setShowResult(true);
    setTimeout(() => { setStatus('idle'); setShowResult(false); }, 4000);
  };
  const isFullWidth = className?.includes('w-full');
  return (
    <div className={isFullWidth ? "w-full" : "inline-block"}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className={isFullWidth ? "w-full" : "inline-block"}>
        <Button variant={variant} size={size} className={className} onClick={handleClick} disabled={status !== 'idle'}>
          {status === 'loading' ? <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> : status === 'done' ? <CheckCircle2 className="w-4 h-4 mr-2 inline text-emerald-300" /> : null}
          {status === 'done' ? 'Done ✓' : children}
        </Button>
      </motion.div>
      {showResult && resultText && (
        <motion.div initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0 }} className="mt-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <span>{resultText}</span>
        </motion.div>
      )}
    </div>
  );
}

import { mockCompetitors, mockAudit } from "@/lib/mockData";

const CHART_COLORS = {
  primary: "oklch(0.62 0.17 155)",
  secondary: "oklch(0.72 0.16 160)",
  accent: "oklch(0.78 0.15 350)",
  danger: "oklch(0.65 0.22 25)",
  warning: "oklch(0.8 0.15 70)",
  info: "oklch(0.6 0.12 240)",
  success: "oklch(0.6 0.15 150)",
};

export function SellerDashboardTab({ activeTab, onTabChange, auditData, timelineData, competitorData }: { activeTab: string, onTabChange: (tab: string) => void, auditData: any, timelineData: any, competitorData: any }) {
  const isRealData = !!(competitorData?.competitors?.length);
  const mainProduct = isRealData ? (competitorData?.mainProduct || {}) : { estimatedRevenue: 12450 };
  const competitors = isRealData ? competitorData.competitors : mockCompetitors;
  const audit = auditData || mockAudit;

  const mainRevenue = mainProduct.estimatedRevenue || 12450;
  const currency = mainProduct.currency?.symbol || '$';

  return (
    <div className="space-y-8 pb-10">
      {/* Dynamic Product Context Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <GlassCard className="bg-gradient-to-r from-[var(--primary-soft)]/40 to-transparent border-[var(--primary)]/10 shadow-sm relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
            <Store className="w-64 h-64 text-[var(--primary)]" />
          </div>
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left relative z-10">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-white shadow-soft shrink-0 border border-border/50 p-2">
              <img
                src={mainProduct.image || audit?.product?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'}
                alt="Product"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--primary)] text-white px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(230,73,128,0.3)]">Active Dashboard</span>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/50">{mainProduct.asin || audit?.product?.asin || 'B0CRX98LYP'}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Last updated: Today, 10:30 AM</span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground line-clamp-1 tracking-tight">{mainProduct.title || audit?.product?.title || 'Shoetopia Women Lace Up Sneaker Shoes'}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm">
                <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">{currency}{mainProduct.price || audit?.product?.price || '29.99'}</span>
                <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100"><Star className="w-3.5 h-3.5 fill-amber-500" /> {mainProduct.rating || audit?.product?.rating || '4.2'}</span>
                <span className="font-semibold text-muted-foreground">{(mainProduct.reviewsCount || audit?.product?.reviews || 470).toLocaleString()} reviews</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Render correct tab content */}
      {activeTab === "overview" && <OverviewTab currency={currency} mainRevenue={mainRevenue} score={audit.overallScore || 78} audit={audit} competitors={competitors} mainProduct={mainProduct} onTabChange={onTabChange} />}
      {activeTab === "competitors" && <CompetitorsTab currency={currency} competitors={competitors} mainProduct={mainProduct} onTabChange={onTabChange} />}
      {activeTab === "revenue" && <RevenueTab currency={currency} mainRevenue={mainRevenue} competitors={competitors} mainProduct={mainProduct} />}
      {activeTab === "insights" && <CustomerInsightsTab audit={audit} onTabChange={onTabChange} />}
      {activeTab === "listing" && <ListingOptimizationTab mainProduct={mainProduct} competitors={competitors} audit={audit} />}
      {activeTab === "seo" && <SeoTab competitors={competitors} mainProduct={mainProduct} onTabChange={onTabChange} />}
      {activeTab === "aeo" && <AeoTab competitors={competitors} mainProduct={mainProduct} />}
      {activeTab === "ads" && <AdsTab currency={currency} competitors={competitors} />}
      {activeTab === "actions" && <ActionsTab currency={currency} audit={audit} competitors={competitors} />}

    </div>
  );
}

// ----------------------------------------------------------------------
// 1. OVERVIEW TAB
// ----------------------------------------------------------------------
function OverviewTab({ currency, mainRevenue, score, audit, competitors, mainProduct, onTabChange }: { currency: string, mainRevenue: number, score: number, audit: any, competitors: any[], mainProduct: any, onTabChange: (t:string)=>void }) {
  const getGrade = (s: number) => s >= 90 ? 'A+' : s >= 80 ? 'A' : s >= 70 ? 'B' : s >= 60 ? 'C' : 'F';
  const getGradeColor = (s: number) => s >= 80 ? 'text-emerald-500' : s >= 70 ? 'text-amber-500' : 'text-rose-500';
  const getBgColor = (s: number) => s >= 80 ? 'bg-emerald-50 border-emerald-200' : s >= 70 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200';

  const subscores = [
    { label: "Images", value: 82 }, { label: "Title", value: 65 }, { label: "SEO", value: 72 },
    { label: "Reviews", value: 55 }, { label: "Price", value: 74 }, { label: "A+ Content", value: 60 },
    { label: "Conversion", value: 42 }, { label: "AEO", value: 71 }
  ];

  const revOpps = [
    { name: "Images", val: 52000, color: CHART_COLORS.success },
    { name: "Title", val: 31000, color: CHART_COLORS.warning },
    { name: "SEO/Keywords", val: 44000, color: CHART_COLORS.info },
    { name: "Ads Optimization", val: 67000, color: CHART_COLORS.primary },
    { name: "Reviews", val: 28000, color: CHART_COLORS.danger },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listing Report Card */}
        <GlassCard className="col-span-1 lg:col-span-2 shadow-elegant border-border/40">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-[var(--primary)]" /> Listing Report Card
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className={`shrink-0 w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-inner ${getBgColor(score)}`}>
              <span className={`text-4xl font-black ${getGradeColor(score)}`}>{getGrade(score)}</span>
              <span className="text-xs font-bold text-muted-foreground">{score}/100</span>
            </div>
            <div className="grid grid-cols-4 gap-3 flex-1 w-full">
              {subscores.map(s => (
                <div key={s.label} className="bg-muted/30 rounded-xl p-2.5 flex flex-col items-center text-center border border-border/40 hover:bg-muted/60 transition-colors">
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">{s.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`font-bold text-lg ${getGradeColor(s.value)}`}>{s.value}</span>
                    <span className={`text-[10px] font-black ${getGradeColor(s.value)}`}>{getGrade(s.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Action Highlights */}
        <div className="space-y-6 flex flex-col justify-between">
          <GlassCard className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 shadow-sm flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Biggest Growth Lever</h3>
                <div className="text-lg font-black text-amber-900 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-amber-600" /> Fix Images</div>
                <div className="text-sm font-bold text-emerald-600 mt-1">+{currency}52,000 /mo <span className="text-[10px] font-normal text-muted-foreground">potential</span></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <InteractiveButton className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white shadow-sm rounded-xl" onClick={() => onTabChange('actions')} resultText="Navigating to Action Center — see your prioritized execution plan below.">View Action Plan</InteractiveButton>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200/50 shadow-sm flex-1 relative">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-2">AEO Visibility Score</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-3xl font-black text-sky-900">42<span className="text-sm font-bold text-sky-700/50">/100</span></div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[10px] font-bold"><span className="text-muted-foreground">ChatGPT</span> <span className="text-rose-500">Not shown ✗</span></div>
                <div className="flex justify-between text-[10px] font-bold"><span className="text-muted-foreground">Claude</span> <span className="text-emerald-500">Rank #6 ✓</span></div>
                <div className="flex justify-between text-[10px] font-bold"><span className="text-muted-foreground">Gemini</span> <span className="text-emerald-500">Rank #3 ✓</span></div>
              </div>
            </div>
            <InteractiveButton size="sm" className="w-full text-[10px] h-7 bg-sky-500 hover:bg-sky-600 text-white rounded-lg" onClick={() => onTabChange('aeo')} resultText="Opening AI Search (AEO) tab — optimize how ChatGPT, Claude & Gemini rank your product.">Improve AEO Ranking</InteractiveButton>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Opportunity Map */}
        <GlassCard>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Revenue Opportunity Map</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revOpps} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="oklch(0.92 0.02 320)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "oklch(0.5 0.05 250)" }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v: number) => [`+${currency}${v.toLocaleString()}/mo`, "Potential"]} />
                <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={16}>
                  {revOpps.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Top 3 Quick Wins */}
        <GlassCard>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Top 3 Quick Wins</h3>
          <div className="space-y-3">
            {[
              { id: 1, task: "Add 5 lifestyle images", impact: "+52,000/mo", effort: "Low", time: "1-2 days" },
              { id: 2, task: "Rewrite product title", impact: "+31,000/mo", effort: "Low", time: "1 day" },
              { id: 3, task: "Add high-volume keywords", impact: "+44,000/mo", effort: "Medium", time: "2 days" },
            ].map((w) => (
              <div key={w.id} className="flex gap-3 items-start p-3 rounded-xl bg-muted/40 border border-border/50 hover:bg-white transition-colors cursor-pointer group">
                <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{w.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground group-hover:text-[var(--primary)] transition-colors">{w.task}</div>
                  <div className="flex gap-3 mt-1 text-[10px] font-semibold">
                    <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Impact: {currency}{w.impact}</span>
                    <span className="text-muted-foreground">Effort: {w.effort}</span>
                    <span className="text-muted-foreground text-right ml-auto">{w.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <InteractiveButton variant="ghost" size="sm" className="w-full text-xs text-[var(--primary)] mt-2" onClick={() => onTabChange('actions')} resultText="Opening Action Center with 8 prioritized tasks worth +$212K/mo total.">View All Actions</InteractiveButton>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 2. COMPETITORS TAB
// ----------------------------------------------------------------------
function CompetitorsTab({ currency, competitors, mainProduct }: { currency: string, competitors: any[], mainProduct: any }) {
  const topComp = competitors[0] || {};
  const trendData = [
    { month: 'Jun', pos: 80, neg: 15 }, { month: 'Jul', pos: 82, neg: 12 }, { month: 'Aug', pos: 76, neg: 18 },
    { month: 'Sep', pos: 70, neg: 25 }, { month: 'Oct', pos: 68, neg: 28 }, { month: 'Nov', pos: 74, neg: 22 },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Product Sentiment Trend</h3>
              <p className="text-xs text-muted-foreground mt-1">Are you improving or declining?</p>
            </div>
            <div className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-100 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> Negative reviews ↑ 32% (sizing issue)
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3} /><stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} /></linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.3} /><stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.02 320)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="pos" stroke={CHART_COLORS.success} fillOpacity={1} fill="url(#colorPos)" name="Positive" />
                <Area type="monotone" dataKey="neg" stroke={CHART_COLORS.danger} fillOpacity={1} fill="url(#colorNeg)" name="Negative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Competitor Gap Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                <tr><th className="px-3 py-2 rounded-tl-lg">Metric</th><th className="px-3 py-2">You</th><th className="px-3 py-2 text-[var(--primary)] font-bold">Top Competitor</th><th className="px-3 py-2 rounded-tr-lg">Gap Score</th></tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  { metric: "Images count", you: "1", comp: "7", gap: "-6", danger: true },
                  { metric: "Reviews", you: (mainProduct.reviewsCount || 0).toLocaleString(), comp: (topComp.reviews || 0).toLocaleString(), gap: `${(mainProduct.reviewsCount || 0) < (topComp.reviews || 0) ? '-' : '+'}${Math.abs((mainProduct.reviewsCount || 0) - (topComp.reviews || 0)).toLocaleString()}`, danger: (mainProduct.reviewsCount || 0) < (topComp.reviews || 0) },
                  { metric: "Rating", you: mainProduct.rating || 0, comp: topComp.rating || 0, gap: `${((mainProduct.rating || 0) - (topComp.rating || 0)).toFixed(1)} ★`, danger: (mainProduct.rating || 0) < (topComp.rating || 0) },
                  { metric: "Title length", you: (mainProduct.title || '').length, comp: (topComp.name || '').length, gap: `${(mainProduct.title || '').length - (topComp.name || '').length} chars`, danger: (mainProduct.title || '').length < 100 },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-2.5 font-medium">{r.metric}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{r.you}</td>
                    <td className="px-3 py-2.5 font-bold text-foreground">{r.comp}</td>
                    <td className={`px-3 py-2.5 font-bold ${r.danger ? 'text-rose-500' : 'text-amber-500'}`}>{r.gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Competitor War Snapshot</h3>
          <InteractiveButton variant="ghost" size="sm" className="text-xs h-7 text-[var(--primary)]" resultText="Full competitor list loaded — showing price, rating, review count & strategy gaps for all tracked rivals.">View All Competitors</InteractiveButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {competitors.slice(0, 3).map((comp, i) => (
            <div key={i} className="p-4 rounded-xl border border-border/50 bg-gradient-to-b from-white to-muted/20 hover:shadow-elegant transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">Rank #{i+1}</span>
                <span className="text-xs font-bold text-emerald-600">{currency}{(comp.estimatedRevenue || 12000).toLocaleString()}/mo</span>
              </div>
              <h4 className="font-bold text-sm mb-3 line-clamp-2" title={comp.name}>{comp.name}</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="font-semibold text-amber-500">{comp.rating} ★</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Reviews</span><span className="font-semibold text-foreground">{(comp.reviews || 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-bold text-emerald-600">{comp.price}</span></div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 3. REVENUE TAB
// ----------------------------------------------------------------------
function RevenueTab({ currency, mainRevenue, competitors, mainProduct }: { currency: string, mainRevenue: number, competitors: any[], mainProduct: any }) {
  const basePrice = mainProduct?.price || 29.99;
  
  const pieData = [
    { name: 'Weak Images', value: 40, color: CHART_COLORS.danger },
    { name: 'Poor SEO', value: 30, color: CHART_COLORS.warning },
    { name: 'Low Reviews', value: 30, color: CHART_COLORS.info }
  ];

  const [testPrice, setTestPrice] = useState(basePrice + 3);
  const diffPct = (testPrice - basePrice) / basePrice;
  const convChange = -(diffPct * 1.5 * 100); 
  const estSales = 1500;
  const baseProfit = (basePrice - 12) * estSales;
  const newSales = estSales * (1 + (convChange / 100));
  const newProfit = (testPrice - 12) * newSales;
  const profitImpact = newProfit - baseProfit;

  const [showPlan, setShowPlan] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1 border-rose-200/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-1">Your Revenue Loss Breakdown</h3>
          <p className="text-xs text-rose-600/70 mb-4 font-medium">You are losing ~{currency}9.5k / mo due to:</p>
          <div className="space-y-4">
            {pieData.map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold">{d.name}</span>
                  <span className="text-muted-foreground">{d.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
          {!showPlan ? (
            <InteractiveButton variant="outline" className="w-full mt-6 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => setShowPlan(true)} resultText="Recovery plan generated! Expanding below...">How to Recover This?</InteractiveButton>
          ) : (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-4 border-t border-rose-200/50">
              <h4 className="text-[10px] font-bold text-rose-800 uppercase tracking-wider mb-3">30-Day Recovery Execution</h4>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-rose-600">1</span></div>
                  <div><div className="text-sm font-bold">Fix Image Strategy</div><div className="text-xs text-muted-foreground mt-0.5">Add 1 lifestyle image & 1 size chart. <br/><span className="text-emerald-600 font-semibold text-[10px]">Est: +$3.8K/mo</span></div></div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-rose-600">2</span></div>
                  <div><div className="text-sm font-bold">Close SEO Gaps</div><div className="text-xs text-muted-foreground mt-0.5">Integrate 5 missing competitor keywords.<br/><span className="text-emerald-600 font-semibold text-[10px]">Est: +$2.9K/mo</span></div></div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-rose-600">3</span></div>
                  <div><div className="text-sm font-bold">Boost Review Velocity</div><div className="text-xs text-muted-foreground mt-0.5">Enroll in Vine to improve star rating.<br/><span className="text-emerald-600 font-semibold text-[10px]">Est: +$2.8K/mo</span></div></div>
                </div>
              </div>
            </motion.div>
          )}
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Market Position</h3>
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-border/40">
            <div>
              <div className="text-4xl font-black text-foreground">#12</div>
              <div className="text-xs text-muted-foreground mt-1">out of 58 listings</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-500">4.2%</div>
              <div className="text-xs text-muted-foreground mt-1">Market Share</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[var(--primary)] mt-2">Need +{currency}6.3k</div>
              <div className="text-xs text-muted-foreground mt-1">To reach Top 3</div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Price Simulator</h3>
        <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50/20 border border-sky-100 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full">
            <div className="flex justify-between mb-2"><span className="font-bold text-sm">Test Price point</span><span className="font-black text-[var(--primary)]">{currency}{testPrice.toFixed(2)}</span></div>
            <input type="range" className="w-full accent-[var(--primary)] h-2 bg-white rounded-lg appearance-none cursor-pointer border border-border" min={Math.max(1, basePrice - 20)} max={basePrice + 20} step="0.5" value={testPrice} onChange={(e) => setTestPrice(Number(e.target.value))} />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2"><span>Min: {currency}{Math.max(1, basePrice - 20).toFixed(2)}</span><span>Current: {currency}{basePrice.toFixed(2)}</span><span>Max: {currency}{(basePrice + 20).toFixed(2)}</span></div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-24 transition-colors">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Conv. Change</div>
              <div className={`text-lg font-black ${convChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{convChange > 0 ? '+' : ''}{convChange.toFixed(1)}%</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-24 transition-colors">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Profit Impact</div>
              <div className={`text-lg font-black ${profitImpact >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{profitImpact > 0 ? '+' : ''}{currency}{(profitImpact / 1000).toFixed(1)}k</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 4. CUSTOMER INSIGHTS TAB
// ----------------------------------------------------------------------
function CustomerInsightsTab({ audit, onTabChange }: { audit: any, onTabChange: (t: string) => void }) {
  const [vocTab, setVocTab] = useState<'working'|'broken'>('working');
  
  const praises = audit?.product?.praises || [];
  const complaints = audit?.product?.complaints || [];

  const workingData = praises.length >= 3 ? praises.slice(0, 3).map((p: string, i: number) => ({
    theme: ["Quality", "Value", "Performance"][i] || "Feature",
    pct: `${35 - i * 5}%`,
    quote: p,
    color: "text-emerald-600 bg-emerald-50", border: "border-emerald-400", pctColor: "text-emerald-600"
  })) : [
    { theme: "Quality Build", pct: "35%", quote: praises[0] || "Feels premium and sturdy.", color: "text-emerald-600 bg-emerald-50", border: "border-emerald-400", pctColor: "text-emerald-600" },
    { theme: "Functionality", pct: "28%", quote: praises[1] || "Does exactly what it says.", color: "text-emerald-600 bg-emerald-50", border: "border-emerald-400", pctColor: "text-emerald-600" },
    { theme: "Value", pct: "18%", quote: praises[2] || "Great price for what you get.", color: "text-emerald-600 bg-emerald-50", border: "border-emerald-400", pctColor: "text-emerald-600" }
  ];
  
  const brokenData = complaints.length >= 3 ? complaints.slice(0, 3).map((c: string, i: number) => ({
    theme: ["Defect", "Expectation", "Usability"][i] || "Issue",
    pct: `${23 - i * 5}%`,
    quote: c,
    color: "text-rose-600 bg-rose-50", border: "border-rose-400", pctColor: "text-rose-600"
  })) : [
    { theme: "Reliability", pct: "23%", quote: complaints[0] || "Stopped working after a few weeks.", color: "text-rose-600 bg-rose-50", border: "border-rose-400", pctColor: "text-rose-600" },
    { theme: "Expectations", pct: "14%", quote: complaints[1] || "Smaller than it looked in pictures.", color: "text-rose-600 bg-rose-50", border: "border-rose-400", pctColor: "text-rose-600" },
    { theme: "Packaging", pct: "8%", quote: complaints[2] || "Arrived in a damaged box.", color: "text-rose-600 bg-rose-50", border: "border-rose-400", pctColor: "text-rose-600" }
  ];

  const activeVocData = vocTab === 'working' ? workingData : brokenData;

  const [showAllInsights, setShowAllInsights] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [sizeChartGenerated, setSizeChartGenerated] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex justify-between items-center mb-4 border-b border-border/40 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Voice of Customer</h3>
            <div className="flex gap-2">
              <button onClick={() => setVocTab('working')} className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${vocTab === 'working' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}>What's Working</button>
              <button onClick={() => setVocTab('broken')} className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${vocTab === 'broken' ? 'bg-rose-50 text-rose-600 shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}>What's Broken</button>
            </div>
          </div>
          <div className="space-y-4 min-h-[180px]">
            {activeVocData.map((v, i) => (
              <motion.div key={v.theme} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`flex justify-between items-start border-l-2 ${v.border} pl-3`}>
                <div>
                  <div className="font-bold text-sm text-foreground">{v.theme}</div>
                  <div className="text-xs text-muted-foreground italic mt-0.5">"{v.quote}"</div>
                </div>
                <div className={`text-sm font-black px-2 py-0.5 rounded ${v.color}`}>{v.pct}</div>
              </motion.div>
            ))}
            {showAllInsights && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground font-medium mb-2">Additional Insights Found (Secondary):</div>
                <div className={`flex justify-between items-start border-l-2 ${vocTab==='working' ? 'border-emerald-200' : 'border-rose-200'} pl-3 mb-2 opacity-80`}>
                  <div><div className="font-bold text-xs text-foreground">{vocTab==='working' ? 'Packaging' : 'Delivery Time'}</div><div className="text-[10px] text-muted-foreground italic mt-0.5">"{vocTab==='working' ? 'Great gift box.' : 'Took too long.'}"</div></div>
                  <div className={`text-xs font-black px-1.5 py-0.5 rounded ${vocTab==='working' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>8%</div>
                </div>
              </motion.div>
            )}
          </div>
          {!showAllInsights && <InteractiveButton variant="ghost" size="sm" className="w-full text-[10px] text-[var(--primary)] mt-3" onClick={() => setShowAllInsights(true)} resultText="Expanded view: 12 customer themes analyzed across 470+ reviews. Top praise: Comfort (35%). Top complaint: Sizing (23%).">View All Insights</InteractiveButton>}
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Buyer Decision Drivers</h3>
          <div className="space-y-3">
            {[
              { rank: 1, factor: workingData[0].theme, imp: "High", color: "text-emerald-600 bg-emerald-50" },
              { rank: 2, factor: workingData[1].theme, imp: "High", color: "text-emerald-600 bg-emerald-50" },
              { rank: 3, factor: brokenData[0].theme, imp: "Medium", color: "text-amber-600 bg-amber-50" },
              { rank: 4, factor: "Price", imp: "Medium", color: "text-amber-600 bg-amber-50" },
              { rank: 5, factor: "Brand", imp: "Low", color: "text-slate-600 bg-slate-100" },
              ...(showFullAnalysis ? [
                { rank: 6, factor: "Warranty", imp: "Low", color: "text-slate-600 bg-slate-100" },
                { rank: 7, factor: "Packaging", imp: "Low", color: "text-slate-600 bg-slate-100" }
              ] : [])
            ].map(d => (
              <div key={d.rank} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">{d.rank}</span>
                  <span className="text-sm font-semibold">{d.factor}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${d.color}`}>{d.imp}</span>
              </div>
            ))}
          </div>
          {!showFullAnalysis && <InteractiveButton variant="ghost" size="sm" className="w-full text-[10px] text-[var(--primary)] mt-3" onClick={() => setShowFullAnalysis(true)} resultText="Full buyer decision analysis: Comfort (35%) and Style (28%) drive purchases. Price sensitivity is medium — quality messaging beats discounting.">View Full Analysis</InteractiveButton>}
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className={`border-rose-200/50 transition-colors ${sizeChartGenerated ? 'bg-emerald-50/50 border-emerald-200' : 'bg-gradient-to-br from-rose-50/30 to-transparent'}`}>
          {!sizeChartGenerated ? (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-800 mb-1">Missed Expectations Alert</h3>
                <p className="text-xs text-rose-900/80 mb-3 font-medium">23% of recent customers complain about <strong className="text-rose-600">{brokenData[0].theme}</strong>.</p>
                <InteractiveButton size="sm" className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-8 text-xs" onClick={() => setSizeChartGenerated(true)} resultText={`Resolution guide generated! Add an infographic addressing ${brokenData[0].theme}. Expected impact: -15% return rate.`}>Create Resolution Infographic</InteractiveButton>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-800 mb-1">Asset Generated</h3>
                <p className="text-xs text-emerald-900/80 font-medium">A new visual guide has been added to your image gallery queue to address the top complaint.</p>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Review Velocity Tracker</h3>
            <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Negative spike detected</span>
          </div>
          <div className="text-[10px] text-muted-foreground mb-4">Last 30 Days</div>
          <div className="h-24 flex items-end gap-1 w-full opacity-60 hover:opacity-100 transition-opacity">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className={`flex-1 rounded-t-sm ${i > 25 ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{ height: `${Math.random() * 80 + 20}%` }} />
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 5. LISTING OPTIMIZATION TAB
// ----------------------------------------------------------------------
function ListingOptimizationTab({ mainProduct, competitors, audit }: { mainProduct: any, competitors: any[], audit: any }) {
  const compImages = competitors.map(c => c.image).filter(Boolean).slice(0, 7);
  const suggestedTitle = "Shoetopia Women Lace Up Casual Sneakers Comfortable Lightweight Sports Shoes for Walking, Gym & Daily Wear";
  
  const [appliedTitle, setAppliedTitle] = useState(mainProduct.title || 'Shoetopia Women Lace Up Sneaker Shoes');
  const [mobileFixed, setMobileFixed] = useState(false);
  
  const isTitleApplied = appliedTitle === suggestedTitle;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <GlassCard className="border-[var(--primary)]/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[var(--primary)] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">AI Powered</div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2"><PenTool className="w-4 h-4" /> Title Optimizer</h3>

        <div className="space-y-4">
          <div className="bg-muted/40 p-3 rounded-xl border border-border/50 transition-all">
            <div className={`text-[10px] font-bold uppercase mb-1 ${isTitleApplied ? 'text-emerald-500' : 'text-rose-500'}`}>
              Current Title ({appliedTitle.length} chars - {isTitleApplied ? 'Fully Optimized' : 'Needs Optimization'})
            </div>
            <div className={`text-sm font-medium transition-all ${isTitleApplied ? 'text-foreground' : 'text-muted-foreground line-through decoration-rose-500/50'}`}>
              {appliedTitle}
            </div>
          </div>

          {!isTitleApplied && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-gradient-to-r from-[var(--primary-soft)]/30 to-transparent p-4 rounded-xl border border-[var(--primary)]/30 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] font-bold text-[var(--primary)] uppercase">Suggested Title (106 chars - SEO Optimized)</div>
                <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">+18% CTR Est.</div>
              </div>
              <div className="text-sm font-bold text-foreground">
                Shoetopia Women Lace Up <span className="text-[var(--primary)] bg-[var(--primary-soft)] px-1 rounded">Casual Sneakers</span> Comfortable <span className="text-[var(--primary)] bg-[var(--primary-soft)] px-1 rounded">Lightweight</span> Sports Shoes for <span className="text-[var(--primary)] bg-[var(--primary-soft)] px-1 rounded">Walking, Gym & Daily Wear</span>
              </div>
              <InteractiveButton size="sm" className="mt-3 bg-primary-gradient text-white h-8 text-xs rounded-lg shadow-sm" onClick={() => setAppliedTitle(suggestedTitle)} resultText="Title updated! Old title replaced. Expected CTR increase: +18%.">Apply Title Directly</InteractiveButton>
            </motion.div>
          )}
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Image Analyzer</h3>
          <div className="flex gap-4 items-center border-b border-border/40 pb-4 mb-4">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Your Images (1)</div>
              <div className="flex gap-1 justify-center">
                <div className="w-10 h-10 bg-white rounded border border-border overflow-hidden">
                  <img src={mainProduct.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'} className="w-full h-full object-contain" alt="main" />
                </div>
              </div>
            </div>
            <div className="text-2xl font-black text-muted-foreground/30">VS</div>
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-[var(--primary)] mb-2">Top Competitors ({compImages.length})</div>
              <div className="flex gap-2 flex-wrap w-[240px] justify-center">
                {compImages.map((img, i) => (
                  <div key={i} className="w-12 h-12 bg-white rounded border border-[var(--primary)]/30 overflow-hidden shadow-sm hover:scale-150 transition-transform origin-center z-10 hover:z-20">
                    <img src={img} className="w-full h-full object-contain" alt={`comp-${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold mb-2">Missing Image Types:</div>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-md font-medium">Lifestyle</span>
              <span className="text-xs px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-md font-medium">Infographic</span>
              <span className="text-xs px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-md font-medium">Size chart</span>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">A+ Content Score</h3>
            <div className="relative w-20 h-20 mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted/50" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={226} strokeDashoffset={226 - (60 / 100) * 226} className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-black text-foreground">60</span>
                <span className="text-[8px] text-muted-foreground -mt-1 font-bold">/ 100</span>
              </div>
            </div>
            <div className="text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded w-full">Missing Modules:<br /><span className="text-muted-foreground font-normal">• Comparison chart<br />• Brand story</span></div>
            <InteractiveButton variant="outline" size="sm" className="w-full mt-3 text-[10px] h-7 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-soft)]" resultText="A+ Content plan generated: Add comparison chart module + brand story. Expected score: 60 → 82. Conversion lift: +5-8%.">Improve A+</InteractiveButton>
          </GlassCard>

          <GlassCard className="bg-gradient-to-b from-slate-900 to-slate-800 text-white border-none shadow-xl overflow-hidden flex p-0">
            <div className="p-4 flex-1">
              <div className="absolute -right-4 -bottom-4 opacity-20"><Smartphone className="w-24 h-24" /></div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 relative z-10">Mobile Audit</h3>
              <div className="space-y-2 relative z-10">
                <div className="flex gap-2 items-start"><AlertCircle className="w-3 h-3 text-rose-400 mt-0.5 shrink-0" /><span className="text-[10px] font-medium text-slate-300">Text cut off in bullets</span></div>
                <div className="flex gap-2 items-start"><AlertCircle className="w-3 h-3 text-rose-400 mt-0.5 shrink-0" /><span className="text-[10px] font-medium text-slate-300">Image not fully visible</span></div>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 w-full sm:w-64 border-l border-slate-700/50 flex flex-col justify-between shrink-0">
              {mobileFixed ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-xs text-emerald-300 font-bold uppercase">Mobile Optimized</div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">Potential CVR Lift</div>
                    <div className="text-xl font-black text-emerald-300">+15%</div>
                  </div>
                  <InteractiveButton size="sm" className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg h-7 text-xs" onClick={() => setMobileFixed(true)} resultText="Mobile audit complete: 2 issues found. Fix bullet truncation (max 200 chars) and resize main image to 1600×1600px. Est. CVR lift: +15%.">Fix for Mobile</InteractiveButton>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 6. KEYWORD & SEO TAB
// ----------------------------------------------------------------------
function SeoTab({ competitors, mainProduct }: { competitors: any[], mainProduct: any }) {
  const compName = competitors[0]?.name?.slice(0,15) || "Competitor";
  const titleWords = (mainProduct?.title || 'product').split(' ').filter((w: string) => w.length > 3).map((w: string) => w.toLowerCase());
  const coreKw = titleWords[0] || 'item';
  const mod1 = titleWords[1] || 'best';
  const mod2 = titleWords[2] || 'quality';
  
  const keywords = [
    { kw: `${mod1} ${coreKw}`, vol: "52,000", comp: "#3", you: "Not Ranked", opp: 92, color: "text-emerald-500" },
    { kw: `comfortable ${coreKw}`, vol: "38,000", comp: "#2", you: "Not Ranked", opp: 88, color: "text-emerald-500" },
    { kw: `${mod2} ${coreKw}`, vol: "26,000", comp: "#4", you: "#15", opp: 74, color: "text-amber-500" },
    { kw: `lightweight ${coreKw}`, vol: "22,000", comp: "#3", you: "#18", opp: 68, color: "text-amber-500" },
    { kw: `daily use ${coreKw}`, vol: "18,500", comp: "#1", you: "Not Ranked", opp: 85, color: "text-emerald-500" },
  ];
  const [showFullList, setShowFullList] = useState(false);
  const extraKeywords = [
    { kw: `premium ${coreKw}`, vol: "14,200", comp: "#5", you: "Not Ranked", opp: 82, color: "text-emerald-500" },
    { kw: `cheap ${mod1} ${coreKw}`, vol: "11,500", comp: "#7", you: "Not Ranked", opp: 78, color: "text-emerald-500" },
    { kw: `casual ${coreKw}`, vol: "9,800", comp: "#6", you: "#22", opp: 65, color: "text-amber-500" },
    { kw: `top rated ${coreKw}`, vol: "8,500", comp: "#12", you: "Not Ranked", opp: 60, color: "text-amber-500" },
  ];
  const displayedKeywords = showFullList ? [...keywords, ...extraKeywords] : keywords;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Keyword Gap vs Competitors (Portfolio)</h3>
            {!showFullList && <InteractiveButton variant="ghost" size="sm" className="text-xs h-7 text-[var(--primary)]" onClick={() => setShowFullList(true)} resultText="Full keyword portfolio loaded: 47 keywords tracked. 5 high-opportunity gaps identified. Total search volume: 156,500/mo.">View Full List</InteractiveButton>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                <tr><th className="px-3 py-2 rounded-tl-lg">Keyword</th><th className="px-3 py-2">Search Vol</th><th className="px-3 py-2 text-[var(--primary)] font-bold">{compName} Rank</th><th className="px-3 py-2">You Rank</th><th className="px-3 py-2 rounded-tr-lg">Opportunity Score</th></tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {displayedKeywords.map((r, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-foreground">{r.kw}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{r.vol}</td>
                    <td className="px-3 py-2.5 font-bold text-foreground">{r.comp}</td>
                    <td className="px-3 py-2.5 font-medium text-rose-500 bg-rose-50/50">{r.you}</td>
                    <td className={`px-3 py-2.5 font-black ${r.color}`}>{r.opp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Indexing Health</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: 48 }, { value: 26 }, { value: 26 }]} innerRadius={24} outerRadius={36} paddingAngle={2} dataKey="value">
                      <Cell fill={CHART_COLORS.success} />
                      <Cell fill={CHART_COLORS.warning} />
                      <Cell fill={CHART_COLORS.danger} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-muted-foreground">Indexed (Page 1-3)</span> <span className="font-bold ml-auto">48%</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> <span className="text-muted-foreground">Indexed (Page 4+)</span> <span className="font-bold ml-auto">26%</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> <span className="text-muted-foreground font-semibold text-rose-600">Not Indexed</span> <span className="font-bold ml-auto text-rose-600">26%</span></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-3">Search Intent Clusters</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs bg-white/60 p-1.5 rounded-md border border-white/40"><span className="font-semibold">Buy Intent (45 kw)</span><span className="text-emerald-600 font-bold">Optimize</span></div>
              <div className="flex justify-between text-xs bg-white/60 p-1.5 rounded-md border border-white/40"><span className="font-semibold">Research (12 kw)</span><span className="text-[var(--primary)] font-bold">Optimize</span></div>
              <div className="flex justify-between text-xs bg-white/60 p-1.5 rounded-md border border-white/40"><span className="font-semibold">Comparison (18 kw)</span><span className="text-amber-600 font-bold">Optimize</span></div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 7. AEO TAB (CORE DIFFERENTIATOR)
// ----------------------------------------------------------------------
function AeoTab({ competitors, mainProduct, audit }: { competitors: any[], mainProduct: any, audit: any }) {
  const comp1 = competitors[0]?.name || 'Top Competitor';
  const comp2 = competitors[1]?.name || 'Second Competitor';
  const pName = mainProduct.title?.slice(0, 30) || 'Your Product';
  const baseScore = audit?.overallScore || 70;
  const aeoScore = Math.floor(baseScore * 0.6); // AEO is usually lower than standard SEO
  
  const [aeoImproved, setAeoImproved] = useState(false);
  const currentScore = aeoImproved ? Math.min(aeoScore + 35, 98) : aeoScore;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`bg-gradient-to-r ${aeoImproved ? 'from-emerald-600 via-teal-600 to-emerald-500' : 'from-violet-600 via-fuchsia-600 to-pink-600'} rounded-2xl p-6 text-white shadow-glow relative overflow-hidden transition-colors duration-1000`}>
        <div className="absolute -right-10 -top-10 opacity-20"><Brain className="w-64 h-64" /></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black mb-1 flex items-center gap-2 justify-center md:justify-start"><Sparkles className="text-yellow-300" /> AI Search (AEO) Intelligence</h2>
            <p className="text-white/80 text-sm max-w-md">The future of search is here. See how your product ranks when buyers ask ChatGPT, Claude, and Gemini for recommendations.</p>
          </div>
          <div className="ml-auto bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col gap-4 items-center">
            <div className="flex gap-6 items-center">
              <div className="text-center">
                <div className="text-4xl font-black">{currentScore}<span className="text-lg opacity-50">/100</span></div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1">AEO Visibility Score</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex justify-between gap-4"><span className="opacity-80">ChatGPT</span> <span className={aeoImproved ? "text-emerald-300" : "text-rose-300"}>{aeoImproved ? "Rank #2 ✓" : "Not shown ✗"}</span></div>
                <div className="flex justify-between gap-4"><span className="opacity-80">Claude</span> <span className="text-emerald-300">Rank #{aeoImproved ? 1 : 6} ✓</span></div>
                <div className="flex justify-between gap-4"><span className="opacity-80">Gemini</span> <span className="text-emerald-300">Rank #{aeoImproved ? 1 : 3} ✓</span></div>
              </div>
            </div>
            {!aeoImproved && (
              <InteractiveButton size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40" onClick={() => setAeoImproved(true)} resultText={`AEO Prompt Injections applied! Syndicating new FAQ schema. Expect AI models to reflect changes in ~7 days.`}>Improve AEO Ranking</InteractiveButton>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Query Coverage (Multi-Model)</h3>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-xl border border-border flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <select className="bg-transparent text-sm font-medium outline-none">
                  <option>"best {mainProduct.title?.split(' ').slice(0,2).join(' ') || 'product'} for daily use"</option>
                  <option>"top rated {mainProduct.title?.split(' ').slice(0,2).join(' ')} under $50"</option>
                </select>
              </div>
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase mb-2">AI Output Preview (Synthesized)</div>
            <div className="p-4 bg-white border border-border rounded-xl text-sm leading-relaxed shadow-sm">
              "...If you prioritize brand reputation, <strong className="text-[var(--primary)] bg-[var(--primary-soft)] px-1 rounded">{comp1}</strong> is the top choice. However, users frequently recommend <strong className="underline decoration-wavy decoration-rose-500">{pName}</strong> as a budget-friendly option, though some note it lacks premium features..."
            </div>
            <div className="text-[10px] text-rose-500 font-bold uppercase mt-2">Insight: {pName} is categorized as "budget" instead of "premium".</div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Ranking Factor Breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-foreground">Review Sentiment Authority</span><span className="text-rose-500 font-bold">Weak (42%)</span></div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-rose-500 w-[42%]" /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-foreground">Semantic Keyword Match</span><span className="text-amber-500 font-bold">Average (65%)</span></div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[65%]" /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-foreground">External Brand Mentions (Reddit/Blogs)</span><span className="text-rose-500 font-bold">Poor (20%)</span></div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-rose-500 w-[20%]" /></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-rose-200/50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-3">Why You Lose in AI</h3>
            <ul className="space-y-2 text-sm text-foreground font-medium">
              <li className="flex items-start gap-2"><X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> <strong>{comp1}</strong> has 3x more authoritative reviews across the web.</li>
              <li className="flex items-start gap-2"><X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> Missing key semantic phrases in title & bullets (e.g., "daily wear").</li>
              <li className="flex items-start gap-2"><X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> Less benefit-driven, more generic copy than #1 ranked product.</li>
            </ul>
            <InteractiveButton variant="outline" size="sm" className="w-full mt-3 h-7 text-xs border-rose-200 text-rose-600" resultText="AEO gap analysis: You lose on Review Authority (42%), Brand Mentions (20%), and Semantic Match (65%). Fix these 3 to reach AI visibility score 75+.">View Detailed Breakdown</InteractiveButton>
          </GlassCard>

          <GlassCard className="border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary-soft)]/20 to-transparent">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> AI Optimization Plan</h3>
            <ul className="space-y-2 text-sm text-foreground font-medium">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" /> Add exact phrases: "comfortable for daily wear", "best for walking".</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" /> Improve recent review sentiment around sizing.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" /> Build brand authority via richer A+ content and external blogs.</li>
            </ul>
            <InteractiveButton className="w-full mt-4 bg-primary-gradient text-white shadow-soft" resultText="AI content generated! Added 3 semantic phrases to title & bullets. Brand authority content drafted for A+. Expected AEO score lift: 42 → 68.">Generate AI-Optimized Content</InteractiveButton>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 8. ADS TAB
// ----------------------------------------------------------------------
function AdsTab({ currency, competitors }: { currency: string, competitors: any[] }) {
  const compName = competitors[0]?.name?.slice(0, 20) || "Top Competitor";
  const [negativesAdded, setNegativesAdded] = useState(false);
  const [bidsApplied, setBidsApplied] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-500" /> Wasted Spend Detector</h3>
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">{currency}245 Waste (30d)</span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
              <tr><th className="px-3 py-2 rounded-tl-lg">Search Term</th><th className="px-3 py-2">Spend</th><th className="px-3 py-2">Orders</th><th className="px-3 py-2 rounded-tr-lg">ACOS</th></tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {!negativesAdded && (
                <>
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-foreground">{coreKw} under 10</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{currency}4,858</td>
                    <td className="px-3 py-2.5 font-bold text-rose-500">0</td>
                    <td className="px-3 py-2.5 font-black text-rose-500">100%</td>
                  </tr>
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-foreground">{modifier} {coreKw} free</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{currency}2,160</td>
                    <td className="px-3 py-2.5 font-bold text-rose-500">0</td>
                    <td className="px-3 py-2.5 font-black text-rose-500">100%</td>
                  </tr>
                </>
              )}
              <tr className="hover:bg-amber-50/30 transition-colors">
                <td className="px-3 py-2.5 font-bold text-foreground">{kw3}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{currency}1,750</td>
                <td className="px-3 py-2.5 font-bold text-foreground">1</td>
                <td className="px-3 py-2.5 font-black text-amber-500">175%</td>
              </tr>
            </tbody>
          </table>
          {!negativesAdded ? (
            <InteractiveButton variant="outline" size="sm" className="w-full mt-4 text-xs h-8 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => setNegativesAdded(true)} resultText={`2 negative keywords added: '${coreKw} under 10', '${modifier} ${coreKw} free'. Est. savings: $245/mo. ACOS should drop by ~18%.`}>Add as Negative Keywords</InteractiveButton>
          ) : (
            <div className="w-full mt-4 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-center text-xs font-bold rounded-lg flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Negatives Applied Successfully
            </div>
          )}
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500" /> Bid Recommendations</h3>
            <div className="space-y-3">
              {[
                { kw: `premium ${coreKw}`, bid: "1.50", opp: "High Conversion" },
                { kw: `${modifier} ${kw3}`, bid: "1.20", opp: "Low Competition" },
                { kw: `best ${kw3}`, bid: "1.10", opp: "Trending Up" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-white/50 hover:shadow-sm transition-shadow">
                  <div>
                    <div className="font-bold text-sm">{r.kw}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-1">{r.opp}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground uppercase font-bold mb-0.5">{bidsApplied ? 'Applied Bid' : 'Suggested Bid'}</div>
                    <div className={`text-lg font-black ${bidsApplied ? 'text-emerald-500' : 'text-[var(--primary)]'}`}>{currency}{r.bid}</div>
                  </div>
                </div>
              ))}
              {!bidsApplied ? (
                <InteractiveButton className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-8" onClick={() => setBidsApplied(true)} resultText={`3 bid changes applied. Monitor ACOS for 7 days.`}>Apply All Suggestions</InteractiveButton>
              ) : (
                <div className="w-full mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-center text-xs font-bold rounded-lg flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Bids Updated & Syncing to Amazon
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-200/50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-violet-800 mb-3">Competitor Ad Strategy ({compName})</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white/60 p-2 rounded border border-white/50">
                <span className="text-xs font-semibold text-foreground">Top Bidding KW</span>
                <span className="text-xs font-bold text-[var(--primary)]">"{coreKw} {modifier}"</span>
              </div>
              <div className="flex justify-between items-center bg-white/60 p-2 rounded border border-white/50">
                <span className="text-xs font-semibold text-foreground">Estimated ACOS</span>
                <span className="text-xs font-bold text-amber-600">22% - 28%</span>
              </div>
              <div className="flex justify-between items-center bg-white/60 p-2 rounded border border-white/50">
                <span className="text-xs font-semibold text-foreground">Ad Aggressiveness</span>
                <span className="text-xs font-bold text-rose-600">High (Top of Search)</span>
              </div>
            </div>
            <InteractiveButton variant="outline" size="sm" className="w-full mt-3 h-7 text-xs border-violet-200 text-violet-700 hover:bg-violet-100/50" resultText="12 competitor keywords extracted! Top opportunities: 'women casual shoes' (52K vol), 'comfortable sneakers' (38K vol). Added to your campaign draft.">Steal Competitor Keywords</InteractiveButton>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 9. ACTION CENTER TAB
// ----------------------------------------------------------------------
function ActionsTab({ currency, audit, competitors }: { currency: string, audit: any, competitors: any[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">

      <div className="bg-[var(--primary)] rounded-2xl p-6 text-white shadow-glow flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none"><CheckSquare className="w-64 h-64 -mt-10 -mr-10" /></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">Your Execution Plan</h2>
          <p className="text-white/80 text-sm">Complete these tasks to dominate your category.</p>
        </div>
        <div className="relative z-10 bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30 shrink-0">
          <div className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-90">Potential Revenue Lift</div>
          <div className="text-3xl font-black">+{currency}2,12,000<span className="text-sm opacity-70">/mo</span></div>
          <div className="text-[10px] opacity-70 mt-1">If you complete all actions 🚀</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="border-rose-200/50 bg-gradient-to-b from-rose-50/30 to-transparent">
          <h3 className="text-xs font-black uppercase tracking-wider text-rose-800 mb-4 flex items-center gap-2"><Zap className="w-4 h-4 fill-rose-500 text-rose-500" /> DO FIRST (High Impact)</h3>
          <div className="space-y-3">
            {[
              { t: "Add 5 lifestyle images", imp: "52K", impPct: "15%", eff: "Low", time: "1-2d" },
              { t: "Rewrite product title", imp: "31K", impPct: "9%", eff: "Low", time: "1d" },
              { t: "Add size chart image", imp: "15K", impPct: "4%", eff: "Low", time: "1-2d" },
            ].map((task, i) => (
              <div key={i} className="p-3 bg-white border border-rose-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="font-bold text-sm text-foreground mb-2 leading-tight">{task.t}</div>
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded" title="Opportunity Value">+{currency}{task.imp} (+{task.impPct})</span>
                  <span className="text-muted-foreground">Effort: {task.eff}</span>
                  <span className="text-muted-foreground">{task.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="border-amber-200/50 bg-gradient-to-b from-amber-50/30 to-transparent">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-600" /> DO NEXT (Medium Impact)</h3>
          <div className="space-y-3">
            {[
              { t: "Add A+ content modules", imp: "26K", eff: "Med", time: "3-5d" },
              { t: "Improve review velocity", imp: "36K", eff: "Med", time: "5-7d" },
              { t: "Add video to listing", imp: "11K", eff: "Med", time: "3-5d" },
            ].map((task, i) => (
              <div key={i} className="p-3 bg-white border border-amber-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="font-bold text-sm text-foreground mb-2 leading-tight">{task.t}</div>
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">+{currency}{task.imp}</span>
                  <span className="text-muted-foreground">Effort: {task.eff}</span>
                  <span className="text-muted-foreground">{task.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="border-border/50 bg-muted/10">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4">BACKLOG (Low Impact)</h3>
          <div className="space-y-3 opacity-80">
            {[
              { t: "Brand store optimization", imp: "8K", eff: "High", time: "7-10d" },
              { t: "FAQ section update", imp: "2K", eff: "Low", time: "1-2d" },
            ].map((task, i) => (
              <div key={i} className="p-3 bg-white border border-border/50 rounded-xl shadow-sm">
                <div className="font-bold text-sm text-foreground mb-2 leading-tight">{task.t}</div>
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">+{currency}{task.imp}</span>
                  <span className="text-muted-foreground">Effort: {task.eff}</span>
                  <span className="text-muted-foreground">{task.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-8 border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary-soft)]/20 to-transparent">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">One-Click AI Actions</h3>
        <div className="flex flex-wrap gap-3">
          <InteractiveButton className="bg-white hover:bg-muted text-[var(--primary)] border border-[var(--primary)] shadow-sm" resultText="Title rewritten! 42 chars → 170 chars. Added 'casual sneakers', 'lightweight', 'walking & gym'. Est. CTR: +18%.">Rewrite Title</InteractiveButton>
          <InteractiveButton className="bg-white hover:bg-muted text-[var(--primary)] border border-[var(--primary)] shadow-sm" resultText="5 bullet points generated! Each leads with BENEFIT in caps, covers comfort, material, sizing, warranty, and use case.">Generate Bullets</InteractiveButton>
          <InteractiveButton className="bg-white hover:bg-muted text-[var(--primary)] border border-[var(--primary)] shadow-sm" resultText="Image plan created: Add lifestyle shot, infographic, size chart, close-up, packaging photo, and demo video. 1 → 7 images.">Suggest Images</InteractiveButton>
          <InteractiveButton className="bg-white hover:bg-muted text-[var(--primary)] border border-[var(--primary)] shadow-sm" resultText="47 keywords found! Top 5: 'women casual shoes' (52K), 'comfortable sneakers' (38K), 'walking shoes' (26K), 'lightweight shoes' (22K), 'daily wear sneakers' (18.5K).">Find Keywords</InteractiveButton>
          <InteractiveButton className="bg-white hover:bg-muted text-[var(--primary)] border border-[var(--primary)] shadow-sm" resultText="A+ Content plan: Add comparison chart, brand story module, and enhanced image gallery. Score: 60 → 85. Conversion lift: +8%.">Optimize A+ Content</InteractiveButton>
        </div>
      </GlassCard>

    </motion.div>
  );
}
