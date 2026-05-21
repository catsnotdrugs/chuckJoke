import { useCallback, useEffect, useRef } from 'react';

/**
 * A simple Web Audio chiptune loop synthesizer — square-wave lead + triangle-bass.
 * Runs an interval that schedules notes ahead of time for tight timing.
 * The melody is original-ish: a brisk 4/4 action loop fitting a beat-em-up boss.
 */

// Each step is a 16th-note. -1 = rest.
const LEAD: (number | -1)[] = [
  // bar 1 — power chord arp on A minor
  57, 60, 64, 60, 57, 60, 64, 67, 64, 60, 64, 67, 69, 67, 64, 60,
  // bar 2 — same on F major
  53, 57, 60, 57, 53, 57, 60, 65, 60, 57, 60, 65, 64, 60, 57, 53,
  // bar 3 — G major
  55, 59, 62, 59, 55, 59, 62, 67, 62, 59, 62, 67, 65, 62, 59, 55,
  // bar 4 — E7
  52, 56, 59, 56, 52, 56, 59, 64, 67, 64, 59, 56, 52, 55, 59, 64,
];
const BASS: (number | -1)[] = [
  45, -1, 45, -1, 45, -1, 45, 45, 45, -1, 45, -1, 45, -1, 45, 45,
  41, -1, 41, -1, 41, -1, 41, 41, 41, -1, 41, -1, 41, -1, 41, 41,
  43, -1, 43, -1, 43, -1, 43, 43, 43, -1, 43, -1, 43, -1, 43, 43,
  40, -1, 40, -1, 40, -1, 40, 40, 47, -1, 47, -1, 47, -1, 47, 47,
];

const BPM = 132;
const STEP_SEC = 60 / BPM / 4; // 16th note duration

function midiToHz(n: number): number {
  return 440 * Math.pow(2, (n - 69) / 12);
}

export function useChiptune(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const nextTimeRef = useRef(0);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);
      masterRef.current = master;
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playNote = useCallback(
    (midi: number, time: number, dur: number, voice: 'square' | 'triangle') => {
      const ctx = ctxRef.current!;
      const master = masterRef.current!;
      const osc = ctx.createOscillator();
      osc.type = voice;
      osc.frequency.setValueAtTime(midiToHz(midi), time);

      const gain = ctx.createGain();
      const peak = voice === 'square' ? 0.32 : 0.55;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(peak, time + 0.005);
      gain.gain.linearRampToValueAtTime(peak * 0.7, time + dur * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(gain).connect(master);
      osc.start(time);
      osc.stop(time + dur + 0.02);
    },
    [],
  );

  const scheduler = useCallback(() => {
    const ctx = ctxRef.current!;
    while (nextTimeRef.current < ctx.currentTime + 0.18) {
      const step = stepRef.current % LEAD.length;
      const leadNote = LEAD[step];
      const bassNote = BASS[step];
      if (leadNote !== -1) {
        playNote(leadNote, nextTimeRef.current, STEP_SEC * 0.9, 'square');
      }
      if (bassNote !== -1) {
        playNote(bassNote - 12, nextTimeRef.current, STEP_SEC * 1.6, 'triangle');
      }
      stepRef.current += 1;
      nextTimeRef.current += STEP_SEC;
    }
  }, [playNote]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (masterRef.current && ctxRef.current) {
        // Quick fade-out to avoid pop
        const m = masterRef.current.gain;
        m.cancelScheduledValues(ctxRef.current.currentTime);
        m.setValueAtTime(m.value, ctxRef.current.currentTime);
        m.exponentialRampToValueAtTime(0.0001, ctxRef.current.currentTime + 0.15);
        // restore after fade so next play starts at audible level
        m.setValueAtTime(0.18, ctxRef.current.currentTime + 0.25);
      }
      return;
    }
    const ctx = ensureCtx();
    stepRef.current = 0;
    nextTimeRef.current = ctx.currentTime + 0.05;
    intervalRef.current = window.setInterval(scheduler, 60);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, ensureCtx, scheduler]);
}
