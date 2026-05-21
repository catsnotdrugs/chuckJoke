import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { JokeText } from './JokeText';
import { KapowBurst } from './KapowBurst';

interface Props {
  joke: string;
  isLoading: boolean;
  error: string | null;
  ticket: number;
  hue: string;
}

export function JokeStage({ joke, isLoading, error, ticket, hue }: Props) {
  return (
    <div className="vhs-frame crt-curve relative w-full max-w-3xl aspect-[16/9] md:aspect-[16/8] mx-auto">
      {/* Inner content */}
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10 z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key={`loading-${ticket}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 text-neon-cyan"
            >
              <Loader2 size={42} className="animate-spin" />
              <span className="font-hud text-2xl uppercase tracking-widest">
                Tuning broadcast…
              </span>
            </motion.div>
          ) : error ? (
            <motion.div
              key={`error-${ticket}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-neon-red font-hud text-2xl text-center"
            >
              SIGNAL LOST<br />
              <span className="text-base text-vhs-paper/70">{error}</span>
            </motion.div>
          ) : (
            <div key={`joke-${ticket}`} className="relative w-full">
              <div className="absolute inset-0 -m-12 pointer-events-none">
                <KapowBurst burstKey={ticket} hue={hue} />
              </div>
              <JokeText text={joke} revealKey={ticket} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* HUD corners */}
      <div className="absolute top-3 left-3 z-20 font-hud text-sm text-neon-amber/80">
        CH 03 // CHUCK-TV
      </div>
      <div className="absolute top-3 right-3 z-20 font-hud text-sm text-neon-red animate-rec-blink">
        ● LIVE
      </div>
      <div className="absolute bottom-3 left-3 z-20 font-hud text-sm text-vhs-paper/60">
        TRK 04 SP
      </div>
      <div className="absolute bottom-3 right-3 z-20 vcr-counter text-sm">
        {String(ticket).padStart(4, '0')}
      </div>
    </div>
  );
}
