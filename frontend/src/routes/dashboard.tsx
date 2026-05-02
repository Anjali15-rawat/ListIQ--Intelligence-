import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Plus, Bell, Store, ShoppingCart, ChevronDown, User, LogOut, CreditCard, HelpCircle, CheckCircle2, Clock, Zap } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { AuditTab } from "@/tabs/AuditTab";
import { BuyerAuditTab } from "@/tabs/BuyerAuditTab";
import { TimeMachineTab } from "@/tabs/TimeMachineTab";
import { CompetitorSpyTab } from "@/tabs/CompetitorSpyTab";
import { Button } from "@/components/ui/button";
import { KitiMascot } from "@/components/KitiMascot";
import { api } from "@/services/api";

const adaptAnalysisToMockFormat = (data: any) => {
  if (!data) return null;
  const currencySymbol = data.product?.currency?.symbol || '$';
  const price = data.product?.price;
  const formattedPrice = price != null ? `${currencySymbol}${price}` : '—';
  return {
    product: {
      image: data.product?.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
      asin: data.product?.asin || '—',
      title: data.product?.title || 'Analyzed Product',
      price: formattedPrice,
      rating: data.product?.rating || '—',
      reviews: data.product?.reviewsCount || 0,
      bsr: data.product?.bsr || '—',
    },
    overallScore: data.overallScore || 0,
    verdict: data.verdict || 'Analysis Complete',
    factors: (data.factors || []).map((f: any) => ({
      label: f.factor || 'Factor',
      value: typeof f.score === 'number' ? (f.score <= 10 ? f.score * 10 : f.score) : 0,
    })),
    painPoints: (data.painPoints || []).map((p: any) => {
      if (typeof p === 'object' && p.text) {
        return { severity: p.type === 'review' ? 'high' as const : 'medium' as const, text: p.text, isReview: p.type === 'review' };
      }
      const str = typeof p === 'string' ? p : JSON.stringify(p);
      return { severity: str.toLowerCase().includes('complaint') ? 'high' as const : 'medium' as const, text: str, isReview: str.startsWith('"') };
    }),
    whatsWorking: data.whatsWorking?.length
      ? data.whatsWorking
      : data.product?.praises?.length
        ? data.product.praises.map((p: string) => `"${p}"`)
        : ['Analysis complete — check Score Breakdown for improvement areas'],
    fixes: (data.fixes || []).map((f: any, i: number) => ({
      priority: i === 0 ? 'high' as const : i === 1 ? 'high' as const : 'medium' as const,
      title: typeof f === 'string' ? f : JSON.stringify(f),
      impact: 'High Impact',
    })),
  };
};

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search.tab === 'string' ? search.tab : undefined,
    url: typeof search.url === 'string' ? search.url : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Dashboard — ListIQ" },
      { name: "description", content: "Your Amazon listing intelligence dashboard." },
    ],
  }),
  component: Dashboard,
});

const tabTitles: Record<string, string> = {
  audit: "Listing Audit",
  "time-machine": "Time Machine",
  competitor: "Competitor Spy",
};

const notifications = [
  { id: 1, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", title: "Audit complete", desc: "Your last listing scored 87/100.", time: "2m ago", read: false },
  { id: 2, icon: Zap, color: "text-amber-500", bg: "bg-amber-50", title: "3 quick wins found", desc: "Kiti found title & bullet improvements.", time: "1h ago", read: false },
  { id: 3, icon: Clock, color: "text-sky-500", bg: "bg-sky-50", title: "Time Machine updated", desc: "New sentiment data available.", time: "3h ago", read: true },
];

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter(n => !n.read).length;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full mt-2 right-0 w-80 glass-strong rounded-2xl border border-white/40 shadow-elegant overflow-hidden z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Bell className="h-4 w-4 text-[var(--primary)]" />
          Notifications
          {unread > 0 && <span className="h-5 w-5 rounded-full bg-primary-gradient text-white text-[10px] grid place-items-center font-bold">{unread}</span>}
        </div>
        <button onClick={() => setItems(items.map(n => ({ ...n, read: true })))} className="text-xs text-[var(--primary)] hover:underline">Mark all read</button>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-border/20">
        {items.map((n) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={n.id}
              whileHover={{ backgroundColor: "rgba(230,73,128,0.04)" }}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${!n.read ? "bg-[var(--primary-soft)]/40" : ""}`}
              onClick={() => setItems(items.map(i => i.id === n.id ? { ...i, read: true } : i))}
            >
              <div className={`h-8 w-8 rounded-xl ${n.bg} grid place-items-center shrink-0 mt-0.5`}>
                <Icon className={`h-4 w-4 ${n.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</div>
                <div className="text-xs text-muted-foreground truncate">{n.desc}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{n.time}</div>
              </div>
              {!n.read && <div className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0 mt-2" />}
            </motion.div>
          );
        })}
      </div>
      <div className="px-4 py-2.5 border-t border-border/30 text-center">
        <button onClick={onClose} className="text-xs text-[var(--primary)] font-semibold hover:underline">View all notifications</button>
      </div>
    </motion.div>
  );
}

function ProfileMenu({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const menuItems = [
    { icon: User, label: "My Profile", action: () => {} },
    { icon: CreditCard, label: "Billing & Plans", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full mt-2 right-0 w-56 glass-strong rounded-2xl border border-white/40 shadow-elegant overflow-hidden z-50"
    >
      <div className="p-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-primary-gradient grid place-items-center text-white font-bold shadow-soft">S</div>
          <div>
            <div className="font-semibold text-sm">Seller</div>
            <div className="text-xs text-muted-foreground">seller@example.com</div>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-emerald-600 bg-emerald-50 rounded-lg px-2 py-1 font-medium">✨ Pro Plan — 87 audits left</div>
      </div>
      <div className="p-1.5 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => { item.action(); onClose(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors text-left"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="p-1.5 border-t border-border/30">
        <button
          onClick={() => { onClose(); navigate({ to: "/" }); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </motion.div>
  );
}

function PerspectiveDropdown({ value, onChange }: { value: "seller" | "buyer"; onChange: (v: "seller" | "buyer") => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const options = [
    { value: "seller" as const, label: "Seller View", icon: Store, desc: "Optimize your listing" },
    { value: "buyer" as const, label: "Buyer View", icon: ShoppingCart, desc: "Evaluate before buying" },
  ];
  const selected = options.find(o => o.value === value)!;
  const SelIcon = selected.icon;
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${value === "buyer" ? "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100" : "bg-[var(--primary-soft)] text-[var(--primary)] border-pink-200 hover:bg-pink-100"}`}
      >
        <SelIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{selected.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute top-full mt-2 right-0 w-52 glass-strong rounded-2xl border border-white/40 shadow-elegant overflow-hidden z-50">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = opt.value === value;
              return (
                <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${isActive ? "bg-[var(--primary-soft)]" : "hover:bg-muted/50"}`}>
                  <div className={`h-8 w-8 rounded-xl grid place-items-center mt-0.5 shrink-0 ${opt.value === "buyer" ? "bg-sky-100" : "bg-[var(--primary-soft)]"}`}>
                    <Icon className={`h-4 w-4 ${opt.value === "buyer" ? "text-sky-600" : "text-[var(--primary)]"}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isActive ? "text-[var(--primary)]" : "text-foreground"}`}>{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </div>
                  {isActive && <span className="ml-auto text-[var(--primary)] text-xs mt-1">✓</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Dashboard() {
  const search = Route.useSearch();
  const [tab, setTab] = useState(search.tab || "audit");
  const [url, setUrl] = useState(search.url || "");
  const [perspective, setPerspective] = useState<"seller" | "buyer">("seller");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [competitorsData, setCompetitorsData] = useState<any>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const steps = ["Fetching product data", "Scoring 47 factors", "Analyzing competitors", "Generating insights"];
  const [stepIdx, setStepIdx] = useState(0);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setError(null);
    setStepIdx(0);
    const stepTimer = setInterval(() => { setStepIdx((s) => Math.min(s + 1, steps.length - 1)); }, 2200);
    try {
      const [analyzeRes, timelineRes, competitorsRes] = await Promise.allSettled([
        api.analyze(url),
        api.timeline(url),
        api.competitors(url),
      ]);
      if (analyzeRes.status === 'fulfilled') {
        setAnalysisResult(adaptAnalysisToMockFormat(analyzeRes.value.data));
        setTab("audit");
      } else {
        throw new Error(analyzeRes.reason?.message || "Failed to analyze");
      }
      if (timelineRes.status === 'fulfilled') setTimelineData(timelineRes.value.data);
      if (competitorsRes.status === 'fulfilled') setCompetitorsData(competitorsRes.value.data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze");
    } finally {
      clearInterval(stepTimer);
      setIsAnalyzing(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="flex">
        <Sidebar active={tab} onChange={setTab} perspective={perspective} />

        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          <header className="sticky top-0 z-30 glass-strong border-b border-border/50 px-4 md:px-6 py-3 flex items-center gap-3">
            {/* Kiti greeting — desktop */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <KitiMascot type="greeting" size={36} animate={true} />
              <div>
                <div className="text-xs text-muted-foreground">Welcome back</div>
                <div className="font-semibold text-sm">{tabTitles[tab] ?? "Dashboard"}</div>
              </div>
            </div>

            <PerspectiveDropdown value={perspective} onChange={setPerspective} />

            {/* URL input */}
            <div className="flex-1 max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                placeholder="Paste Amazon URL and press Enter..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/60 border border-transparent text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:bg-card focus:border-[var(--primary)]/30 transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                disabled={isAnalyzing}
              />
              {isAnalyzing && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {/* Notification bell */}
            <div ref={notifRef} className="relative shrink-0">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="h-9 w-9 rounded-xl bg-muted/60 grid place-items-center hover:bg-muted transition-colors relative"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--primary)] pulse-ring" />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
              </AnimatePresence>
            </div>

            {/* New analysis button */}
            <Button
              className="hidden sm:flex rounded-xl bg-primary-gradient hover:opacity-90 shadow-soft hover:shadow-glow transition-all disabled:opacity-60"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !url}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isAnalyzing ? "Analyzing..." : "New analysis"}
            </Button>

            {/* Profile avatar */}
            <div ref={profileRef} className="relative shrink-0">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="h-9 w-9 rounded-xl bg-primary-gradient grid place-items-center text-white font-semibold text-sm shadow-soft hover:opacity-90 transition-opacity"
              >
                S
              </button>
              <AnimatePresence>
                {profileOpen && <ProfileMenu onClose={() => setProfileOpen(false)} />}
              </AnimatePresence>
            </div>
          </header>

          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={isAnalyzing ? "analyzing" : tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
                    <div className="relative">
                      <motion.div className="absolute inset-0 rounded-full bg-primary-gradient opacity-20 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                      <KitiMascot type="analyzing" size={180} animate={true} />
                    </div>
                    <h2 className="mt-8 text-2xl font-semibold text-foreground">Kiti is analyzing the listing…</h2>
                    <div className="mt-6 w-80 space-y-2">
                      {steps.map((step, i) => (
                        <motion.div key={step} className={`flex items-center gap-3 text-sm px-4 py-2.5 rounded-xl transition-all ${i <= stepIdx ? "glass-strong text-foreground" : "text-muted-foreground opacity-40"}`}>
                          {i < stepIdx ? (
                            <span className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs grid place-items-center flex-shrink-0">✓</span>
                          ) : i === stepIdx ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 border-2 border-[var(--primary)] border-t-transparent rounded-full flex-shrink-0" />
                          ) : (
                            <span className="h-5 w-5 rounded-full border-2 border-border flex-shrink-0" />
                          )}
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-24 min-h-[60vh]">
                    <div className="h-16 w-16 rounded-2xl bg-rose-100 grid place-items-center mb-4">
                      <span className="text-3xl">😿</span>
                    </div>
                    <div className="text-xl font-bold text-rose-600 mb-2">Analysis Failed</div>
                    <div className="text-sm text-muted-foreground max-w-sm text-center">{error}</div>
                    <Button className="mt-6 rounded-xl bg-primary-gradient text-white" onClick={() => setError(null)}>Try again</Button>
                  </div>
                ) : (
                  <>
                    {tab === "audit" && (perspective === "buyer" ? <BuyerAuditTab data={analysisResult} /> : <AuditTab data={analysisResult} />)}
                    {tab === "time-machine" && <TimeMachineTab data={timelineData} isBuyer={perspective === "buyer"} />}
                    {tab === "competitor" && <CompetitorSpyTab data={competitorsData} analysisScore={analysisResult?.overallScore} isBuyer={perspective === "buyer"} />}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <FloatingAssistant url={url} />
    </div>
  );
}