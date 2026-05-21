import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  onDismiss: () => void;
}

export function FBIWarning({ onDismiss }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    const t2 = setTimeout(() => onDismiss(), 2700);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="fbi"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black text-vhs-paper cursor-pointer"
          onClick={() => setVisible(false)}
          role="button"
          aria-label="Dismiss warning"
        >
          <motion.div
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl px-6"
          >
            <div className="font-hud text-3xl md:text-5xl tracking-[0.4em] text-neon-amber mb-4">
              ⚠ WARNING ⚠
            </div>
            <h2 className="font-display text-2xl md:text-4xl mb-6">
              FEDERAL BUREAU OF INVESTIGATION
            </h2>
            <p className="font-hud text-base md:text-xl leading-relaxed text-vhs-paper/80">
              The unauthorized reproduction or distribution of Chuck Norris facts is
              punishable by roundhouse kick.
              <br />
              <br />
              Maximum penalty: <span className="text-neon-red">infinite push-ups</span>.
            </p>
            <div className="mt-8 font-hud text-sm uppercase tracking-widest text-vhs-paper/50">
              CLICK / TAP TO PROCEED — Auto-dismiss in 2s
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
