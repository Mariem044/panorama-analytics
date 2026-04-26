import { useLocation } from "@tanstack/react-router";
import { Filter, Calendar, Building2, Users, Database, ChevronDown } from "lucide-react";
import { useFilters } from "@/store/useFilters";
import { useParametres } from "@/store/useParametres";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const PERIODS_FR = [
  { label: "Jan 2024 – Déc 2024", label_en: "Jan 2024 – Dec 2024", label_ar: "يناير 2024 – ديسمبر 2024", quarter: "Tous" },
  { label: "Q1 2024", label_en: "Q1 2024", label_ar: "الربع الأول 2024", quarter: "Q1" },
  { label: "Q2 2024", label_en: "Q2 2024", label_ar: "الربع الثاني 2024", quarter: "Q2" },
  { label: "Q3 2024", label_en: "Q3 2024", label_ar: "الربع الثالث 2024", quarter: "Q3" },
  { label: "Q4 2024", label_en: "Q4 2024", label_ar: "الربع الرابع 2024", quarter: "Q4" },
];

const DEPOTS   = ["Tous", "Tunis Nord", "Tunis Sud", "Sfax", "Sousse", "Nabeul", "Bizerte", "Dépôt Central"];
const SEGMENTS = ["Tous", "DÉTAILLANTS", "SEMI-GROS", "HORECA", "GROSSISTES", "DISTRIBUTEUR"];
const SOURCES  = ["MAG_2020 + GRT_MAG", "MAG_2020", "GRT_MAG"];

const DOMAIN_EXTRA = {
  "/tresorerie": [
    { storeKey: "modePaiement",  labelKey: "filters.mode",    options: ["Tous", "Chèque", "Espèce", "RS", "Traite", "Virement"] },
    { storeKey: "horizonPrev",   labelKey: "filters.horizon", options: ["30j", "60j", "90j"] },
  ],
  "/produits": [
    { storeKey: "famille",       labelKey: "filters.famille",  options: ["Toutes", "Biscuits", "Boissons", "Conserves", "Produits Laitiers", "Confiserie", "Épicerie", "Huiles", "Pâtes"] },
    { storeKey: "statutArticle", labelKey: "filters.statut",   options: ["Tous", "Actifs uniquement", "En sommeil"] },
    { storeKey: "horizonPrev",   labelKey: "filters.horizon",  options: ["30j", "60j", "90j"] },
  ],
  "/banque": [
    { storeKey: "banque",     labelKey: "filters.banque",    options: ["Toutes", "AMEN", "ZITOUNA", "QNB", "BT"] },
    { storeKey: "modeBanque", labelKey: "filters.modeBanque",options: ["Tous", "Chèque", "Traite", "Virement"] },
  ],
  "/acteurs": [
    { storeKey: "segment", labelKey: "filters.segment", options: ["Tous", "Grand compte", "PME", "Petit client"] },
  ],
  "/ventes": [
    { storeKey: "segment", labelKey: "filters.segment", options: ["Tous", "Grand compte", "PME", "Petit client"] },
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
  const { t, langue } = useParametres();
  const isMobile   = useIsMobile();
  const extraDefs  = DOMAIN_EXTRA[path] || [];
  const [expanded, setExpanded] = useState(false);

  // Pick period labels based on language
  const langKey = langue === "English" ? "label_en" : langue === "العربية" ? "label_ar" : "label";
  const periodLabels = PERIODS_FR.map((p) => p[langKey]);

  const currentPeriodLabel = (() => {
    const found = PERIODS_FR.find((p) => p.quarter === filters.quarter);
    return found ? found[langKey] : periodLabels[0];
  })();

  const handlePeriodChange = (label) => {
    const idx = periodLabels.indexOf(label);
    filters.setQuarter(idx >= 0 ? PERIODS_FR[idx].quarter : "Tous");
  };

  const allFilters = (
    <>
      <SelectFilter
        label={t("filters.period")}
        value={currentPeriodLabel}
        onChange={handlePeriodChange}
        options={periodLabels}
        icon={Calendar}
      />
      <SelectFilter
        label={t("filters.depot")}
        value={filters.depot}
        onChange={filters.setDepot}
        options={DEPOTS}
        icon={Building2}
      />
      {!extraDefs.some((d) => d.storeKey === "segment") && (
        <SelectFilter
          label={t("filters.segment")}
          value={filters.segment}
          onChange={filters.setSegment}
          options={SEGMENTS}
          icon={Users}
        />
      )}
      <SelectFilter
        label={t("filters.source")}
        value="MAG_2020 + GRT_MAG"
        onChange={() => {}}
        options={SOURCES}
        icon={Database}
      />
      {extraDefs.map((def) => (
        <SelectFilter
          key={def.storeKey}
          label={t(def.labelKey)}
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
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2.5"
        >
          <div className="flex items-center gap-2 text-text-dim">
            <Filter size={13} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">{t("filters.label")}</span>
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

        {expanded && (
          <div className="px-3 pb-3 pt-1 border-t border-border/40 flex flex-wrap gap-2">
            {allFilters}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 mb-4 border border-border/40 rounded-xl bg-background/40 backdrop-blur-sm sticky top-16 z-20">
      <div className="flex items-center gap-1.5 text-text-dim pr-2 border-r border-border/60 flex-shrink-0">
        <Filter size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{t("filters.label")}</span>
      </div>
      {allFilters}
    </div>
  );
}