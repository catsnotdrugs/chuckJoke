import { useMemo } from 'react';

/**
 * Three-layer parallax pixel starfield. Each layer is a wide SVG strip rendered
 * twice side-by-side so it can scroll-X infinitely via a Tailwind keyframe.
 */
export function StarfieldBg() {
  const layers = useMemo(
    () => [
      { count: 50, size: 2, color: '#3060e8', alpha: 0.6, animClass: 'animate-scroll-x-slow' },
      { count: 30, size: 3, color: '#80c8f8', alpha: 0.9, animClass: 'animate-scroll-x-med' },
      { count: 16, size: 4, color: '#fcfcfc', alpha: 1, animClass: 'animate-scroll-x-fast' },
    ],
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Sky gradient bottom-to-top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #000010 0%, #001038 55%, #0030a0 90%, #7028b8 100%)',
        }}
      />

      {layers.map((layer, li) => (
        <div
          key={li}
          className={`absolute inset-x-0 top-0 h-full ${layer.animClass}`}
          style={{ width: '200%' }}
        >
          <Stars
            count={layer.count}
            size={layer.size}
            color={layer.color}
            alpha={layer.alpha}
            seed={li * 13}
          />
        </div>
      ))}

      {/* Distant pixel "mountains" — silhouette horizon */}
      <svg
        viewBox="0 0 320 60"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-1/3"
        aria-hidden
      >
        <polygon
          points="0,60 0,30 25,12 50,28 80,8 110,24 140,6 170,28 200,14 230,30 260,10 290,26 320,16 320,60"
          fill="#0030a0"
        />
        <polygon
          points="0,60 0,40 30,28 60,40 95,20 130,38 170,24 210,40 250,28 290,38 320,30 320,60"
          fill="#000010"
        />
      </svg>

      {/* Pixel grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          backgroundImage:
            'linear-gradient(0deg, rgba(48,96,232,0.4) 0%, transparent 100%), repeating-linear-gradient(0deg, rgba(252,212,64,0.3) 0px, rgba(252,212,64,0.3) 2px, transparent 2px, transparent 16px), repeating-linear-gradient(90deg, rgba(252,212,64,0.3) 0px, rgba(252,212,64,0.3) 2px, transparent 2px, transparent 24px)',
          transform: 'perspective(200px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />
    </div>
  );
}

function Stars({
  count,
  size,
  color,
  alpha,
  seed,
}: {
  count: number;
  size: number;
  color: string;
  alpha: number;
  seed: number;
}) {
  const rng = mulberry32(seed + 1);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 100"
      preserveAspectRatio="none"
      style={{ opacity: alpha }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = rng() * 200;
        const y = rng() * 100;
        const twinkle = rng() > 0.6;
        return (
          <rect
            key={i}
            x={x.toFixed(2)}
            y={y.toFixed(2)}
            width={size / 4}
            height={size / 4}
            fill={color}
            className={twinkle ? 'animate-star-twinkle' : ''}
            style={twinkle ? { animationDelay: `${(rng() * 1.6).toFixed(2)}s` } : undefined}
          />
        );
      })}
    </svg>
  );
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
