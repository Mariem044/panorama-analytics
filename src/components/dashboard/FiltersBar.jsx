import { useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Filter, Calendar, Building2, Users, Database } from "lucide-react";

const PERIODS = ["Jan 2024 – Déc 2024", "Jan 2023 – Déc 2023", "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"];
const DEPOTS = ["Tous (8)", "Dépôt Central", "Tunis Nord", "Tunis Sud", "Sfax", "Sousse", "Nabeul", "Bizerte"];
const SEGMENTS = ["Tous", "DÉTAILLANTS", "SEMI-GROS", "HORECA", "GROSSISTES", "DISTRIBUTEUR"];
const SOURCES = ["MAG_2020 + GRT_MAG", "MAG_2020", "GRT_MAG"];

// Domain-specific extra filters
const DOMAIN_EXTRA = {
  "/tresorerie": [
    { label: "Mode paiement", options: ["Tous", "Chèque", "Espèce", "RS", "Traite", "Virement"] },
    { label: "Horizon prévis.", options: ["30j", "60j", "90j"] },
  ],
  "/produits": [
    { label: "Famille", options: ["Toutes", "Biscuits", "Boissons", "Conserves", "Produits Laitiers", "Confiserie", "Épicerie", "Huiles", "Pâtes"] },
    { label: "Statut", options: ["Actifs uniquement", "Tous", "En sommeil"] },
    { label: "Horizon", options: ["30j", "60j", "90j"] },
  ],
  "/banque": [
    { label: "Banque", options: ["Toutes", "AMEN", "ZITOUNA", "QNB", "BT"] },
    { label: "Mode", options: ["Tous", "Chèque", "Traite", "Virement"] },
    { label: "État", options: ["Tous", "Rapproché", "En attente"] },
  ],
};

function SelectFilter({ label, options, icon: Icon }) {
  const [value, setValue] = useState(options[0]);
  return (
    <div className="flex items-center gap-1.5 bg-surface-hover/60 border border-border/60 rounded-lg px-2.5 py-1.5">
      {Icon && <Icon size={12} className="text-text-dim flex-shrink-0" />}
      <span className="text-[10px] text-text-dim font-medium whitespace-nowrap">{label}:</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
  const location = useLocation();
  const path = location.pathname;
  const extraFilters = DOMAIN_EXTRA[path] || [];

  return (
    <div className="flex flex-wrap items-center gap-2 px-1 py-2 mb-4 border border-border/40 rounded-xl bg-background/40 backdrop-blur-sm sticky top-16 z-20">
      <div className="flex items-center gap-1.5 text-text-dim pr-2 border-r border-border/60">
        <Filter size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Filtres</span>
      </div>

      <SelectFilter label="Période" options={PERIODS} icon={Calendar} />
      <SelectFilter label="Dépôt" options={DEPOTS} icon={Building2} />
      <SelectFilter label="Segment" options={SEGMENTS} icon={Users} />
      <SelectFilter label="Source" options={SOURCES} icon={Database} />

      {extraFilters.map((f) => (
        <SelectFilter key={f.label} label={f.label} options={f.options} />
      ))}
    </div>
  );
}