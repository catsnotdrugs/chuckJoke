import { AnimatePresence, motion } from 'framer-motion';
import type { CategoryId } from '../lib/categories';

/**
 * Stylized SVG portraits of Chuck Norris, swapped by category.
 * Each portrait is a bold 80s action-poster silhouette with neon accents —
 * intentionally illustrative, not photoreal.
 */
interface Props {
  category: CategoryId;
  hue: string;
}

export function ChuckPortrait({ category, hue }: Props) {
  const pose = poseFor(category);

  return (
    <div className="relative h-full w-full">
      {/* Sun / target ring backdrop */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="sky" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor={hue} stopOpacity="0.55" />
            <stop offset="50%" stopColor="#7a3cff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06060c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="horizon" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff2bd6" stopOpacity="0.0" />
            <stop offset="80%" stopColor="#ff2bd6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff1f3d" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="400" height="400" fill="url(#sky)" />
        {/* Sun */}
        <circle cx="200" cy="220" r="120" fill={hue} opacity="0.35" />
        <circle cx="200" cy="220" r="86" fill={hue} opacity="0.55" />
        {/* Sun stripes */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x="80"
            y={200 + i * 14}
            width="240"
            height="6"
            fill="#06060c"
            opacity={1 - i * 0.12}
          />
        ))}
        {/* Horizon strip */}
        <rect x="0" y="300" width="400" height="100" fill="url(#horizon)" />
        {/* Grid floor */}
        <g stroke={hue} strokeOpacity="0.6" strokeWidth="1" fill="none">
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              x2="400"
              y1={310 + i * 12}
              y2={310 + i * 12}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => {
            const x = 200 + (i - 5.5) * 60;
            return <line key={`v${i}`} x1="200" y1="305" x2={x} y2="400" />;
          })}
        </g>
      </svg>

      <AnimatePresence mode="wait">
        <motion.svg
          key={pose.key}
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
          transition={{ duration: 0.4 }}
          aria-hidden
        >
          {/* Chuck silhouette body — universal beneath every pose */}
          <g fill="#06060c" stroke={hue} strokeWidth="2.5">
            {/* Torso */}
            <path d="M150 250 Q150 195 200 190 Q250 195 250 250 L260 330 L140 330 Z" />
            {/* Shoulders / lapels */}
            <path d="M150 250 L120 270 L130 320 L150 320 Z" />
            <path d="M250 250 L280 270 L270 320 L250 320 Z" />
            {/* Head */}
            <ellipse cx="200" cy="155" rx="42" ry="48" />
            {/* Beard */}
            <path
              d="M168 170 Q168 215 200 222 Q232 215 232 170 Q232 200 200 205 Q168 200 168 170 Z"
              fill={hue}
              fillOpacity="0.85"
              stroke="none"
            />
            {/* Hair */}
            <path
              d="M160 130 Q170 105 200 102 Q230 105 240 130 Q230 118 200 116 Q170 118 160 130 Z"
              fill={hue}
              fillOpacity="0.7"
              stroke="none"
            />
            {/* Eyes — slit, intense */}
            <rect x="178" y="148" width="14" height="3" fill={hue} />
            <rect x="208" y="148" width="14" height="3" fill={hue} />
            {/* Brow */}
            <path d="M174 142 L194 144 M206 144 L226 142" stroke={hue} strokeWidth="2" />
          </g>

          {/* Pose-specific accessory */}
          {pose.accessory}
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}

function poseFor(category: CategoryId): { key: string; accessory: JSX.Element } {
  switch (category) {
    case 'movie':
      return {
        key: 'movie',
        accessory: (
          <g>
            {/* Cowboy hat */}
            <path
              d="M150 110 Q170 80 200 78 Q230 80 250 110 L260 118 Q230 108 200 108 Q170 108 140 118 Z"
              fill="#06060c"
              stroke="#ffb627"
              strokeWidth="2"
            />
          </g>
        ),
      };
    case 'dev':
    case 'science':
      return {
        key: 'lab',
        accessory: (
          <g>
            {/* Lab coat collar */}
            <path d="M155 245 L200 270 L245 245 L240 320 L160 320 Z" fill="#f2efe6" opacity="0.9" />
            {/* Glasses */}
            <g stroke="#00ffd1" strokeWidth="2.5" fill="none">
              <circle cx="183" cy="150" r="9" />
              <circle cx="217" cy="150" r="9" />
              <line x1="192" y1="150" x2="208" y2="150" />
            </g>
          </g>
        ),
      };
    case 'sport':
      return {
        key: 'sport',
        accessory: (
          <g>
            {/* Headband */}
            <rect x="158" y="128" width="84" height="9" fill="#ff1f3d" />
            <rect x="158" y="128" width="84" height="3" fill="#fff" opacity="0.6" />
          </g>
        ),
      };
    case 'music':
      return {
        key: 'music',
        accessory: (
          <g>
            {/* Star shades */}
            <g fill="#ff2bd6" stroke="#fff" strokeWidth="1.5">
              <rect x="170" y="142" width="22" height="12" rx="2" />
              <rect x="208" y="142" width="22" height="12" rx="2" />
              <line x1="192" y1="148" x2="208" y2="148" stroke="#fff" />
            </g>
          </g>
        ),
      };
    case 'food':
      return {
        key: 'food',
        accessory: (
          <g>
            {/* Chef hat */}
            <path
              d="M165 108 Q170 80 200 84 Q230 80 235 108 L235 120 L165 120 Z"
              fill="#f2efe6"
              stroke="#06060c"
              strokeWidth="2"
            />
          </g>
        ),
      };
    case 'history':
    case 'religion':
      return {
        key: 'history',
        accessory: (
          <g>
            {/* Halo */}
            <ellipse
              cx="200"
              cy="100"
              rx="58"
              ry="10"
              fill="none"
              stroke="#ffb627"
              strokeWidth="3"
              opacity="0.85"
            />
          </g>
        ),
      };
    case 'money':
      return {
        key: 'money',
        accessory: (
          <g>
            {/* Sunglasses */}
            <g fill="#06060c" stroke="#ffb627" strokeWidth="2">
              <rect x="170" y="142" width="22" height="12" rx="3" />
              <rect x="208" y="142" width="22" height="12" rx="3" />
            </g>
            {/* Tie */}
            <polygon points="195,255 205,255 210,330 190,330" fill="#ffb627" />
          </g>
        ),
      };
    case 'fashion':
    case 'celebrity':
      return {
        key: 'celeb',
        accessory: (
          <g>
            {/* Aviators */}
            <g fill="#06060c" stroke="#ff2bd6" strokeWidth="2.5">
              <ellipse cx="183" cy="150" rx="11" ry="8" />
              <ellipse cx="217" cy="150" rx="11" ry="8" />
              <line x1="194" y1="150" x2="206" y2="150" stroke="#ff2bd6" />
            </g>
            {/* Scarf */}
            <path d="M158 250 L200 270 L242 250 L250 320 L150 320 Z" fill="#ff2bd6" opacity="0.5" />
          </g>
        ),
      };
    case 'political':
      return {
        key: 'political',
        accessory: (
          <g>
            {/* Top hat */}
            <rect x="172" y="88" width="56" height="32" fill="#06060c" stroke="#ff1f3d" strokeWidth="2" />
            <rect x="160" y="118" width="80" height="6" fill="#06060c" stroke="#ff1f3d" strokeWidth="2" />
            <rect x="172" y="100" width="56" height="4" fill="#ff1f3d" />
          </g>
        ),
      };
    case 'travel':
      return {
        key: 'travel',
        accessory: (
          <g>
            {/* Pilot cap brim */}
            <rect x="160" y="120" width="80" height="6" fill="#06060c" stroke="#00ffd1" strokeWidth="2" />
            <path d="M168 110 L232 110 L232 122 L168 122 Z" fill="#06060c" stroke="#00ffd1" strokeWidth="2" />
            <circle cx="200" cy="116" r="3" fill="#ffb627" />
          </g>
        ),
      };
    case 'animal':
      return {
        key: 'animal',
        accessory: (
          <g>
            {/* Bandana */}
            <path
              d="M158 138 L200 130 L242 138 L240 148 L160 148 Z"
              fill="#ff1f3d"
              stroke="#06060c"
              strokeWidth="1.5"
            />
            <circle cx="180" cy="142" r="1.5" fill="#fff" />
            <circle cx="200" cy="139" r="1.5" fill="#fff" />
            <circle cx="220" cy="142" r="1.5" fill="#fff" />
          </g>
        ),
      };
    case 'career':
      return {
        key: 'career',
        accessory: (
          <g>
            {/* Tie */}
            <polygon points="194,255 206,255 212,330 188,330" fill="#00ffd1" />
            <polygon points="194,255 206,255 200,272" fill="#06060c" />
          </g>
        ),
      };
    case 'explicit':
      return {
        key: 'explicit',
        accessory: (
          <g>
            {/* Censor bar over eyes */}
            <rect x="158" y="144" width="84" height="12" fill="#ff1f3d" />
            <text
              x="200"
              y="154"
              textAnchor="middle"
              fontFamily="VT323, monospace"
              fontSize="11"
              fill="#fff"
            >
              CENSORED
            </text>
          </g>
        ),
      };
    case 'random':
    default:
      return {
        key: 'random',
        accessory: (
          <g>
            {/* Lone star */}
            <polygon
              points="200,68 207,84 224,84 210,94 215,110 200,100 185,110 190,94 176,84 193,84"
              fill="#ffb627"
              stroke="#06060c"
              strokeWidth="1.5"
            />
          </g>
        ),
      };
  }
}
