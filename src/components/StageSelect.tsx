import { CATEGORIES, RANDOM, type CategoryId } from '../lib/categories';

interface Props {
  active: CategoryId;
  onPick: (id: CategoryId) => void;
}

export function StageSelect({ active, onPick }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="font-pixel text-[10px] md:text-xs text-nes-yellow text-center mb-3 animate-slow-blink">
        ▼ SELECT YOUR STAGE ▼
      </div>
      <div className="flex justify-center mb-3">
        <button
          type="button"
          data-active={active === RANDOM.id}
          onClick={() => onPick(RANDOM.id)}
          className="pixel-button !bg-nes-red !text-nes-paper hover:!bg-nes-yellow hover:!text-nes-deep data-[active=true]:!bg-nes-yellow data-[active=true]:!text-nes-deep"
        >
          ★ RANDOM STAGE ★
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              data-active={isActive}
              onClick={() => onPick(cat.id)}
              className="pixel-button flex flex-col items-center gap-1"
            >
              <Icon size={14} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
