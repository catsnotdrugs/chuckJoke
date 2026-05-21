import { useEffect, useState } from 'react';

export function VHSDateStamp() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const date = `${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${now.getFullYear() % 100}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div className="font-hud text-2xl md:text-3xl leading-none text-neon-paper drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 text-neon-red animate-rec-blink">
          <span className="inline-block h-3 w-3 rounded-full bg-neon-red shadow-neon-red" />
          REC
        </span>
        <span className="opacity-80">{date}</span>
      </div>
      <div className="opacity-90">{time}</div>
      <div className="text-sm opacity-60 mt-1">PLAY ▶  SP</div>
    </div>
  );
}
