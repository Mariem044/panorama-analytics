import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { Users, Building2, AlertTriangle, Truck } from "lucide-react";
import {
  ScatterChart, Scatter, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ZAxis,
  ReferenceLine, Cell,
} from "recharts";
import { clients, CHART_COLORS, formatTND } from "@/data/mockData";
import { useFilters } from "@/store/useFilters";
import { useMemo } from "react";

export const Route = createFileRoute("/acteurs")({
  component: ActeursPage,
});

const rfmSegmentColors = {
  Champion: "#22c55e",
  Fidèle:   "#3b82f6",
  Risque:   "#f97316",
  Dormant:  "#ef4444",
};

const hhiData = [
  { article: "Biscuits Alpha",  hhi: 0.31, fournisseur: "Fournisseur A" },
  { article: "Boisson Beta",    hhi: 0.28, fournisseur: "Fournisseur C" },
  { article: "Conserve Gamma",  hhi: 0.19, fournisseur: "Fournisseur B" },
  { article: "Laitier Delta",   hhi: 0.42, fournisseur: "Fournisseur A" },
  { article: "Huile Epsilon",   hhi: 0.15, fournisseur: "Fournisseur D" },
];

function GaugeSimple({ pct, color, label, value }) {
  const r = 55, cx = 75, cy = 70;
  const startA = Math.PI, endA = 0;
  const valA = startA + (endA - startA) * Math.min(pct, 1);
  const arc = (a, rr) => ({ x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) });
  const bg = `M ${arc(startA, r).x} ${arc(startA, r).y} A ${r} ${r} 0 0 1 ${arc(endA, r).x} ${arc(endA, r).y}`;
  const fill = `M ${arc(startA, r).x} ${arc(startA, r).y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${arc(valA, r).x} ${arc(valA, r).y}`;
  return (
    <svg width={150} height={85}>
      <path d={bg} fill="none" stroke="#2a2a2a" strokeWidth={12} strokeLinecap="round" />
      <path d={fill} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
      <text x={cx} y={cy - 12} textAnchor="middle" fill={color} fontSize={18} fontWeight="bold">{value}</text>
      <text x={cx} y={cy + 4}  textAnchor="middle" fill="#666" fontSize={10}>{label}</text>
    </svg>
  );
}

function ActeursPage() {
  const { segment, depot, getActiveMonthIndexes } = useFilters();
  const activeIdx = getActiveMonthIndexes();

  // Filter clients by segment
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (segment !== "Tous" && c.segment !== segment) return false;
      if (depot !== "Tous" && c.region !== depot && !c.region?.includes(depot.replace("Dépôt ", ""))) return false;
      return true;
    });
  }, [segment, depot]);

  // RFM scatter from filtered clients
  const rfmData = useMemo(() =>
    filteredClients.map((c, i) => ({
      frequence: Math.ceil(Math.random() * 50),
      recence:   Math.ceil(Math.random() * 180),
      montant:   c.caTotal,
      segment:   Object.keys(rfmSegmentColors)[i % 4],
      name:      c.nom,
    })),
    [filteredClients]
  );

  // Aging GRT from filtered clients
  const agingGRT = useMemo(() =>
    filteredClients.slice(0, 8).map((c) => ({
      client:    c.nom.replace("Client ", "C"),
      "0-30j":   Math.round(Math.random() * 80000),
      "31-60j":  Math.round(Math.random() * 40000),
      "61-90j":  Math.round(Math.random() * 25000),
      ">90j":    Math.round(Math.random() * 60000),
    })).sort((a, b) => b[">90j"] - a[">90j"]),
    [filteredClients]
  );

  // Livreurs (not filtered by segment but filtered by depot)
  const livreurs = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      name:       `Livreur ${String.fromCharCode(65 + i)}`,
      region:     ["Tunis", "Sfax", "Sousse", "Nabeul"][i % 4],
      ca:         Math.round(100000 + Math.random() * 500000),
      clients:    Math.ceil(Math.random() * 80),
    }))
      .filter((l) => depot === "Tous" || l.region === depot.replace("Dépôt ", ""))
      .sort((a, b) => b.ca - a.ca),
    [depot]
  );

  // Attrition risk from filtered clients
  const atRiskClients = useMemo(() =>
    filteredClients
      .map((c) => ({ ...c, attritionScore: Math.random() }))
      .filter((c) => c.attritionScore > 0.5)
      .sort((a, b) => b.attritionScore - a.attritionScore)
      .slice(0, 8),
    [filteredClients]
  );

  const attritionPct = Math.round((atRiskClients.length / Math.max(filteredClients.length, 1)) * 100);
  const nbActifs = filteredClients.filter((c) => c.actif).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Clients actifs" value={nbActifs.toLocaleString("fr-TN")} subtitle={segment !== "Tous" ? segment : "Tous segments"} icon={Users} />
        <KPICard label="Fournisseurs" value="981" subtitle="3 619 articles couverts" icon={Building2} />
        <KPICard label="Clients à risque attrition" value={`${attritionPct}%`} subtitle="Score > 0.5 (RF model)" icon={AlertTriangle} />
        <KPICard label="Livreurs actifs" value={String(livreurs.length)} subtitle={depot !== "Tous" ? depot : "Tous dépôts"} icon={Truck} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title={`Matrice RFM clients${segment !== "Tous" ? ` — ${segment}` : ""} (KPI-22)`}>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="frequence" name="Fréquence" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} label={{ value: "Fréquence (nb commandes)", position: "insideBottom", offset: -10, fill: "#555", fontSize: 10 }} />
              <YAxis dataKey="recence"   name="Récence (j)" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} label={{ value: "Récence (j)", angle: -90, position: "insideLeft", fill: "#555", fontSize: 10 }} />
              <ZAxis dataKey="montant" range={[30, 400]} name="Montant" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={25} stroke="#333" strokeDasharray="4 4" />
              <ReferenceLine y={90} stroke="#333" strokeDasharray="4 4" />
              {Object.entries(rfmSegmentColors).map(([seg, color]) => (
                <Scatter key={seg} name={seg} data={rfmData.filter((d) => d.segment === seg)} fill={color} opacity={0.75} />
              ))}
              <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vieillissement créances GRT — par client (KPI-22b)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agingGRT}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="client" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
              <Bar dataKey="0-30j"  stackId="age" fill="#22c55e" name="0-30j" />
              <Bar dataKey="31-60j" stackId="age" fill="#f97316" name="31-60j" />
              <Bar dataKey="61-90j" stackId="age" fill="#a855f7" name="61-90j" />
              <Bar dataKey=">90j"   stackId="age" fill="#ef4444" name=">90j" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`Performance livreurs${depot !== "Tous" ? ` — ${depot}` : ""} (KPI-23)`}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={livreurs} layout="vertical">
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#999", fontSize: 11 }} axisLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ca" fill="#3b82f6" radius={[0, 4, 4, 0]} name="CA (DT)">
                {livreurs.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Score attrition clients & Concentration fournisseur (KPI-24/20)">
          <div className="flex gap-4 h-[280px]">
            <div className="flex flex-col items-center pt-2 flex-shrink-0">
              <GaugeSimple pct={attritionPct / 100} color="#f97316" label="Clients à risque" value={`${attritionPct}%`} />
              <p className="text-[10px] text-text-dim text-center mt-1">seuil &gt; 0.5</p>
              <div className="mt-3 space-y-1 w-full">
                {atRiskClients.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <span className="text-foreground truncate w-20">{c.nom}</span>
                    <div className="flex-1 mx-2 h-1.5 bg-surface-hover rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${c.attritionScore * 100}%` }} />
                    </div>
                    <span className="text-orange-400 font-medium">{(c.attritionScore * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-auto border-l border-border/40 pl-4">
              <p className="text-[10px] text-text-dim font-semibold uppercase tracking-wider mb-2 mt-2">Indice Herfindahl fournisseur (HHI)</p>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-text-dim border-b border-border">
                    <th className="text-left py-1">Article</th>
                    <th className="text-center py-1">HHI</th>
                    <th className="text-left py-1">Fournisseur</th>
                  </tr>
                </thead>
                <tbody>
                  {hhiData.map((row, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-1.5 text-foreground text-[10px]">{row.article}</td>
                      <td className="py-1.5 text-center">
                        <span className={`font-semibold ${row.hhi > 0.25 ? "text-red-400" : "text-green-400"}`}>
                          {row.hhi.toFixed(2)}{row.hhi > 0.25 && " ⚠"}
                        </span>
                      </td>
                      <td className="py-1.5 text-text-dim text-[10px]">{row.fournisseur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[9px] text-text-dim mt-2">Rouge si HHI &gt; 0.25 (dépendance fournisseur)</p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}