import { create } from "zustand";

export const useFilters = create((set, get) => ({
  year: 2024,
  quarter: "Tous",
  month: "Tous",
  region: "Toutes",
  famille: "Toutes",
  segment: "Tous",
  depot: "Tous", // ← was "Tous (8)", pages compare against "Tous"
  banque: "Toutes",
  modeBanque: "Tous",
  modePaiement: "Tous",
  horizonPrev: "30j",
  statutArticle: "Tous",

  setYear: (year) => set({ year }),
  setQuarter: (quarter) => set({ quarter }),
  setMonth: (month) => set({ month }),
  setRegion: (region) => set({ region }),
  setFamille: (famille) => set({ famille }),
  setSegment: (segment) => set({ segment }),
  setDepot: (depot) => set({ depot }),
  setBanque: (banque) => set({ banque }),
  setModeBanque: (modeBanque) => set({ modeBanque }),
  setModePaiement: (modePaiement) => set({ modePaiement }),
  setHorizonPrev: (horizonPrev) => set({ horizonPrev }),
  setStatutArticle: (statutArticle) => set({ statutArticle }),

  getActiveMonthIndexes: () => {
    const { quarter } = get();
    if (quarter === "Q1") return [0, 1, 2];
    if (quarter === "Q2") return [3, 4, 5];
    if (quarter === "Q3") return [6, 7, 8];
    if (quarter === "Q4") return [9, 10, 11];
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  },
}));
