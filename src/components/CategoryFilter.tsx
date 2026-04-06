import { useStore } from '../store';

interface CategoryFilterProps {
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ onSelectCategory }: CategoryFilterProps) {
  const { categories, selectedCategory } = useStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category
              ? 'bg-primary-600 text-white'
              : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
