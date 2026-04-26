import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, langCodeMap } from "@/i18n/Translation";

export const useParametres = create()(
  persist(
    (set, get) => ({
      langue: "Français",
      devise: "TND - Dinar Tunisien",
      notifImpayes: true,
      notifRapports: true,
      notifSystem: false,

      setLangue: (langue) => {
        set({ langue });
        const code = langCodeMap[langue] ?? "fr";
        document.documentElement.setAttribute("lang", code);
        document.documentElement.setAttribute("dir", code === "ar" ? "rtl" : "ltr");
      },
      setDevise: (devise) => set({ devise }),
      setNotifImpayes: (v) => set({ notifImpayes: v }),
      setNotifRapports: (v) => set({ notifRapports: v }),
      setNotifSystem: (v) => set({ notifSystem: v }),

      t: (key) => {
        const code = langCodeMap[get().langue] ?? "fr";
        return translations[code]?.[key] ?? translations["fr"][key] ?? key;
      },
    }),
    { name: "finmag-parametres" },
  ),
);

export function applyStoredLanguage() {
  try {
    const stored = JSON.parse(localStorage.getItem("finmag-parametres") || "{}");
    const langue = stored?.state?.langue;
    if (langue) {
      const code = langCodeMap[langue] ?? "fr";
      document.documentElement.setAttribute("lang", code);
      document.documentElement.setAttribute("dir", code === "ar" ? "rtl" : "ltr");
    }
  } catch {}
}