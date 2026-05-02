import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, RotateCcw, ChevronDown, Mic } from "lucide-react";
import { KitiMascot } from "./KitiMascot";
import { api } from "@/services/api";

/* ─── Markdown renderer ─────────────────────────────── */
function renderBold(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function KitiMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (line.match(/^[•\-\*]\s/)) {
          const content = line.replace(/^[•\-\*]\s/, "");
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-[var(--primary)] mt-0.5 shrink-0 text-base leading-none">•</span>
              <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderBold(content) }} />
            </div>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderBold(line) }} />
        );
      })}
    </div>
  );
}

/* ─── Mood states for Kiti ──────────────────────────── */
type KitiMood = "idle" | "thinking" | "happy" | "excited";

/* ─── Suggestion categories ─────────────────────────── */
const SUGGESTION_GROUPS = [
  {
    label: "📊 Audit",
    chips: ["Score my listing", "What's my biggest weakness?", "Fix my title"],
  },
  {
    label: "💬 Reviews",
    chips: ["What do buyers complain about?", "How to get more reviews?", "Top praises?"],
  },
  {
    label: "🏆 Compete",
    chips: ["How do I beat competitors?", "Is my price right?", "Gaps I can exploit?"],
  },
];

/* ─── Kiti persona messages ─────────────────────────── */
const KITI_GREETINGS = [
  "Hey! I'm Kiti 🐱✨ Your Amazon listing mentor. Paste a product URL above, analyze it, and let's crush the competition together!",
  "Hi there! Kiti here 🐾 Think of me as your listing coach — I'll tell you exactly what to fix, why it matters, and how to do it. Let's go!",
  "Welcome! 🌟 I'm Kiti, your AI-powered Amazon ally. Run an analysis first, then ask me anything — I give real, specific advice, not fluff.",
];

const IDLE_NUDGES = [
  "Psst 👀 I noticed you haven't asked anything yet — what's on your mind?",
  "Still here! 🐱 Need help with titles, reviews, pricing, or competitor gaps?",
  "Fun fact: listings with optimized A+ content convert 10% better. Want tips? ✨",
  "Ask me anything about your listing — I don't judge, I just help 🫶",
];

/* ─── Typing animation component ────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="h-8 w-8 rounded-full bg-[var(--primary-soft)] grid place-items-center shrink-0 mr-1">
        <KitiMascot size={28} animate={false} type="thinking" />
      </div>
      <div className="flex gap-1.5 bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
        {[0, 0.18, 0.36].map((delay, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay }}
            className="h-2 w-2 rounded-full bg-[var(--primary)]"
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Single message bubble ─────────────────────────── */
function MessageBubble({
  msg,
  isLatest,
}: {
  msg: { role: string; text: string; mood?: KitiMood };
  isLatest: boolean;
}) {
  const isKiti = msg.role === "kiti";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`flex gap-2 items-end ${isKiti ? "justify-start" : "justify-end"}`}
    >
      {isKiti && (
        <div className="h-8 w-8 rounded-full bg-[var(--primary-soft)] grid place-items-center shrink-0 mb-0.5 overflow-hidden">
          <KitiMascot
            size={28}
            animate={isLatest}
            type={msg.mood === "excited" ? "happycheer" : msg.mood === "thinking" ? "thinking" : "assistant"}
          />
        </div>
      )}
      <div
        className={`rounded-2xl px-4 py-2.5 max-w-[78%] shadow-soft ${
          isKiti
            ? "bg-card text-foreground rounded-tl-sm border border-border/40"
            : "bg-primary-gradient text-white rounded-br-sm"
        }`}
      >
        {isKiti ? <KitiMessage text={msg.text} /> : <p className="text-sm leading-relaxed">{msg.text}</p>}
      </div>
    </motion.div>
  );
}

/* ─── Unread badge on FAB ───────────────────────────── */
function UnreadBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold grid place-items-center ring-2 ring-white"
    >
      {count}
    </motion.span>
  );
}

/* ─── Main component ─────────────────────────────────── */
export function FloatingAssistant({ url }: { url?: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [activeSuggGroup, setActiveSuggGroup] = useState(0);
  const [kitiMood, setKitiMood] = useState<KitiMood>("idle");
  const [messages, setMessages] = useState([
    {
      role: "kiti",
      text: KITI_GREETINGS[Math.floor(Math.random() * KITI_GREETINGS.length)],
      mood: "happy" as KitiMood,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setUnread(0);
    }
  }, [open]);

  // Idle nudge — Kiti speaks up if user is quiet
  useEffect(() => {
    if (open || messages.length > 2) return;
    nudgeTimer.current = setTimeout(() => {
      if (!open) {
        const nudge = IDLE_NUDGES[Math.floor(Math.random() * IDLE_NUDGES.length)];
        setMessages(prev => [...prev, { role: "kiti", text: nudge, mood: "happy" }]);
        setUnread(n => n + 1);
      }
    }, 30000);
    return () => { if (nudgeTimer.current) clearTimeout(nudgeTimer.current); };
  }, [open, messages.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text, mood: "idle" }]);
    setIsTyping(true);
    setKitiMood("thinking");

    try {
      const { data } = await api.chat(text, url || "");
      const response = data.response || "Hmm, I couldn't process that. Try asking differently! 🐱";

      // Detect mood from response content
      const mood: KitiMood =
        response.includes("Great") || response.includes("excellent") || response.includes("amazing")
          ? "excited"
          : response.includes("?") || response.includes("unclear")
          ? "thinking"
          : "happy";

      setKitiMood(mood);
      setMessages(prev => [...prev, { role: "kiti", text: response, mood }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "kiti",
          text: "Oops! Looks like there's a connection hiccup 🐾 Make sure the backend is running and try again!",
          mood: "idle",
        },
      ]);
    } finally {
      setIsTyping(false);
      if (!open) setUnread(n => n + 1);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "kiti",
      text: "Fresh start! 🌱 What would you like to work on?",
      mood: "happy",
    }]);
    setKitiMood("idle");
  };

  const showSuggestions = messages.length <= 1 && !isTyping;
  const currentGroup = SUGGESTION_GROUPS[activeSuggGroup];

  return (
    <>
      {/* ── Floating button ── */}
      <motion.button
        onClick={() => { setOpen(!open); setUnread(0); }}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-glow grid place-items-center overflow-visible"
        animate={open ? { y: 0 } : { y: [0, -6, 0] }}
        transition={open ? { duration: 0 } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        style={{ background: "transparent" }}
      >
        <div className="h-16 w-16 rounded-full glass-strong overflow-hidden grid place-items-center relative">
          <KitiMascot
            size={58}
            animate={!open}
            type={open ? "greeting" : kitiMood === "thinking" ? "thinking" : kitiMood === "excited" ? "happycheer" : "assistant"}
          />
          {/* Online dot */}
          <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <UnreadBadge count={unread} />
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-28 right-6 z-50 flex flex-col rounded-3xl shadow-elegant border border-white/30 overflow-hidden"
            style={{
              width: "min(420px, calc(100vw - 2rem))",
              maxHeight: "min(78vh, 640px)",
              background: "var(--card)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary-gradient text-white shrink-0">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
                  className="h-10 w-10 rounded-full bg-white/20 grid place-items-center overflow-hidden shrink-0"
                >
                  <KitiMascot size={36} animate={false} type="greeting" />
                </motion.div>
                <div>
                  <div className="font-bold text-sm">Kiti</div>
                  <div className="text-[11px] opacity-85 flex items-center gap-1.5 mt-0.5">
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-emerald-300 inline-block"
                    />
                    {isTyping ? "Kiti is thinking…" : "Your Amazon mentor · always here"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Context banner if URL present */}
            {url && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-[var(--primary-soft)] border-b border-pink-200 px-4 py-2 flex items-center gap-2 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
                <p className="text-[11px] text-[var(--primary)] font-medium truncate">
                  Analyzing: <span className="opacity-70">{url.replace(/https?:\/\//, "").slice(0, 48)}…</span>
                </p>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.map((m, i) => (
                <MessageBubble key={i} msg={m} isLatest={i === messages.length - 1} />
              ))}
              {isTyping && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            {/* Suggestion chips — always show, rotate groups */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="shrink-0 px-3 pb-2"
                >
                  {/* Group tabs */}
                  <div className="flex gap-1.5 mb-2 overflow-x-auto no-scrollbar">
                    {SUGGESTION_GROUPS.map((g, idx) => (
                      <button
                        key={g.label}
                        onClick={() => setActiveSuggGroup(idx)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                          activeSuggGroup === idx
                            ? "bg-primary-gradient text-white shadow-soft"
                            : "bg-muted text-muted-foreground hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  {/* Chips */}
                  <div className="flex gap-1.5 flex-wrap">
                    {currentGroup.chips.map((s) => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] border border-pink-200 hover:bg-pink-100 hover:shadow-soft transition-all font-medium"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input row */}
            <div className="px-3 pb-3 pt-2 border-t border-border/40 flex gap-2 shrink-0 bg-card/80 backdrop-blur-sm">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  placeholder={isTyping ? "Kiti is thinking…" : "Ask Kiti anything…"}
                  className="w-full bg-muted/60 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:bg-card transition-all pr-10 disabled:opacity-60"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  disabled={isTyping}
                />
                {input.trim() && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                  >
                    ✕
                  </motion.button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="h-10 w-10 rounded-2xl bg-primary-gradient grid place-items-center shadow-soft disabled:opacity-40 hover:shadow-glow transition-all shrink-0"
                onClick={() => sendMessage(input)}
                disabled={isTyping || !input.trim()}
              >
                <Send className="h-4 w-4 text-white" />
              </motion.button>
            </div>

            {/* Footer micro-text */}
            <div className="text-center text-[10px] text-muted-foreground pb-2 shrink-0">
              Kiti gives AI advice — always double-check with real data 🐾
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}