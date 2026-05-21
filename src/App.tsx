import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScanlineOverlay } from './components/ScanlineOverlay';
import { GrainOverlay } from './components/GrainOverlay';
import { HeroBanner } from './components/HeroBanner';
import { JokeStage } from './components/JokeStage';
import { CategoryDial } from './components/CategoryDial';
import { ActionButton } from './components/ActionButton';
import { VHSDateStamp } from './components/VHSDateStamp';
import { AudioToggle } from './components/AudioToggle';
import { FBIWarning } from './components/FBIWarning';
import { TrackingToggle } from './components/TrackingToggle';
import { ChuckPortrait } from './components/ChuckPortrait';
import { PixelChuckEgg } from './components/PixelChuckEgg';
import { useChuckJoke } from './hooks/useChuckJoke';
import { useSfx } from './hooks/useSfx';
import { CATEGORIES, RANDOM, type CategoryId } from './lib/categories';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export default function App() {
  const [bootDone, setBootDone] = useState(false);
  const [category, setCategory] = useState<CategoryId>('random');
  const [muted, setMuted] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [konami, setKonami] = useState(false);
  const [eggShown, setEggShown] = useState(false);
  const [eggActive, setEggActive] = useState(false);
  const [shake, setShake] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  const { joke, isLoading, error, ticket, refresh } = useChuckJoke(category);
  const sfx = useSfx(muted);

  // Play punch on each new joke ticket.
  const prevTicketRef = useRef(0);
  useEffect(() => {
    if (ticket > 0 && ticket !== prevTicketRef.current) {
      prevTicketRef.current = ticket;
      sfx.playStatic();
      window.setTimeout(() => sfx.playPunch(), 120);
    }
  }, [ticket, sfx]);

  // Konami listener
  useEffect(() => {
    const seq: string[] = [];
    const handler = (e: KeyboardEvent) => {
      seq.push(e.key);
      while (seq.length > KONAMI.length) seq.shift();
      if (seq.join(',').toLowerCase() === KONAMI.join(',').toLowerCase()) {
        setKonami(true);
        setCategory('explicit');
        sfx.playWhoosh();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sfx]);

  // Idle Easter egg trigger
  const resetIdle = useCallback(() => {
    if (eggShown) return;
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setEggShown(true);
      setEggActive(true);
      // Mid-walk, shake the screen
      window.setTimeout(() => {
        setShake(true);
        sfx.playPunch();
        window.setTimeout(() => setShake(false), 500);
      }, 2400);
    }, 15000);
  }, [eggShown, sfx]);

  useEffect(() => {
    if (!bootDone) return;
    resetIdle();
    const events = ['mousemove', 'keydown', 'click', 'touchstart'] as const;
    events.forEach((evt) => window.addEventListener(evt, resetIdle));
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetIdle));
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [bootDone, resetIdle]);

  const activeHue = useMemo(() => {
    if (category === RANDOM.id) return RANDOM.hue;
    return CATEGORIES.find((c) => c.id === category)?.hue ?? RANDOM.hue;
  }, [category]);

  const handlePick = useCallback(
    (id: CategoryId) => {
      sfx.playClick();
      setCategory(id);
      if (id === category) refresh();
    },
    [category, refresh, sfx],
  );

  const handleHit = useCallback(() => {
    sfx.playWhoosh();
    refresh();
  }, [refresh, sfx]);

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${
        konami ? 'sepia-0 [filter:hue-rotate(320deg)_saturate(1.4)]' : ''
      }`}
    >
      {!bootDone && <FBIWarning onDismiss={() => setBootDone(true)} />}

      {/* Boot static sweep */}
      <AnimatePresence>
        {bootDone && (
          <motion.div
            key="boot-bars"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
          >
            <div className="absolute inset-x-0 h-1/3 animate-boot-bars bg-gradient-to-b from-white via-white/80 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen container with optional tracking jitter */}
      <motion.div
        animate={
          shake
            ? { x: [0, -14, 14, -10, 10, -4, 0], y: [0, 6, -8, 4, -6, 2, 0] }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.5 }}
        className={`relative z-10 min-h-screen w-full ${tracking ? 'animate-tracking-jitter' : ''}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,720px)_1fr] gap-6 px-4 md:px-10 py-6 min-h-screen items-center">
          {/* Left column — HUD */}
          <aside className="hidden lg:flex flex-col items-start gap-6">
            <VHSDateStamp />
            <div className="font-hud text-xl text-vhs-paper/60 max-w-[18ch] leading-snug">
              <span className="text-neon-cyan">SIGNAL:</span> STRONG
              <br />
              <span className="text-neon-cyan">FEED:</span> chucknorris.io
              <br />
              <span className="text-neon-cyan">MODE:</span>{' '}
              <span className="text-neon-red">{konami ? 'EXPLICIT' : 'NORMAL'}</span>
            </div>
            <div className="h-64 w-full max-w-[260px]">
              <ChuckPortrait category={category} hue={activeHue} />
            </div>
          </aside>

          {/* Center column — Hero + Stage + Controls */}
          <main className="flex flex-col items-center gap-6 w-full">
            <HeroBanner />
            <JokeStage
              joke={joke}
              isLoading={isLoading}
              error={error}
              ticket={ticket}
              hue={activeHue}
            />
            <ActionButton onClick={handleHit} disabled={isLoading} />
            <CategoryDial active={category} onPick={handlePick} />
          </main>

          {/* Right column — controls */}
          <aside className="hidden lg:flex flex-col items-end gap-6">
            <div className="flex flex-col items-end gap-3">
              <AudioToggle muted={muted} onToggle={() => setMuted((m) => !m)} />
              <TrackingToggle active={tracking} onPress={setTracking} />
            </div>
            <div className="font-hud text-right text-base text-vhs-paper/60 max-w-[20ch] leading-snug">
              <div className="text-neon-amber">★ TIP ★</div>
              <div className="mt-1">
                Hold TRACKING to wobble the picture.
              </div>
              <div className="mt-3 text-neon-cyan">★ EASTER ★</div>
              <div className="mt-1">Try the Konami code.</div>
            </div>
            <div className="text-right font-hud text-2xl text-neon-amber">
              <div className="text-xs uppercase tracking-widest text-vhs-paper/50">FACTS DELIVERED</div>
              <div className="text-3xl vcr-counter">{String(ticket).padStart(4, '0')}</div>
            </div>
          </aside>
        </div>

        {/* Mobile controls — surface them outside the aside columns on small screens */}
        <div className="lg:hidden flex items-center justify-between gap-3 px-4 pb-6">
          <VHSDateStamp />
          <div className="flex flex-col items-end gap-2">
            <AudioToggle muted={muted} onToggle={() => setMuted((m) => !m)} />
            <TrackingToggle active={tracking} onPress={setTracking} />
          </div>
        </div>
      </motion.div>

      <PixelChuckEgg show={eggActive} onDone={() => setEggActive(false)} />

      <ScanlineOverlay />
      <GrainOverlay />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-30"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />
    </div>
  );
}
