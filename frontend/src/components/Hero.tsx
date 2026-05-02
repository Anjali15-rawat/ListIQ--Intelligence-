import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star, Brain } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { KitiMascot } from "./KitiMascot";

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

const floatingCards = [
  { icon: Star, label: "Score: 87/100", sub: "Strong listing ✓", color: "text-emerald-600", bg: "bg-emerald-50", x: "-left-6", y: "top-10" },
  { icon: Zap, label: "3 quick wins", sub: "found by Kiti", color: "text-[var(--primary)]", bg: "bg-[var(--primary-soft)]", x: "-right-4", y: "bottom-16" },
  { icon: Brain, label: "AI analysis", sub: "completed in 8s", color: "text-sky-600", bg: "bg-sky-50", x: "left-4", y: "bottom-4" },
];

export function Hero() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  const handleAnalyze = () => {
    if (url.trim()) {
      navigate({ to: "/dashboard", search: { url } });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-28">
      {/* Layered background blobs */}
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-0 h-[500px] w-[500px] rounded-full bg-[var(--primary-soft)] blur-3xl opacity-40"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-0 left-0 h-[450px] w-[450px] rounded-full bg-[var(--lavender-soft)] blur-3xl opacity-40"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[var(--primary-soft)] blur-3xl opacity-20"
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[var(--primary)] pointer-events-none"
          style={{
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            left: `${8 + i * 7.5}%`,
            top: `${10 + (i * 31) % 70}%`,
            opacity: 0.15 + (i % 4) * 0.1,
          }}
          animate={{
            y: [0, -20 - i * 3, 0],
            x: [0, Math.sin(i) * 15, 0],
            opacity: [0.15 + (i % 4) * 0.1, 0.5, 0.15 + (i % 4) * 0.1],
          }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}

      <div className="relative mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/70 mb-6 border border-white/30"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
            AI-powered Amazon intelligence · v2.0 just launched 🎉
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground">
            {"Audit any".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.02 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <br className="hidden md:block" />
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="text-gradient"
            >
              Amazon listing
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {" "}with AI
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed"
          >
            Paste one product URL and get scores, pain points, competitor gaps, and exact fixes — in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 glass-strong rounded-2xl p-2 flex items-center gap-2 shadow-soft max-w-xl border border-white/40 focus-within:border-[var(--primary)] focus-within:shadow-glow transition-all"
          >
            <input
              type="url"
              placeholder="https://amazon.com/dp/B0..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleAnalyze}
              size="lg"
              className="rounded-xl bg-primary-gradient hover:opacity-95 shadow-glow hover:shadow-hover transition-all text-white font-semibold px-6 shrink-0"
            >
              Analyze <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> No signup required</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Results in ~12 seconds</span>
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-[var(--primary)]" /> 1 free audit daily</span>
          </motion.div>
        </motion.div>

        {/* Right: Kiti + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex items-center justify-center min-h-[400px]"
        >
          <div className="absolute inset-0 bg-primary-gradient rounded-full blur-3xl opacity-10" />

          {/* Orbiting dots */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2.5 w-2.5 rounded-full bg-[var(--primary)] opacity-40"
              animate={{
                x: Math.cos((i / 8) * 2 * Math.PI) * 180,
                y: Math.sin((i / 8) * 2 * Math.PI) * 180,
                rotate: [0, 360],
              }}
              transition={{
                x: { duration: 12, repeat: Infinity, ease: "linear" },
                y: { duration: 12, repeat: Infinity, ease: "linear" },
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              }}
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%,-50%) rotate(${(i / 8) * 360}deg) translateX(180px)`,
              }}
            />
          ))}

          {/* Main Kiti card */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative glass-strong border border-white/50 rounded-[3rem] p-6 shadow-elegant z-10"
          >
            <KitiMascot type="hero" size={280} className="translate-x-4" />
          </motion.div>

          {/* Floating stat cards */}
          {floatingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, i % 2 === 0 ? -6 : 6, 0] }}
                transition={{
                  opacity: { delay: 1 + i * 0.2 },
                  scale: { delay: 1 + i * 0.2 },
                  y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
                }}
                className={`absolute ${card.x} ${card.y} glass rounded-2xl p-3 shadow-soft text-xs border border-white/40 z-20`}
              >
                <div className={`flex items-center gap-1.5 font-semibold ${card.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {card.label}
                </div>
                <div className="text-muted-foreground mt-0.5">{card.sub}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-muted-foreground"
      >
        <span>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-5 w-5 rounded-full border border-border flex items-center justify-center"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}