import { Bell, Sun, Moon, Menu, Sparkles, Search } from "lucide-react";
import { useTheme } from "@/store/useTheme";
import { useSidebar } from "@/store/useSidebar";
const pageNames = {
  "/": "Tableau de Bord",
  "/ventes": "Analyse des Ventes",
  "/clients": "Analyse Clients",
  "/produits": "Analyse Produits",
  "/commerciaux": "Analyse Commerciale",
  "/ecritures": "Écritures Comptables",
  "/recouvrement": "Recouvrement",
  "/regions": "Analyse Géographique",
  "/achats": "Achats & Fournisseurs",
  "/impayes": "Analyse des Impayés",
  "/parametres": "Paramètres",
  "/aide": "Aide",
};
export function Header({ pathname }) {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { toggle: toggleSidebar } = useSidebar();
  const title = pageNames[pathname] || "FinMAG";
  const iconBtn = `
    w-8 h-8 flex items-center justify-center rounded-lg
    text-text-muted hover:text-foreground hover:bg-gradient-to-br hover:from-surface-hover hover:to-surface-hover/80
    hover:shadow-md hover:shadow-primary/10 hover:scale-110
    transition-all duration-300 relative overflow-hidden group
    before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400
    shadow-md shadow-primary/20
  `;
  return (
    <header className="fixed top-0 left-0 right-0 lg:left-[248px] h-14 bg-sidebar-bg/95 backdrop-blur border-b border-border/90 shadow-[0_1px_0_0_rgba(59,130,246,0.18)] flex items-center justify-between px-4 z-30 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={toggleSidebar} className={`${iconBtn} lg:hidden flex-shrink-0`} title="Menu">
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-foreground truncate">{title}</h2>
        </div>
      </div>
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-3">
        <div className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/25 bg-gradient-to-r from-surface/95 via-surface/85 to-surface/70 shadow-sm shadow-primary/10 focus-within:border-primary/55 focus-within:shadow-primary/25 transition-all duration-300">
          <Search size={14} className="text-primary/80" />
          <input
            type="text"
            placeholder="Barre de recherche..."
            className="w-full bg-transparent text-[12px] text-foreground placeholder:text-text-dim outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-primary/35 bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all duration-300 hover:from-primary/30 hover:via-primary/25 hover:to-primary/15 hover:shadow-md hover:shadow-primary/30 hover:scale-[1.02]"
          title="Assistant IA"
        >
          <Sparkles size={13} className="text-primary-foreground/90" />
          <span>Assistant IA</span>
        </button>
        <button onClick={toggleTheme} title={isDark ? "Mode clair" : "Mode sombre"} className={iconBtn}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className={iconBtn} title="Notifications">
          <Bell size={16} />
        </button>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold flex-shrink-0">
          AD
        </div>
      </div>
    </header>
  );
}
