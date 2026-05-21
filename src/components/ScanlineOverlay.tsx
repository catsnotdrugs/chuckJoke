export function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden
      style={{
        background:
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
        mixBlendMode: 'multiply',
      }}
    >
      <div
        className="absolute inset-x-0 h-24 opacity-30 animate-scanline"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}
