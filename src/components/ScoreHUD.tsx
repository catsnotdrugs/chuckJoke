import { useEffect, useState } from 'react';
import type { CategoryId } from '../lib/categories';

interface Props {
  score: number;
  stage: CategoryId;
}

export function ScoreHUD({ score, stage }: Props) {
  const [hi] = useState(() => {
    const saved = Number(window.localStorage.getItem('chuck-hi') ?? 0);
    return Number.isFinite(saved) ? saved : 0;
  });

  const [time, setTime] = useState(999);
  useEffect(() => {
    const id = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 999)), 1000);
    return () => clearInterval(id);
  }, []);

  const currentHi = Math.max(hi, score);
  useEffect(() => {
    if (score > hi) window.localStorage.setItem('chuck-hi', String(score));
  }, [score, hi]);

  return (
    <div className="font-pixel text-[10px] md:text-xs text-nes-paper grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-3xl mx-auto px-4">
      <Cell label="1UP" value={pad(score, 6)} valueClass="text-nes-yellow animate-pixel-blink" />
      <Cell label="HI-SCORE" value={pad(currentHi, 6)} valueClass="text-nes-red" />
      <Cell
        label="STAGE"
        value={stage.toUpperCase().slice(0, 8)}
        valueClass="text-nes-blue-light"
      />
      <Cell label="TIME" value={pad(time, 3)} valueClass="text-nes-green-light" />
    </div>
  );
}

function Cell({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-nes-paper/70">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

function pad(n: number, w: number) {
  return n.toString().padStart(w, '0');
}
