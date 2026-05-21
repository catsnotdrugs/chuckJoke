import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  show: boolean;
  onDone: () => void;
}

/**
 * Tiny pixel-Chuck who walks across the bottom of the screen and roundhouse-kicks
 * the air, triggering a screen-shake on the parent. Fires once per session after
 * 15s of inactivity.
 */
export function PixelChuckEgg({ show, onDone }: Props) {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="pixel-chuck"
          initial={{ x: '-15vw', y: 0, opacity: 1 }}
          animate={{ x: ['-15vw', '40vw', '60vw', '115vw'] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 5.5, ease: 'linear', times: [0, 0.4, 0.55, 1] }}
          className="fixed bottom-4 left-0 z-30 pointer-events-none"
        >
          <svg width="56" height="72" viewBox="0 0 14 18" shapeRendering="crispEdges" aria-hidden>
            {/* Body — pixel art Chuck */}
            <rect x="5" y="0" width="4" height="3" fill="#d6a16b" />
            <rect x="4" y="2" width="6" height="2" fill="#6b3a1a" />
            <rect x="5" y="3" width="4" height="2" fill="#d6a16b" />
            <rect x="4" y="5" width="6" height="1" fill="#6b3a1a" />
            <rect x="3" y="6" width="8" height="4" fill="#3a3a3a" />
            <rect x="2" y="7" width="2" height="2" fill="#3a3a3a" />
            <rect x="10" y="7" width="2" height="2" fill="#3a3a3a" />
            <rect x="3" y="10" width="8" height="3" fill="#1a3a6b" />
            <rect x="4" y="13" width="2" height="4" fill="#3a3a3a" />
            <rect x="8" y="13" width="2" height="4" fill="#3a3a3a" />
            <rect x="3" y="17" width="3" height="1" fill="#000" />
            <rect x="8" y="17" width="3" height="1" fill="#000" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
