import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ onClick, disabled }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: 1.04,
        x: [-1, 1, -1, 1, 0],
        transition: { x: { duration: 0.25, repeat: Infinity } },
      }}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden font-display text-2xl md:text-4xl uppercase
        px-8 md:px-12 py-4 md:py-6 rounded-md
        bg-neon-red text-vhs-paper border-2 border-vhs-paper
        shadow-[0_0_20px_rgba(255,31,61,0.7),inset_0_0_20px_rgba(0,0,0,0.4)]
        hover:shadow-[0_0_40px_rgba(255,31,61,0.95)]
        disabled:opacity-60 disabled:cursor-not-allowed
        tracking-wider"
    >
      <span className="inline-flex items-center gap-3">
        <Zap size={28} className="-mt-1" />
        Hit Me, Chuck
        <Zap size={28} className="-mt-1 scale-x-[-1]" />
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px bg-vhs-paper/40"
      />
    </motion.button>
  );
}
