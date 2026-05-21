import { motion } from 'framer-motion';

export function HeroBanner() {
  return (
    <header className="relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="font-hud uppercase tracking-[0.4em] text-neon-cyan/80 text-sm md:text-base"
      >
        ── BROADCASTING SINCE 1940 ──
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 1.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 220 }}
        className="font-display text-6xl md:text-8xl lg:text-9xl leading-none mt-2"
      >
        <span className="chromatic text-vhs-paper neon-text animate-chrome-shift" data-text="CHUCK">
          CHUCK
        </span>{' '}
        <span className="chromatic text-neon-red neon-text" data-text="NORRIS">
          NORRIS
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="font-action uppercase text-xl md:text-3xl text-neon-amber tracking-[0.3em] mt-3"
      >
        Facts. Not Jokes.
      </motion.div>
    </header>
  );
}
