import { CATEGORIES, RANDOM, type CategoryId } from '../lib/categories';

interface Props {
  active: CategoryId;
  onPick: (id: CategoryId) => void;
}

export function CategoryDial({ active, onPick }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-center mb-3">
        <button
          type="button"
          data-active={active === RANDOM.id}
          onClick={() => onPick(RANDOM.id)}
          className="cat-chip !text-base md:!text-lg !px-6 !py-3 !border-2 hover:!shadow-neon-red hover:!border-neon-red hover:!text-neon-red data-[active=true]:!border-neon-red data-[active=true]:!text-neon-red data-[active=true]:!shadow-neon-red"
        >
          <RANDOM.icon className="inline-block mr-2 -mt-1" size={18} />
          {RANDOM.label} Fact
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              data-active={active === cat.id}
              onClick={() => onPick(cat.id)}
              className="cat-chip flex flex-col items-center gap-1"
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
