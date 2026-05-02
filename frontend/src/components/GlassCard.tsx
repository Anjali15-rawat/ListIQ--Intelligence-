import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  variant?: "default" | "strong" | "soft";
}

export function GlassCard({
  className,
  hover = false,
  variant = "default",
  children,
  ...props
}: GlassCardProps) {
  const variantClass =
    variant === "strong" ? "glass-strong" : variant === "soft" ? "bg-card/80" : "glass";

  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { type: "spring", stiffness: 300 } } : undefined}
      className={cn(
        variantClass,
        "rounded-[2rem] p-7 md:p-8 shadow-card border border-white/50 transition-all duration-300",
        hover && "hover:shadow-hover hover:border-white/80 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
