"use client";

export type CategoryId = string;

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
  { id: "hogar-organizacion", label: "Hogar y Organización" },
  { id: "mundial-argentina-llaveros", label: "Mundial / Argentina / Llaveros" },
  { id: "nuevos-ingresos", label: "Nuevos Ingresos" },
];

interface CategoryFilterProps {
  active: CategoryId;
  onChange: (category: CategoryId) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      <style>{`.cat-hide::-webkit-scrollbar{display:none}`}</style>
      <div className="cat-hide flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === active;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="whitespace-nowrap text-sm font-semibold transition-all duration-200 shrink-0"
              style={
                isActive
                  ? {
                      color: "#1A1A1A",
                      borderBottom: "2px solid #1A1A1A",
                      paddingBottom: "16px",
                      paddingTop: "16px",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      backgroundColor: "transparent",
                    }
                  : {
                      color: "#9CA3AF",
                      borderBottom: "2px solid transparent",
                      paddingBottom: "16px",
                      paddingTop: "16px",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      backgroundColor: "transparent",
                    }
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