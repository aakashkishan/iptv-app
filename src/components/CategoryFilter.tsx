import { useStore } from '@/store';

interface CategoryFilterProps {
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ onSelectCategory }: CategoryFilterProps) {
  const { categories, selectedCategory } = useStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
          style={{
            backgroundColor: selectedCategory === category ? 'var(--blue)' : 'var(--bg2)',
            color: selectedCategory === category ? 'var(--fg0)' : 'var(--fg3)',
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== category) {
              e.currentTarget.style.backgroundColor = 'var(--bg3)';
              e.currentTarget.style.color = 'var(--fg1)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== category) {
              e.currentTarget.style.backgroundColor = 'var(--bg2)';
              e.currentTarget.style.color = 'var(--fg3)';
            }
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
