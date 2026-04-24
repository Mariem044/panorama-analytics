import { create } from "zustand";
export const useFilters = create((set) => ({
  year: 2024,
  quarter: "Tous",
  month: "Tous",
  region: "Toutes",
  famille: "Toutes",
  setYear: (year) => set({ year }),
  setQuarter: (quarter) => set({ quarter }),
  setMonth: (month) => set({ month }),
  setRegion: (region) => set({ region }),
  setFamille: (famille) => set({ famille }),
}));
