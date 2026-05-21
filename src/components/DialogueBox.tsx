import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  text: string;
  revealKey: number | string;
  speaker?: string;
  isLoading?: boolean;
  error?: string | null;
  onCharBeep?: () => void;
}

const CHAR_DELAY = 26;

export function DialogueBox({
  text,
  revealKey,
  speaker = 'CHUCK',
  isLoading,
  error,
  onCharBeep,
}: Props) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown('');
    setDone(false);
    if (isLoading || error) return;
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) {
        setDone(true);
        return;
      }
      i += 1;
      setShown(text.slice(0, i));
      if (i % 2 === 0) onCharBeep?.();
      setTimeout(tick, CHAR_DELAY);
    };
    const start = setTimeout(tick, 80);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [text, revealKey, isLoading, error, onCharBeep]);

  return (
    <div className={`pixel-panel relative w-full max-w-3xl mx-auto ${done ? 'dialog-arrow' : ''}`}>
      {/* Speaker tag (NES-style tab on top) */}
      <div className="absolute -top-4 left-6 bg-nes-yellow text-nes-deep font-pixel text-[10px] md:text-xs px-2 py-1 border-4 border-nes-paper">
        {speaker}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-pixel text-nes-blue-light text-sm md:text-base leading-relaxed min-h-[6rem]"
          >
            CONNECTING TO HOST<DotDot />
          </motion.p>
        ) : error ? (
          <motion.p
            key="err"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-pixel text-nes-red text-sm md:text-base leading-relaxed min-h-[6rem]"
          >
            ! SIGNAL JAMMED !<br />
            <span className="text-nes-paper/70 text-xs">{error}</span>
          </motion.p>
        ) : (
          <motion.p
            key={revealKey}
            initial={{ opacity: 1 }}
            className="font-pixel text-nes-paper text-sm md:text-base leading-relaxed min-h-[6rem] whitespace-pre-wrap"
          >
            {shown}
            {!done && <span className="text-nes-yellow animate-pixel-blink">█</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function DotDot() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setN((x) => (x % 3) + 1), 400);
    return () => clearInterval(id);
  }, []);
  return <span>{'.'.repeat(n)}</span>;
}
