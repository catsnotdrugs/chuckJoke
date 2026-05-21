import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BootSequence } from './components/BootSequence';
import { StarfieldBg } from './components/StarfieldBg';
import { PixelChuck } from './components/PixelChuck';
import { ScoreHUD } from './components/ScoreHUD';
import { DialogueBox } from './components/DialogueBox';
import { StageSelect } from './components/StageSelect';
import { ArcadeControls } from './components/ArcadeControls';
import { useChuckJoke } from './hooks/useChuckJoke';
import { useSfx } from './hooks/useSfx';
import { useChiptune } from './hooks/useChiptune';
import type { CategoryId } from './lib/categories';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [category, setCategory] = useState<CategoryId>('random');
  const [muted, setMuted] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [score, setScore] = useState(0);
  const [punching, setPunching] = useState(false);

  const { joke, isLoading, error, ticket, refresh } = useChuckJoke(category);
  const sfx = useSfx(muted);
  useChiptune(musicOn && booted);

  // Reveal effects on each new joke ticket.
  useEffect(() => {
    if (ticket === 0) return;
    sfx.playPunch();
    setPunching(true);
    const id = setTimeout(() => setPunching(false), 250);
    setScore((s) => s + 100 + Math.floor(Math.random() * 50));
    return () => clearTimeout(id);
  }, [ticket, sfx]);

  const handlePick = useCallback(
    (id: CategoryId) => {
      sfx.playSelect();
      setCategory(id);
      if (id === category) refresh();
    },
    [category, refresh, sfx],
  );

  const handleHit = useCallback(() => {
    sfx.playSelect();
    refresh();
  }, [refresh, sfx]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-nes-deep">
      <StarfieldBg />

      {!booted && (
        <BootSequence
          onStart={() => {
            sfx.playCoin();
            setBooted(true);
          }}
        />
      )}

      {booted && (
        <main className="relative z-10 min-h-screen w-full flex flex-col items-center justify-between py-4 md:py-6 px-3 md:px-6 gap-4">
          {/* Top HUD */}
          <div className="w-full flex items-start justify-between gap-3">
            <div className="flex-1">
              <ScoreHUD score={score} stage={category} />
            </div>
            <ArcadeControls
              muted={muted}
              onToggleMute={() => {
                setMuted((m) => !m);
              }}
              musicOn={musicOn}
              onToggleMusic={() => setMusicOn((m) => !m)}
            />
          </div>

          {/* Center stage: sprite + dialogue */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full max-w-4xl">
            <motion.div
              animate={
                punching
                  ? { x: [0, 18, -4, 0], scale: [1, 1.05, 1] }
                  : { x: 0, scale: 1 }
              }
              transition={{ duration: 0.3 }}
              className="shrink-0 animate-sprite-bob"
            >
              <PixelChuck
                category={category}
                scale={7}
                punching={punching}
              />
            </motion.div>
            <div className="flex-1 w-full">
              <DialogueBox
                text={joke}
                revealKey={ticket}
                speaker={'CHUCK'}
                isLoading={isLoading}
                error={error}
                onCharBeep={sfx.playBlip}
              />
            </div>
          </div>

          {/* Action button */}
          <motion.button
            type="button"
            onClick={handleHit}
            disabled={isLoading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="pixel-button !text-base md:!text-xl !px-8 !py-4 !bg-nes-red !border-4
              hover:!bg-nes-yellow hover:!text-nes-deep
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            ▶ PRESS A — HIT ME CHUCK ◀
          </motion.button>

          {/* Stage select */}
          <StageSelect active={category} onPick={handlePick} />

          {/* Bottom marquee */}
          <div className="font-pixel text-[8px] md:text-[10px] text-nes-blue-light/80 text-center">
            © 1986 KICK CORP. — POWERED BY chucknorris.io — PRESS{' '}
            <kbd className="text-nes-yellow">M</kbd> FOR MUSIC
          </div>
        </main>
      )}

      {/* CRT effects on top of everything */}
      <div className="pointer-events-none fixed inset-0 scanlines crt-vignette" aria-hidden />

      <KeyboardShortcuts
        onMusicToggle={() => setMusicOn((m) => !m)}
        onMute={() => setMuted((m) => !m)}
        onHit={handleHit}
      />
    </div>
  );
}

function KeyboardShortcuts({
  onMusicToggle,
  onMute,
  onHit,
}: {
  onMusicToggle: () => void;
  onMute: () => void;
  onHit: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip when typing in a field.
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'm' || e.key === 'M') onMusicToggle();
      else if (e.key === 'n' || e.key === 'N') onMute();
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'a' || e.key === 'A') onHit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onMusicToggle, onMute, onHit]);
  return null;
}
