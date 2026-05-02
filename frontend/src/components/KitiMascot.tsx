import { motion } from "framer-motion";

export type MascotType = "hero" | "thinking" | "loading" | "greeting" | "assistant" | "avatar" | "analyzing" | "curious" | "happycheer" | "insightready";

interface KitiMascotProps {
  size?: number;
  animate?: boolean;
  className?: string;
  type?: MascotType;
}

const typeImages: Record<MascotType, string> = {
  hero: "/kiti-hero.png",
  thinking: "/kiti-thinking.png",
  loading: "/kiti-loading.png",
  greeting: "/kiti-greeting.png",
  assistant: "/kiti-assistant.png",
  avatar: "/kiti-avatar.png",
  analyzing: "/kiti-analyzing.png",
  curious: "/kiti-curious.png",
  happycheer: "/kiti-happycheer.png",
  insightready: "/kiti-insightready.png",
};

const typeAnimations: Record<MascotType, any> = {
  hero: { y: [0, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  greeting: { rotate: [0, 15, -5, 10, 0], transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1 } },
  thinking: { rotate: [0, -5, 5, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  loading: { scale: [1, 0.95, 1], opacity: [1, 0.8, 1], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } },
  assistant: { scale: [1, 1.02, 1], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } },
  avatar: { scale: [1, 1.05, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  analyzing: { rotate: [0, 2, -2, 0], scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
  curious: { rotate: [0, 15, 0], x: [0, 5, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
  happycheer: { scale: [1, 1.1, 1], rotate: [0, -10, 10, -10, 0], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } },
  insightready: { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }
};

export function KitiMascot({ size = 240, animate = true, className = "", type = "hero" }: KitiMascotProps) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        animate: { y: [0, -12, 0] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
      }
    : {};

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Shadow Pulse */}
      {animate && (
        <motion.div
          className="absolute bottom-0 h-4 w-2/3 rounded-full bg-[var(--primary)] blur-xl"
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      
      <Wrapper {...wrapperProps} className="relative z-10">
        <motion.img 
          src={typeImages[type]} 
          alt={`Kiti Mascot - ${type}`} 
          width={size} 
          height={size}
          className="object-contain drop-shadow-xl origin-bottom"
          style={{ width: size, height: size }}
          animate={animate ? typeAnimations[type] : {}}
        />
      </Wrapper>

      {/* Floating Hearts / Sparkles */}
      {animate && type === "analyzing" && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[var(--primary)] text-lg z-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: [-20, -60],
                x: [0, (i % 2 === 0 ? 20 : -20) * (i + 1)],
                scale: [0.5, 1, 0.5],
                rotate: [0, 180]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                delay: i * 0.8,
                ease: "easeOut"
              }}
              style={{
                top: `${20 + i * 15}%`,
                left: `${20 + (i * 25)}%`,
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
      {animate && type !== "analyzing" && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[var(--primary)] text-lg z-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: [-20, -60],
                x: [0, (i % 2 === 0 ? 20 : -20) * (i + 1)],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                delay: i * 0.8,
                ease: "easeOut"
              }}
              style={{
                top: `${20 + i * 15}%`,
                left: `${20 + (i * 25)}%`,
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
