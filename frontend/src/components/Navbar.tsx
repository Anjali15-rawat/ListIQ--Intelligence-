import { Link, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { KitiMascot } from "@/components/KitiMascot";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 px-4 pt-4"
    >
      <nav className={`mx-auto max-w-6xl rounded-[2rem] px-6 py-3 flex items-center justify-between border transition-all duration-300 ${scrolled ? "glass-strong shadow-elegant border-white/40" : "glass shadow-soft border-white/20"}`}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-primary-gradient grid place-items-center shadow-glow group-hover:shadow-hover transition-all overflow-hidden">
            <KitiMascot type="avatar" size={28} animate={false} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground">ListIQ</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="relative group hover:text-foreground transition-colors py-1">
              {l.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-gradient scale-x-0 group-hover:scale-x-100 transition-transform rounded-full" />
            </a>
          ))}
          <Link to="/dashboard" className="hover:text-foreground transition-colors font-semibold">Dashboard</Link>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="hidden md:flex rounded-full bg-primary-gradient hover:opacity-95 shadow-glow hover:shadow-hover transition-all text-white font-semibold">
            <Link to="/dashboard">Try for free</Link>
          </Button>
          {/* Mobile menu button */}
          <button
            className="md:hidden h-9 w-9 rounded-xl glass grid place-items-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mx-4 mt-2 glass-strong rounded-2xl border border-white/30 shadow-elegant overflow-hidden"
        >
          <div className="p-4 space-y-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2">
              <Button asChild className="w-full rounded-xl bg-primary-gradient text-white">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Try for free</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}