import { Link, useLocation } from "@tanstack/react-router";
import { useSidebar } from "@/store/useSidebar";
import {
  X,
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Boxes,
  Users,
  Receipt,
  Landmark,
  Banknote,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Tableau de Bord", icon: LayoutDashboard },
  { to: "/ventes", label: "CA & Performance Commerciale", icon: TrendingUp },
  { to: "/tresorerie", label: "Trésorerie & Flux Paiement", icon: Wallet },
  { to: "/produits", label: "Stocks & Approvisionnement", icon: Boxes },
  { to: "/acteurs", label: "Analyse Acteurs & Segmentation", icon: Users },
  { to: "/fiscalite", label: "Fiscalité & Comptabilité", icon: Receipt },
  { to: "/caisse", label: "Gestion de Caisse", icon: Banknote },
  { to: "/banque", label: "Rapprochement Bancaire", icon: Landmark },
];

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { open, setOpen } = useSidebar();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden sidebar-backdrop"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 w-[264px] bg-gradient-to-b from-sidebar-bg via-sidebar-bg/98 to-sidebar-bg/95 border-r border-border/80
          flex flex-col z-50 transition-all duration-500 ease-in-out
          shadow-xl shadow-black/40 lg:shadow-lg lg:shadow-black/20
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
          backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-br before:from-sidebar-bg/50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h1 className="text-[22px] leading-none font-extrabold text-foreground tracking-tight">
              FinMAG
            </h1>
            <p className="text-[10px] text-text-dim font-semibold tracking-[0.18em] uppercase mt-1">
              MAG Distribution Analytics
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-foreground hover:bg-gradient-to-br hover:from-surface-hover hover:to-surface-hover/80 hover:shadow-md hover:shadow-primary/10 hover:scale-110 transition-all duration-300 relative overflow-hidden group before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400"
          >
            <X size={16} className="relative z-10" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-text-dim uppercase tracking-widest px-3 mb-2">
            Domaines
          </p>
          {navItems.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[12px] font-medium
                  transition-all duration-150 group relative
                  ${
                    active
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_3px_0_0_0_rgba(59,130,246,0.9)]"
                      : "text-text-muted hover:bg-surface-hover hover:text-foreground border border-transparent"
                  }
                `}
              >
                <item.icon
                  size={15}
                  className={`flex-shrink-0 transition-colors ${active ? "text-primary" : "text-text-dim group-hover:text-foreground"}`}
                />
                <span className="leading-tight">{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.7)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-3 py-3 space-y-0.5">
          <Link
            to="/parametres"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] w-full transition-colors border cursor-pointer
              ${path === "/parametres"
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-text-muted hover:bg-surface-hover hover:text-foreground border-transparent"
              }`}
          >
            <Settings size={16} className={path === "/parametres" ? "text-primary flex-shrink-0" : "text-text-dim flex-shrink-0"} />
            Paramètres
          </Link>
          <Link
            to="/aide"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] w-full transition-colors border cursor-pointer
              ${path === "/aide"
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-text-muted hover:bg-surface-hover hover:text-foreground border-transparent"
              }`}
          >
            <HelpCircle size={16} className={path === "/aide" ? "text-primary flex-shrink-0" : "text-text-dim flex-shrink-0"} />
            Aide
          </Link>
          <p className="text-[10px] text-[#444] px-3 pt-1">v2.0.0 — FinMAG</p>
        </div>
      </aside>
    </>
  );
}