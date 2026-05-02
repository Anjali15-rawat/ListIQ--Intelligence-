import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, History, Eye, Settings, Sparkles, Store, ShoppingCart, X, Bell, Moon, Sun, Globe, Shield, User, Check, Mail, Lock } from "lucide-react";
import { KitiMascot } from "./KitiMascot";
import { useState, useEffect } from "react";

interface SidebarProps {
  active: string;
  onChange: (tab: string) => void;
  perspective: "seller" | "buyer";
}

const sellerItems = [
  { id: "audit",        label: "Listing Audit",   icon: LayoutDashboard },
  { id: "time-machine", label: "Time Machine",     icon: History },
  { id: "competitor",   label: "Competitor Spy",   icon: Eye },
];

const buyerItems = [
  { id: "audit",        label: "Product Review",       icon: LayoutDashboard },
  { id: "time-machine", label: "Quality Over Time",     icon: History },
  { id: "competitor",   label: "Compare Alternatives",  icon: Eye },
];

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2 px-5 py-3 rounded-2xl bg-foreground text-background text-sm font-medium shadow-elegant"
    >
      <Check className="h-4 w-4 text-emerald-400" />
      {message}
    </motion.div>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
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
            <Shield className="h-5 w-5 text-[var(--primary)]" /> Privacy & Data
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-xl hover:bg-white/60 grid place-items-center transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <h3 className="font-semibold text-foreground text-base">Data We Collect</h3>
          <p>ListIQ collects the Amazon product URLs you submit, analysis results, and basic usage data to improve our service. We do <strong className="text-foreground">not</strong> store your Amazon credentials.</p>
          <h3 className="font-semibold text-foreground text-base">How We Use It</h3>
          <p>Your data is used solely to generate listing intelligence reports. We never sell your data to third parties. Analysis results are cached for 24 hours to improve performance.</p>
          <h3 className="font-semibold text-foreground text-base">Your Rights</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>Request deletion of your data at any time</li>
            <li>Export your analysis history as CSV</li>
            <li>Opt out of usage analytics</li>
            <li>Contact us at privacy@listiq.ai</li>
          </ul>
          <h3 className="font-semibold text-foreground text-base">Cookies</h3>
          <p>We use essential cookies for session management and optional analytics cookies. You can disable analytics cookies without affecting core functionality.</p>
          <p className="text-xs pt-2 border-t border-border/30">Last updated: May 2026 · Questions? <span className="text-[var(--primary)]">privacy@listiq.ai</span></p>
        </div>
        <div className="px-6 py-4 border-t border-border/30 shrink-0">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EditProfileModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string, email: string) => void }) {
  const [name, setName] = useState("Seller Account");
  const [email, setEmail] = useState("seller@example.com");
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-card rounded-3xl shadow-elegant border border-border/50 w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[var(--primary-soft)]">
          <div className="flex items-center gap-2 font-bold text-lg">
            <User className="h-5 w-5 text-[var(--primary)]" /> Edit Profile
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-xl hover:bg-white/60 grid place-items-center transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 rounded-2xl bg-primary-gradient grid place-items-center text-white font-bold text-2xl shadow-soft">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/50 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/50 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/50 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
            <button
              onClick={() => { onSave(name, email); onClose(); }}
              className="flex-1 py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Save Profile
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [auditAlerts, setAuditAlerts] = useState(false);
  const [marketplace, setMarketplace] = useState("amazon.com");
  const [profileName, setProfileName] = useState("Seller Account");
  const [profileEmail, setProfileEmail] = useState("seller@example.com");
  const [toast, setToast] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "account">("general");

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleSave = () => {
    setToast("Settings saved successfully!");
    onClose();
  };

  const tabs = [
    { id: "general" as const, label: "General" },
    { id: "notifications" as const, label: "Notifications" },
    { id: "account" as const, label: "Account" },
  ];

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-card rounded-3xl shadow-elegant border border-border/50 w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[var(--primary-soft)]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary-gradient grid place-items-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg">Settings</span>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-xl hover:bg-white/60 grid place-items-center transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/30 px-4 pt-3">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-t-xl ${activeTab === t.id ? "text-[var(--primary)]" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <motion.div layoutId="settings-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-gradient rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "general" && (
                  <motion.div key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="space-y-4">
                    {/* Profile card */}
                    <div className="glass rounded-2xl p-4 flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-primary-gradient grid place-items-center text-white font-bold text-lg shadow-soft shrink-0">
                        {profileName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{profileName}</div>
                        <div className="text-xs text-muted-foreground truncate">{profileEmail}</div>
                      </div>
                      <button onClick={() => setEditOpen(true)} className="ml-auto text-xs text-[var(--primary)] font-semibold hover:underline shrink-0">Edit</button>
                    </div>

                    {/* Dark Mode */}
                    <div className="flex items-center justify-between py-3 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        {darkMode ? <Moon className="h-4 w-4 text-[var(--primary)]" /> : <Sun className="h-4 w-4 text-amber-500" />}
                        <div>
                          <div className="text-sm font-medium">Dark Mode</div>
                          <div className="text-xs text-muted-foreground">{darkMode ? "Dark theme active" : "Light theme active"}</div>
                        </div>
                      </div>
                      <button onClick={toggleDark} className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? "bg-primary-gradient" : "bg-muted"}`}>
                        <motion.div animate={{ x: darkMode ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft" />
                      </button>
                    </div>

                    {/* Marketplace */}
                    <div className="flex items-center justify-between py-3 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-[var(--primary)]" />
                        <div>
                          <div className="text-sm font-medium">Default Marketplace</div>
                          <div className="text-xs text-muted-foreground">Primary Amazon region</div>
                        </div>
                      </div>
                      <select value={marketplace} onChange={e => setMarketplace(e.target.value)} className="text-xs border border-border rounded-xl px-3 py-1.5 bg-card outline-none focus:ring-2 focus:ring-[var(--primary)]/30 cursor-pointer">
                        <option>amazon.com</option>
                        <option>amazon.in</option>
                        <option>amazon.co.uk</option>
                        <option>amazon.de</option>
                        <option>amazon.fr</option>
                        <option>amazon.ca</option>
                        <option>amazon.com.au</option>
                      </select>
                    </div>

                    {/* Privacy */}
                    <div className="flex items-center gap-3 py-3">
                      <Shield className="h-4 w-4 text-[var(--primary)]" />
                      <div className="text-sm font-medium">Privacy & Data</div>
                      <button onClick={() => setPrivacyOpen(true)} className="ml-auto text-xs text-[var(--primary)] font-semibold hover:underline">Manage →</button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "notifications" && (
                  <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="space-y-1">
                    {[
                      { label: "Email Notifications", desc: "Audit results & alerts", icon: Bell, state: emailNotifs, setState: setEmailNotifs },
                      { label: "Audit Completion Alerts", desc: "Notify when scan finishes", icon: Check, state: auditAlerts, setState: setAuditAlerts },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-border/30 last:border-0">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-[var(--primary)]" />
                            <div>
                              <div className="text-sm font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                          </div>
                          <button onClick={() => item.setState(!item.state)} className={`w-11 h-6 rounded-full transition-colors relative ${item.state ? "bg-primary-gradient" : "bg-muted"}`}>
                            <motion.div animate={{ x: item.state ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft" />
                          </button>
                        </div>
                      );
                    })}
                    <p className="text-xs text-muted-foreground pt-2">Notifications are sent to <span className="text-foreground font-medium">{profileEmail}</span></p>
                  </motion.div>
                )}

                {activeTab === "account" && (
                  <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="space-y-4">
                    <div className="glass rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-semibold text-[var(--primary)]">✨ Pro</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Audits this month</span>
                        <span className="font-semibold">13 / 100</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "13%" }} transition={{ delay: 0.3, duration: 0.8 }} className="h-2 bg-primary-gradient rounded-full" />
                      </div>
                      <button className="w-full py-2 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-xs font-semibold hover:bg-[var(--primary-soft)] transition-colors">
                        Upgrade to Max →
                      </button>
                    </div>
                    <button onClick={() => setEditOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
                      <User className="h-4 w-4 text-[var(--primary)]" /> Edit Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors text-sm font-medium">
                      <X className="h-4 w-4" /> Delete Account
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-5 pb-5">
              <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold shadow-soft hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast("")} />}
      </AnimatePresence>

      <AnimatePresence>
        {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} onSave={(n, e) => { setProfileName(n); setProfileEmail(e); setToast("Profile updated!"); }} />}
      </AnimatePresence>
    </>
  );
}

export function Sidebar({ active, onChange, perspective }: SidebarProps) {
  const items = perspective === "buyer" ? buyerItems : sellerItems;
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 p-4 border-r border-border/50 bg-sidebar/60 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="h-9 w-9 rounded-xl bg-primary-gradient grid place-items-center shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg">ListIQ</span>
        </Link>

        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-4 text-xs font-semibold border ${perspective === "buyer" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-[var(--primary-soft)] text-[var(--primary)] border-pink-200"}`}>
          {perspective === "buyer" ? <><ShoppingCart className="h-3.5 w-3.5" /> Buyer Perspective</> : <><Store className="h-3.5 w-3.5" /> Seller Perspective</>}
        </div>

        <div className="flex items-center gap-3 rounded-2xl glass p-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-[var(--sky-soft)] grid place-items-center overflow-hidden">
            <KitiMascot size={36} animate={false} type="avatar" />
          </div>
          <div className="text-xs">
            <div className="font-semibold">Kiti</div>
            <div className="text-muted-foreground flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              Online · ready
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => onChange(item.id)}
                className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
              >
                {isActive && <motion.div layoutId="active-tab" className="absolute inset-0 rounded-xl bg-primary-gradient shadow-soft" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <Icon className={`relative h-4 w-4 ${isActive ? "text-white" : ""}`} />
                <span className={`relative ${isActive ? "text-white" : ""}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors group"
        >
          <Settings className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
          Settings
        </button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50 flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? "text-[var(--primary)]" : "text-muted-foreground"}`}
            >
              <div className="relative">
                {isActive && <motion.div layoutId="mobile-active" className="absolute inset-0 rounded-lg bg-[var(--primary-soft)]" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <Icon className="relative h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
        <button onClick={() => setSettingsOpen(true)} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-muted-foreground">
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>

      <AnimatePresence>{settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}</AnimatePresence>
    </>
  );
}