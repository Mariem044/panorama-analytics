import { Bell, Sun, Moon, Menu, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/store/useTheme";
import { useSidebar } from "@/store/useSidebar";
import { useParametres } from "@/store/useParametres";
import { SearchBar } from "@/components/dashboard/SearchBar";

export function Header({ pathname }) {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { toggle: toggleSidebar } = useSidebar();
  const { t } = useParametres();

  const pageNameKeys = {
    "/":           "nav.dashboard",
    "/ventes":     "nav.ventes",
    "/tresorerie": "nav.tresorerie",
    "/produits":   "nav.produits",
    "/acteurs":    "nav.acteurs",
    "/ecritures":  "nav.fiscalite",
    "/fiscalite":  "nav.fiscalite",
    "/caisse":     "nav.caisse",
    "/banque":     "nav.banque",
    "/parametres": "nav.parametres",
    "/aide":       "nav.aide",
    "/profil":     "nav.profil",
    "/assistant":  "nav.assistant",
  };

  const titleKey = pageNameKeys[pathname];
  const title = titleKey ? t(titleKey) : "SIAD";

  const iconBtn =
    "w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-foreground hover:bg-surface-hover hover:scale-110 transition-all duration-200";

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-[264px] h-14 bg-sidebar-bg/95 backdrop-blur border-b border-border/90 shadow-[0_1px_0_0_rgba(59,130,246,0.18)] flex items-center justify-between px-4 z-30 gap-3">

      {/* Left */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        <button onClick={toggleSidebar} className={`${iconBtn} lg:hidden`} title="Menu">
          <Menu size={18} />
        </button>
        <h2 className="text-[14px] font-semibold text-foreground truncate hidden sm:block">
          {title}
        </h2>
      </div>

      {/* Center — global search */}
      <SearchBar />

      {/* Right */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Link
          to="/assistant"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg
            bg-primary
            px-3 py-1.5 text-[11px] font-semibold text-white
            shadow-md shadow-primary/30
            hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 hover:scale-[1.03]
            transition-all duration-200"
          title={t("header.aiAssistant")}
        >
          <Sparkles size={13} className="text-white/90" />
          <span>{t("header.aiAssistant")}</span>
        </Link>

        <button onClick={toggleTheme} title={isDark ? "Mode clair" : "Mode sombre"} className={iconBtn}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className={iconBtn} title="Notifications">
          <Bell size={16} />
        </button>

        <Link
          to="/profil"
          title={t("nav.profil")}
          className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 hover:bg-primary/90 hover:scale-110 transition-all duration-200 shadow-md shadow-primary/30"
        >
          AD
        </Link>
      </div>
    </header>
  );
}