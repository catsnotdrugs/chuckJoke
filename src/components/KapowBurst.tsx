import { motion } from 'framer-motion';

interface Props {
  /** Force-remount key to retrigger animation on each joke. */
  burstKey: number | string;
  hue?: string;
}

export function KapowBurst({ burstKey, hue = '#ff1f3d' }: Props) {
  return (
    <motion.svg
      key={burstKey}
      viewBox="-100 -100 200 200"
      className="pointer-events-none absolute inset-0 m-auto h-full w-full"
      initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
      animate={{ opacity: [0, 0.95, 0], scale: [0.4, 1.1, 1.4], rotate: [-18, -4, 4] }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`burst-${burstKey}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={hue} stopOpacity="0.95" />
          <stop offset="60%" stopColor={hue} stopOpacity="0.35" />
          <stop offset="100%" stopColor={hue} stopOpacity="0" />
        </radialGradient>
      </defs>
      <polygon
        points={spikedPolygon(20, 90, 40)}
        fill={`url(#burst-${burstKey})`}
        stroke={hue}
        strokeWidth="2"
        strokeOpacity="0.8"
      />
      <polygon
        points={spikedPolygon(16, 70, 30)}
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
    </motion.svg>
  );
}

function spikedPolygon(points: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(' ');
}
