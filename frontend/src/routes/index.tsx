import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Brain, BarChart3, Eye, Zap, Star, ChevronDown, X, Mail, MessageSquare, Shield, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { mockStats } from "@/lib/mockData";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

// Animated counter
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !triggered) setTriggered(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    if (isNaN(num)) { setDisplayed(value); return; }
    let start = 0;
    const step = num / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= num) { setDisplayed(value); clearInterval(t); }
      else setDisplayed(Math.floor(start) + suffix);
    }, 16);
    return () => clearInterval(t);
  }, [triggered, value]);

  return (
    <div ref={ref} className="glass rounded-2xl p-5 text-center shadow-soft hover:shadow-elegant transition-all group">
      <div className="text-3xl font-bold text-gradient tabular-nums group-hover:scale-110 transition-transform">{displayed}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

const features = [
  { icon: Search, title: "Listing audit", desc: "47-factor scoring across title, bullets, images, and A+ content with prioritized fixes.", color: "from-pink-500 to-rose-400", tab: "audit" },
  { icon: Brain, title: "Review intelligence", desc: "Mine thousands of reviews to surface pain points, hidden wins, and emerging issues.", color: "from-violet-500 to-purple-400", tab: "audit" },
  { icon: Eye, title: "Competitor spy", desc: "Decode the top 3 rivals — strengths, weaknesses, and the gaps you can exploit.", color: "from-sky-500 to-blue-400", tab: "competitor" },
  { icon: BarChart3, title: "Time machine", desc: "Track sentiment over time and catch quality slips before they tank your BSR.", color: "from-amber-500 to-orange-400", tab: "time-machine" },
  { icon: Zap, title: "12-second results", desc: "Paste a URL, get a full intelligence brief faster than a coffee order.", color: "from-emerald-500 to-teal-400", tab: "audit" },
  { icon: Star, title: "Action-first output", desc: "Every insight ships with the exact copy or fix to apply — no fluff.", color: "from-fuchsia-500 to-pink-400", tab: "audit" },
];

const testimonials = [
  { name: "Priya S.", role: "Amazon FBA Seller", text: "ListIQ found 4 title issues I'd missed for 6 months. Fixed them in one afternoon, BSR jumped 40 spots.", rating: 5 },
  { name: "Marcus T.", role: "E-commerce Agency", text: "We audit 20+ listings a week now. The Competitor Spy tab alone saved us hours of manual research.", rating: 5 },
  { name: "Anjali R.", role: "Beauty Brand Owner", text: "Kiti's suggestions are surprisingly specific. It caught that my bullet points were feature-first, not benefit-first.", rating: 5 },
];

const faqs = [
  { q: "Do I need to create an account?", a: "No! You can run your first audit for free without signing up. Just paste a URL and hit Analyze." },
  { q: "Which Amazon marketplaces are supported?", a: "We support amazon.com, amazon.in, amazon.co.uk, amazon.de, amazon.fr, and more. Currency auto-detects." },
  { q: "How accurate is the analysis?", a: "Scores are calculated from real product data (title, rating, reviews, features). The AI analysis uses the same criteria Amazon's A9 algorithm prioritizes." },
  { q: "What happens if the AI is unavailable?", a: "Our local analysis engine kicks in automatically — you always get a result, never a blank page." },
  { q: "Can I use it for multiple products?", a: "Yes. Pro plan gives 100 audits/month. Max gives unlimited with bulk CSV upload." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="glass rounded-2xl overflow-hidden border border-white/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm hover:bg-white/10 transition-colors"
      >
        {q}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </motion.span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </motion.div>
  );
}

function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-primary-gradient origin-left z-[100]"
      />

      <Navbar />
      <Hero />

      {/* Animated stats */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockStats.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-[var(--primary)] mb-4">Capabilities</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">Everything you need to <span className="text-gradient">win the buy box</span></h2>
            <p className="mt-6 text-lg text-muted-foreground">From first impression to long-tail SEO — Kiti analyzes, prioritizes, and writes the fix for you.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <GlassCard hover className="h-full cursor-pointer relative overflow-hidden border border-white/40 hover:border-[var(--primary)]/30 hover:shadow-elegant transition-all duration-300 flex flex-col">
                    {/* Shimmer overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)' }} />
                    {/* Top accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.color} grid place-items-center shadow-soft group-hover:scale-110 group-hover:shadow-hover transition-all duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-lg group-hover:text-[var(--primary)] transition-colors duration-200">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
                    {/* Explore link — always visible, animates on hover */}
                    <Link
                      to="/dashboard"
                      search={{ tab: f.tab }}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] group-hover:gap-2 transition-all duration-300"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 py-24 md:py-32 bg-soft-gradient">
        <div className="mx-auto max-w-6xl">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-foreground">
            Three steps. <span className="text-gradient">Zero guesswork.</span>
          </motion.h2>
          <div className="mt-16 grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-30" />
            {[
              { n: "01", t: "Paste your URL", d: "Drop any Amazon product link — no installs, no setup.", emoji: "🔗" },
              { n: "02", t: "Kiti analyzes", d: "We scrape, score, and cross-reference against the top competitors.", emoji: "🧠" },
              { n: "03", t: "Apply the fixes", d: "Get prioritized, copy-paste-ready updates for your listing.", emoji: "✅" },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className="group"
              >
                <GlassCard variant="strong" className="h-full text-center relative overflow-hidden border border-white/40 hover:border-[var(--primary)]/30 hover:shadow-elegant transition-all duration-300 cursor-pointer">
                  {/* Background glow on hover */}
                  <div className="absolute inset-0 bg-primary-gradient opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none rounded-inherit" />
                  <motion.div
                    className="text-6xl font-bold text-gradient opacity-90 tabular-nums relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {step.n}
                    {/* Ripple ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[var(--primary)] opacity-0 group-hover:opacity-30"
                      animate={{ scale: [1, 1.4, 1.8], opacity: [0.3, 0.1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  </motion.div>
                  <div className="text-2xl mt-1">{step.emoji}</div>
                  <h3 className="mt-3 font-semibold text-xl group-hover:text-[var(--primary)] transition-colors duration-200">{step.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.d}</p>
                  <div className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Step {i + 1} of 3</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 mb-4">⭐ Reviews</div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Sellers love <span className="text-gradient">ListIQ</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
                <GlassCard className="h-full flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed flex-1">"{t.text}"</p>
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-24 md:py-32 bg-soft-gradient">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-[var(--primary)] mb-4">Pricing</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">Simple, <span className="text-gradient">transparent</span> pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free. Scale when you're ready. No surprise charges.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                name: "Free", price: "$0", period: "/mo", desc: "Perfect for sellers just getting started.", highlight: false,
                features: ["5 listing audits / month", "Basic 47-factor score", "Pain point summary", "Kiti AI chat (10 msgs/day)", "1 competitor comparison"],
                cta: "Get started free",
              },
              {
                name: "Pro", price: "$29", period: "/mo", desc: "For serious sellers scaling their catalog.", highlight: true,
                features: ["100 listing audits / month", "Full 47-factor deep audit", "Time Machine sentiment trends", "3 competitor deep-dive per URL", "Kiti AI chat (unlimited)", "Real customer complaint analysis", "Priority support"],
                cta: "Start Pro free trial",
              },
              {
                name: "Max", price: "$79", period: "/mo", desc: "For agencies and high-volume brands.", highlight: false,
                features: ["Unlimited listing audits", "Multi-marketplace support", "Bulk URL analysis (CSV upload)", "Full competitor intelligence suite", "White-label PDF reports", "Team seats (up to 5 users)", "API access", "Dedicated account manager"],
                cta: "Contact sales",
              },
            ].map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                {plan.highlight && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                    <span className="rounded-full bg-primary-gradient text-white text-xs font-bold px-4 py-1.5 shadow-soft">✨ Most Popular</span>
                  </div>
                )}
                <div className={`h-full ${plan.highlight ? "rounded-[1.5rem] bg-primary-gradient p-[2px] shadow-elegant" : ""}`}>
                  <div className={`h-full flex flex-col ${plan.highlight ? "rounded-[1.4rem] bg-card p-6" : ""}`}>
                    {!plan.highlight ? (
                      <GlassCard className="h-full flex flex-col">
                        <PlanContent plan={plan} highlight={false} />
                      </GlassCard>
                    ) : (
                      <PlanContent plan={plan} highlight={true} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm text-muted-foreground mt-10">
            All plans include a 7-day free trial. No credit card required. Cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Frequently asked <span className="text-gradient">questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div key={f.q} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <FaqItem q={f.q} a={f.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mx-auto max-w-4xl rounded-[2.5rem] bg-primary-gradient p-12 md:p-16 text-center text-white overflow-hidden shadow-elegant">
          <div className="absolute inset-0 bg-mesh opacity-20" />
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">Ready to outsell your category?</h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto">Your first audit is on us. See exactly what's holding your listing back — and fix it today.</p>
            <Button asChild size="lg" className="mt-8 rounded-full bg-white text-[var(--primary)] hover:bg-white/95 shadow-glow hover:scale-105 transition-transform">
              <Link to="/dashboard">Start free audit <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <FooterWithModals />
    </div>
  );
}

function PlanContent({ plan, highlight }: { plan: any; highlight: boolean }) {
  return (
    <>
      <div className="mb-6">
        <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${highlight ? "text-[var(--primary)]" : "text-muted-foreground"}`}>{plan.name}</div>
        <div className="flex items-end gap-1">
          <span className="text-5xl font-extrabold text-foreground">{plan.price}</span>
          <span className="text-muted-foreground mb-1.5">{plan.period}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
      </div>
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((f: string) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${highlight ? "bg-primary-gradient text-white" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Button asChild className={`w-full rounded-xl ${highlight ? "bg-primary-gradient text-white hover:opacity-90 shadow-soft" : "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-soft)]"}`} variant={highlight ? "default" : "outline"}>
        <Link to="/dashboard">{plan.cta}</Link>
      </Button>
    </>
  );
}

function LegalModal({ title, icon: Icon, onClose, children }: { title: string; icon: any; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-card rounded-3xl shadow-elegant border border-border/50 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[var(--primary-soft)] shrink-0">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="h-8 w-8 rounded-xl bg-primary-gradient grid place-items-center"><Icon className="h-4 w-4 text-white" /></div>
            {title}
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-xl hover:bg-white/60 grid place-items-center transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
        <div className="px-6 py-4 border-t border-border/30 shrink-0">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FooterWithModals() {
  const [modal, setModal] = useState<"privacy" | "terms" | "contact" | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setModal(null); setContactForm({ name: "", email: "", message: "" }); }, 2000);
  };

  return (
    <>
      <footer className="px-4 py-10 border-t border-border/50">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© 2026 ListIQ — Built for Amazon sellers who refuse to guess.</div>
          <div className="flex gap-6">
            {[
              { label: "Privacy", id: "privacy" as const },
              { label: "Terms", id: "terms" as const },
              { label: "Contact", id: "contact" as const },
            ].map(link => (
              <button
                key={link.id}
                onClick={() => setModal(link.id)}
                className="hover:text-[var(--primary)] hover:underline transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modal === "privacy" && (
          <LegalModal title="Privacy Policy" icon={Shield} onClose={() => setModal(null)}>
            <div className="p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p className="text-xs text-muted-foreground">Last updated: May 2026</p>
              {[
                { h: "Data We Collect", b: "ListIQ collects Amazon product URLs you submit, analysis results, account email, and anonymized usage data. We do not collect or store your Amazon login credentials or payment details directly." },
                { h: "How We Use It", b: "Your data powers listing intelligence reports and product improvements. We never sell your personal data to third parties. Analysis results are cached 24 hours for performance." },
                { h: "Your Rights", b: "You can request data export or deletion at any time by emailing privacy@listiq.ai. We respond within 30 days. You can also opt out of analytics in Settings." },
                { h: "Cookies", b: "We use essential session cookies (cannot be disabled) and optional analytics cookies. Disable analytics cookies in your browser without impacting functionality." },
                { h: "Security", b: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We conduct regular security audits and follow OWASP best practices." },
                { h: "Contact", b: "Privacy questions? Email privacy@listiq.ai or write to: ListIQ Inc., 123 Commerce St, San Francisco CA 94105." },
              ].map(s => (
                <div key={s.h}>
                  <h3 className="font-semibold text-foreground text-base mb-1">{s.h}</h3>
                  <p>{s.b}</p>
                </div>
              ))}
            </div>
          </LegalModal>
        )}
        {modal === "terms" && (
          <LegalModal title="Terms of Service" icon={FileText} onClose={() => setModal(null)}>
            <div className="p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p className="text-xs text-muted-foreground">Effective: May 2026 · Applies to all ListIQ users</p>
              {[
                { h: "Acceptance", b: "By using ListIQ you agree to these Terms. If you disagree, please discontinue use. We may update these terms and will notify you by email." },
                { h: "Permitted Use", b: "ListIQ is for lawful Amazon listing analysis only. You may not use it to scrape at scale, reverse-engineer our systems, or violate Amazon's terms of service." },
                { h: "Intellectual Property", b: "All ListIQ software, designs, and content are owned by ListIQ Inc. Analysis reports generated for your listings belong to you." },
                { h: "Free & Paid Plans", b: "Free plans include 5 audits/month. Paid plans auto-renew monthly. Cancellations take effect at period end. No refunds for partial months." },
                { h: "Limitation of Liability", b: "ListIQ provides analysis for informational purposes. We are not responsible for business decisions made based on our reports. Liability is capped at fees paid in the last 3 months." },
                { h: "Termination", b: "We may suspend accounts that violate these terms. You may cancel anytime from your account settings." },
              ].map(s => (
                <div key={s.h}>
                  <h3 className="font-semibold text-foreground text-base mb-1">{s.h}</h3>
                  <p>{s.b}</p>
                </div>
              ))}
            </div>
          </LegalModal>
        )}
        {modal === "contact" && (
          <LegalModal title="Contact Us" icon={MessageSquare} onClose={() => setModal(null)}>
            <div className="p-6">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 gap-3">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-100 grid place-items-center"><span className="text-3xl">✅</span></div>
                  <div className="font-bold text-lg text-foreground">Message sent!</div>
                  <div className="text-sm text-muted-foreground text-center">We'll get back to you within 24 hours.</div>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: Mail, label: "Email", val: "hello@listiq.ai" },
                      { icon: MessageSquare, label: "Response", val: "Within 24h" },
                    ].map(c => {
                      const Icon = c.icon;
                      return (
                        <div key={c.label} className="glass rounded-2xl p-3 flex items-center gap-2">
                          <Icon className="h-4 w-4 text-[var(--primary)] shrink-0" />
                          <div>
                            <div className="text-[10px] text-muted-foreground">{c.label}</div>
                            <div className="text-xs font-semibold">{c.val}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <form onSubmit={handleContact} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</label>
                      <input required value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
                      <input required type="email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</label>
                      <textarea required rows={4} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="How can we help?"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all resize-none" />
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-soft">
                      Send Message →
                    </button>
                  </form>
                </>
              )}
            </div>
          </LegalModal>
        )}
      </AnimatePresence>
    </>
  );
}
