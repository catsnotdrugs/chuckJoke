import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  muted: boolean;
  onToggle: () => void;
}

export function AudioToggle({ muted, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      className={`group relative inline-flex items-center gap-2 rounded-md border px-3 py-2 font-hud text-lg uppercase tracking-widest transition-all ${
        muted
          ? 'border-vhs-paper/30 text-vhs-paper/70 hover:border-neon-cyan hover:text-neon-cyan'
          : 'border-neon-cyan text-neon-cyan shadow-neon-cyan'
      }`}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      <span>{muted ? 'SFX OFF' : 'SFX ON'}</span>
    </button>
  );
}
