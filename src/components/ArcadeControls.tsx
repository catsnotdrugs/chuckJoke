import { Music, Music2, Volume2, VolumeX } from 'lucide-react';

interface Props {
  muted: boolean;
  onToggleMute: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
}

export function ArcadeControls({ muted, onToggleMute, musicOn, onToggleMusic }: Props) {
  return (
    <div className="flex flex-col gap-2 items-end">
      <button
        type="button"
        onClick={onToggleMute}
        aria-pressed={!muted}
        className="pixel-button flex items-center gap-2"
        data-active={!muted}
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        SFX {muted ? 'OFF' : 'ON'}
      </button>
      <button
        type="button"
        onClick={onToggleMusic}
        aria-pressed={musicOn}
        className="pixel-button flex items-center gap-2"
        data-active={musicOn}
      >
        {musicOn ? <Music size={14} /> : <Music2 size={14} className="opacity-50" />}
        BGM {musicOn ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
