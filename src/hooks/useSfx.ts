import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Synthesizes 80s-action SFX in the browser via the Web Audio API.
 * No asset downloads, no licensing concerns. Sounds match the VHS vibe.
 */
export function useSfx(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playPunch = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureCtx();
    const now = ctx.currentTime;

    // Low-end body — sine sweep
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(180, now);
    body.frequency.exponentialRampToValueAtTime(40, now + 0.18);
    bodyGain.gain.setValueAtTime(0.9, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    body.connect(bodyGain).connect(ctx.destination);
    body.start(now);
    body.stop(now + 0.25);

    // Crack — noise burst
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 1.2;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.13);
  }, [ensureCtx]);

  const playWhoosh = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureCtx();
    const now = ctx.currentTime;

    const dur = 0.35;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      const env = Math.sin(t * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 4;
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3500, now + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now);
    src.stop(now + dur);
  }, [ensureCtx]);

  const playStatic = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureCtx();
    const now = ctx.currentTime;
    const dur = 0.15;

    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now);
    src.stop(now + dur);
  }, [ensureCtx]);

  const playClick = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }, [ensureCtx]);

  /** NES textbox blip — short square pulse, used per-character */
  const playBlip = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1320;
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }, [ensureCtx]);

  /** Two-tone coin insert */
  const playCoin = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureCtx();
    const now = ctx.currentTime;
    const tone = (freq: number, t0: number, dur: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.18, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + dur + 0.01);
    };
    tone(988, now, 0.08); // B5
    tone(1318, now + 0.09, 0.16); // E6
  }, [ensureCtx]);

  /** Ascending arpeggio for menu confirm */
  const playSelect = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureCtx();
    const now = ctx.currentTime;
    [659, 784, 988].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = f;
      const t0 = now + i * 0.04;
      g.gain.setValueAtTime(0.16, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.06);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.07);
    });
  }, [ensureCtx]);

  return useMemo(
    () => ({
      playPunch,
      playWhoosh,
      playStatic,
      playClick,
      playBlip,
      playCoin,
      playSelect,
    }),
    [playPunch, playWhoosh, playStatic, playClick, playBlip, playCoin, playSelect],
  );
}
