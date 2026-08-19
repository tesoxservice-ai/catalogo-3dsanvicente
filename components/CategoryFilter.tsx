"use client";

export type CategoryId =
  | "todos"
  | "cuadros-tripticos"
  | "decoracion-esculturas"
  | "macetas"
  | "animales-decorativos";

export interface Category {
  id: CategoryId;
  label: string;
}

export const CATEGORIES: Category[] = [
  { id: "todos", label: "Todos" },
  { id: "cuadros-tripticos", label: "Cuadros y Trípticos" },
  { id: "decoracion-esculturas", label: "Decoración y Esculturas" },
  { id: "macetas", label: "Macetas" },
  { id: "animales-decorativos", label: "Animales Decorativos" },
];

interface CategoryFilterProps {
  active: CategoryId;
  onChange: (category: CategoryId) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      {/* hide-scrollbar utility via inline style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex gap-2 px-4 pb-1 w-max mx-auto">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === active;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={[
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "text-black font-semibold shadow-[0_0_12px_rgba(56,189,248,0.45)]"
                  : "border text-gray-400 hover:border-[#38BDF8] hover:text-[#38BDF8]",
              ].join(" ")}
              style={
                isActive
                  ? { backgroundColor: "#38BDF8", borderColor: "transparent" }
                  : { borderColor: "#3A3A3A", backgroundColor: "transparent" }
              }
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
