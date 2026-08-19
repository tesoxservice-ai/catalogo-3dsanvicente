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
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex gap-2 px-4 pb-1 w-max">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === active;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              style={
                isActive
                  ? {
                      backgroundColor: "#2563EB",
                      color: "#FFFFFF",
                      border: "1px solid #2563EB",
                    }
                  : {
                      backgroundColor: "#F3F4F6",
                      color: "#6B7280",
                      border: "1px solid transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563EB";
                  (e.currentTarget as HTMLButtonElement).style.color = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#6B7280";
                }
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}