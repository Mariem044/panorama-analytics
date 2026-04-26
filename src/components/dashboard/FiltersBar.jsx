import { useLocation } from "@tanstack/react-router";
import { Filter, Calendar, Building2, Users, Database, ChevronDown } from "lucide-react";
import { useFilters } from "@/store/useFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const PERIODS = [
  { label: "Jan 2024 – Déc 2024", quarter: "Tous" },
  { label: "Q1 2024",             quarter: "Q1" },
  { label: "Q2 2024",             quarter: "Q2" },
  { label: "Q3 2024",             quarter: "Q3" },
  { label: "Q4 2024",             quarter: "Q4" },
];

const DEPOTS   = ["Tous", "Tunis Nord", "Tunis Sud", "Sfax", "Sousse", "Nabeul", "Bizerte", "Dépôt Central"];
const SEGMENTS = ["Tous", "DÉTAILLANTS", "SEMI-GROS", "HORECA", "GROSSISTES", "DISTRIBUTEUR"];
const SOURCES  = ["MAG_2020 + GRT_MAG", "MAG_2020", "GRT_MAG"];

const DOMAIN_EXTRA = {
  "/tresorerie": [
    { storeKey: "modePaiement",  label: "Mode paiement", options: ["Tous", "Chèque", "Espèce", "RS", "Traite", "Virement"] },
    { storeKey: "horizonPrev",   label: "Horizon prévis.", options: ["30j", "60j", "90j"] },
  ],
  "/produits": [
    { storeKey: "famille",       label: "Famille", options: ["Toutes", "Biscuits", "Boissons", "Conserves", "Produits Laitiers", "Confiserie", "Épicerie", "Huiles", "Pâtes"] },
    { storeKey: "statutArticle", label: "Statut",  options: ["Tous", "Actifs uniquement", "En sommeil"] },
    { storeKey: "horizonPrev",   label: "Horizon", options: ["30j", "60j", "90j"] },
  ],
  "/banque": [
    { storeKey: "banque",    label: "Banque", options: ["Toutes", "AMEN", "ZITOUNA", "QNB", "BT"] },
    { storeKey: "modeBanque",label: "Mode",   options: ["Tous", "Chèque", "Traite", "Virement"] },
  ],
  "/acteurs": [
    { storeKey: "segment", label: "Segment", options: ["Tous", "Grand compte", "PME", "Petit client"] },
  ],
  "/ventes": [
    { storeKey: "segment", label: "Segment", options: ["Tous", "Grand compte", "PME", "Petit client"] },
  ],
};

function SelectFilter({ label, value, onChange, options, icon: Icon }) {
  return (
    <div className="flex items-center gap-1.5 bg-surface-hover/60 border border-border/60 rounded-lg px-2.5 py-1.5 min-w-0">
      {Icon && <Icon size={12} className="text-text-dim flex-shrink-0" />}
      <span className="text-[10px] text-text-dim font-medium whitespace-nowrap hidden sm:block">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-[11px] text-foreground font-medium outline-none cursor-pointer min-w-0 max-w-[110px] sm:max-w-none truncate"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FiltersBar() {
  const location   = useLocation();
  const path       = location.pathname;
  const filters    = useFilters();
  const isMobile   = useIsMobile();
  const extraDefs  = DOMAIN_EXTRA[path] || [];
  const [expanded, setExpanded] = useState(false);

  const currentPeriodLabel =
    PERIODS.find((p) => p.quarter === filters.quarter)?.label ?? PERIODS[0].label;

  const handlePeriodChange = (label) => {
    const found = PERIODS.find((p) => p.label === label);
    filters.setQuarter(found ? found.quarter : "Tous");
  };

  const allFilters = (
    <>
      <SelectFilter
        label="Période"
        value={currentPeriodLabel}
        onChange={handlePeriodChange}
        options={PERIODS.map((p) => p.label)}
        icon={Calendar}
      />
      <SelectFilter
        label="Dépôt"
        value={filters.depot}
        onChange={filters.setDepot}
        options={DEPOTS}
        icon={Building2}
      />
      {!extraDefs.some((d) => d.storeKey === "segment") && (
        <SelectFilter
          label="Segment"
          value={filters.segment}
          onChange={filters.setSegment}
          options={SEGMENTS}
          icon={Users}
        />
      )}
      <SelectFilter
        label="Source"
        value="MAG_2020 + GRT_MAG"
        onChange={() => {}}
        options={SOURCES}
        icon={Database}
      />
      {extraDefs.map((def) => (
        <SelectFilter
          key={def.storeKey}
          label={def.label}
          value={filters[def.storeKey]}
          onChange={(v) => {
            const setter = "set" + def.storeKey.charAt(0).toUpperCase() + def.storeKey.slice(1);
            if (typeof filters[setter] === "function") filters[setter](v);
          }}
          options={def.options}
        />
      ))}
    </>
  );

  if (isMobile) {
    return (
      <div className="mb-4 border border-border/40 rounded-xl bg-background/40 backdrop-blur-sm sticky top-14 z-20">
        {/* Mobile: collapsed header row */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2.5"
        >
          <div className="flex items-center gap-2 text-text-dim">
            <Filter size={13} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Filtres</span>
            {filters.quarter !== "Tous" && (
              <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                {filters.quarter}
              </span>
            )}
          </div>
          <ChevronDown
            size={14}
            className={`text-text-dim transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Mobile: expanded filters wrap grid */}
        {expanded && (
          <div className="px-3 pb-3 pt-1 border-t border-border/40 flex flex-wrap gap-2">
            {allFilters}
          </div>
        )}
      </div>
    );
  }

  // Desktop: single scrollable row (original behaviour, but flex-wrap added)
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 mb-4 border border-border/40 rounded-xl bg-background/40 backdrop-blur-sm sticky top-16 z-20">
      <div className="flex items-center gap-1.5 text-text-dim pr-2 border-r border-border/60 flex-shrink-0">
        <Filter size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Filtres</span>
      </div>
      {allFilters}
    </div>
  );
}