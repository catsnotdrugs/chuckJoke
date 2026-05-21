import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  text: string;
  /** Re-mount key — restarts the typewriter on each new joke. */
  revealKey: number | string;
  onComplete?: () => void;
}

const CHAR_DELAY = 14;
const GLITCH_CHARS = '@#%&!?█▓░|/\\<>';

export function JokeText({ text, revealKey, onComplete }: Props) {
  const [shown, setShown] = useState('');
  const [glitch, setGlitch] = useState('');

  useEffect(() => {
    let i = 0;
    setShown('');
    setGlitch('');
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      if (i >= text.length) {
        setGlitch('');
        onComplete?.();
        return;
      }
      i += 1;
      setShown(text.slice(0, i));
      setGlitch(
        Math.random() < 0.6
          ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          : '',
      );
      setTimeout(step, CHAR_DELAY + Math.random() * 12);
    };

    const startTimer = setTimeout(step, 60);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [text, revealKey, onComplete]);

  return (
    <motion.p
      key={revealKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="font-action text-2xl md:text-3xl lg:text-4xl leading-tight text-vhs-paper text-center px-4 break-words [text-shadow:0_0_8px_rgba(0,255,209,0.45),_0_0_18px_rgba(255,43,214,0.25)]"
    >
      {shown}
      <span className="text-neon-cyan animate-flicker">{glitch}</span>
    </motion.p>
  );
}
