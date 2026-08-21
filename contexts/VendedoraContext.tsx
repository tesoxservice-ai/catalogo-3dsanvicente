"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getWANumber } from "@/lib/waConfig";

interface VendedoraContextType {
  waNumber: string;
  vendedora: string | null;
}

const VendedoraContext = createContext<VendedoraContextType>({
  waNumber: "5491131074381",
  vendedora: null,
});

export function VendedoraProvider({ children }: { children: ReactNode }) {
  const [waNumber, setWaNumber] = useState("5491131074381");
  const [vendedora, setVendedora] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("v");
    if (v) {
      setVendedora(v);
      setWaNumber(getWANumber(v));
      // Guardar en sessionStorage para que persista mientras navega
      sessionStorage.setItem("sv_vendedora", v);
    } else {
      // Recuperar de sessionStorage si existe
      const saved = sessionStorage.getItem("sv_vendedora");
      if (saved) {
        setVendedora(saved);
        setWaNumber(getWANumber(saved));
      }
    }
  }, []);

  return (
    <VendedoraContext.Provider value={{ waNumber, vendedora }}>
      {children}
    </VendedoraContext.Provider>
  );
}

export function useVendedora() {
  return useContext(VendedoraContext);
}