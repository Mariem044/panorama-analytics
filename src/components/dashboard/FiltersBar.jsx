import { useLocation } from "@tanstack/react-router";
import { Filter, Calendar, Building2, Users, Database } from "lucide-react";
import { useFilters } from "@/store/useFilters";

const PERIODS = [
  { label: "Jan 2024 – Déc 2024", quarter: "Tous" },
  { label: "Q1 2024",             quarter: "Q1" },
  { label: "Q2 2024",             quarter: "Q2" },
  { label: "Q3 2024",             quarter: "Q3" },
  { label: "Q4 2024",             quarter: "Q4" },
];

const DEPOTS  = ["Tous", "Tunis Nord", "Tunis Sud", "Sfax", "Sousse", "Nabeul", "Bizerte", "Dépôt Central"];
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
    <div className="flex items-center gap-1.5 bg-surface-hover/60 border border-border/60 rounded-lg px-2.5 py-1.5">
      {Icon && <Icon size={12} className="text-text-dim flex-shrink-0" />}
      <span className="text-[10px] text-text-dim font-medium whitespace-nowrap">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-[11px] text-foreground font-medium outline-none cursor-pointer min-w-0"
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
  const extraDefs  = DOMAIN_EXTRA[path] || [];

  // Period selection maps to quarter in store
  const currentPeriodLabel =
    PERIODS.find((p) => p.quarter === filters.quarter)?.label ?? PERIODS[0].label;

  const handlePeriodChange = (label) => {
    const found = PERIODS.find((p) => p.label === label);
    filters.setQuarter(found ? found.quarter : "Tous");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 px-1 py-2 mb-4 border border-border/40 rounded-xl bg-background/40 backdrop-blur-sm sticky top-16 z-20">
      <div className="flex items-center gap-1.5 text-text-dim pr-2 border-r border-border/60">
        <Filter size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Filtres</span>
      </div>

      {/* Period */}
      <SelectFilter
        label="Période"
        value={currentPeriodLabel}
        onChange={handlePeriodChange}
        options={PERIODS.map((p) => p.label)}
        icon={Calendar}
      />

      {/* Depot */}
      <SelectFilter
        label="Dépôt"
        value={filters.depot}
        onChange={filters.setDepot}
        options={DEPOTS}
        icon={Building2}
      />

      {/* Segment (global, shown only on pages that don't define it in DOMAIN_EXTRA) */}
      {!extraDefs.some((d) => d.storeKey === "segment") && (
        <SelectFilter
          label="Segment"
          value={filters.segment}
          onChange={filters.setSegment}
          options={SEGMENTS}
          icon={Users}
        />
      )}

      {/* Source (local state, cosmetic only) */}
      <SelectFilter
        label="Source"
        value="MAG_2020 + GRT_MAG"
        onChange={() => {}}
        options={SOURCES}
        icon={Database}
      />

      {/* Domain-specific extras wired to store */}
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
    </div>
  );
}