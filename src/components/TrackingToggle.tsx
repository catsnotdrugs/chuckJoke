interface Props {
  active: boolean;
  onPress: (v: boolean) => void;
}

export function TrackingToggle({ active, onPress }: Props) {
  return (
    <button
      type="button"
      onPointerDown={() => onPress(true)}
      onPointerUp={() => onPress(false)}
      onPointerLeave={() => onPress(false)}
      onTouchStart={() => onPress(true)}
      onTouchEnd={() => onPress(false)}
      aria-pressed={active}
      className={`font-hud text-base md:text-lg uppercase tracking-widest border px-3 py-2 rounded-md transition-all ${
        active
          ? 'border-neon-magenta text-neon-magenta shadow-neon-magenta'
          : 'border-vhs-paper/30 text-vhs-paper/70 hover:border-neon-magenta hover:text-neon-magenta'
      }`}
    >
      TRACKING
    </button>
  );
}
