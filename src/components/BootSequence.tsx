import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PixelChuck } from './PixelChuck';

interface Props {
  onStart: () => void;
}

/**
 * Two-stage boot: an INSERT COIN attract loop, then PRESS START.
 * Either click/keypress advances. Clicking on PRESS START fires onStart.
 */
export function BootSequence({ onStart }: Props) {
  const [phase, setPhase] = useState<'coin' | 'start' | 'gone'>('coin');

  useEffect(() => {
    const handler = (e: KeyboardEvent | MouseEvent | TouchEvent) => {
      e.preventDefault?.();
      setPhase((p) => (p === 'coin' ? 'start' : p === 'start' ? 'gone' : p));
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('pointerdown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('pointerdown', handler);
    };
  }, []);

  useEffect(() => {
    if (phase === 'gone') onStart();
  }, [phase, onStart]);

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-nes-deep text-nes-paper px-4"
        >
          {/* Big logo */}
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="pixel-title text-3xl md:text-6xl text-center mb-4"
          >
            CHUCK
            <br />
            NORRIS
          </motion.h1>
          <div className="font-pixel text-[10px] md:text-sm text-nes-red mb-8">
            ARCADE EDITION © 1986 KICK CORP.
          </div>

          {/* Idle pixel Chuck */}
          <div className="animate-sprite-bob mb-10">
            <PixelChuck category="random" scale={6} />
          </div>

          {phase === 'coin' ? (
            <>
              <div className="press-start text-base md:text-2xl">▶ INSERT COIN ◀</div>
              <div className="font-pixel text-[10px] md:text-xs text-nes-paper/60 mt-6">
                Press any key or tap to continue
              </div>
            </>
          ) : (
            <>
              <div className="press-start text-base md:text-2xl">▶ PRESS START ◀</div>
              <div className="font-pixel text-[10px] md:text-xs text-nes-paper/60 mt-6">
                Get ready…
              </div>
            </>
          )}

          <div className="mt-12 grid grid-cols-3 gap-2 text-[10px] md:text-xs font-pixel opacity-80">
            <div className="text-nes-yellow">★ 16 STAGES ★</div>
            <div className="text-nes-green-light">∞ JOKES</div>
            <div className="text-nes-red">1 CHUCK</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
