import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { Banknote, AlertCircle, Clock, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { MONTHS, CHART_COLORS, formatTND } from "@/data/mockData";

export const Route = createFileRoute("/tresorerie")({
  component: TresorerietPage,
});

// Encaissements par mode MAG vs GRT (KPI-07/07b)
const encaissementsMode = [
  { mode: "Chèque", mag: 29119, grt: 18500, rapprochement: 87 },
  { mode: "Espèce", mag: 19709, grt: 0, rapprochement: 100 },
  { mode: "RS", mag: 16707, grt: 12400, rapprochement: 74 },
  { mode: "Traite", mag: 5209, grt: 8300, rapprochement: 91 },
  { mode: "Virement", mag: 1555, grt: 5200, rapprochement: 95 },
];

const donutData = encaissementsMode.map((d) => ({ name: d.mode, value: d.mag }));

// Waterfall trésorerie prévisionnel (KPI-11)
const waterfallData = [
  { label: "Solde initial", encaisse: 2100000, decaisse: 0, solde: 2100000 },
  { label: "30j", encaisse: 1800000, decaisse: -1200000, solde: 2700000 },
  { label: "60j", encaisse: 1400000, decaisse: -1600000, solde: 2500000 },
  { label: "90j", encaisse: 900000, decaisse: -1100000, solde: 2300000 },
];

const waterfallFlat = MONTHS.slice(0, 9).map((m, i) => ({
  month: m,
  encaissements: Math.round(600000 + Math.random() * 800000),
  decaissements: -Math.round(400000 + Math.random() * 600000),
  solde: 0,
}));
let solde = 1500000;
waterfallFlat.forEach((d) => {
  solde += d.encaissements + d.decaissements;
  d.solde = solde;
});

// Aging créances (KPI-09)
const agingClients = [
  { client: "Client 01", "0-30j": 120000, "31-60j": 45000, "61-90j": 28000, ">90j": 85000 },
  { client: "Client 02", "0-30j": 95000, "31-60j": 32000, "61-90j": 18000, ">90j": 40000 },
  { client: "Client 03", "0-30j": 210000, "31-60j": 0, "61-90j": 15000, ">90j": 12000 },
  { client: "Client 04", "0-30j": 45000, "31-60j": 67000, "61-90j": 33000, ">90j": 95000 },
  { client: "Client 05", "0-30j": 180000, "31-60j": 12000, "61-90j": 0, ">90j": 22000 },
];

// Impayés fournisseurs table
const impayesFournisseurs = Array.from({ length: 15 }, (_, i) => ({
  fournisseur: `Fournisseur ${String.fromCharCode(65 + i)}`,
  montant: Math.round(20000 + Math.random() * 150000),
  etat: ["En attente", "Contentieux", "Partiel"][Math.floor(Math.random() * 3)],
  dateEcheance: `2024-${String(Math.ceil(Math.random() * 12)).padStart(2, "0")}-${String(Math.ceil(Math.random() * 28)).padStart(2, "0")}`,
  delaiEffectif: Math.ceil(Math.random() * 45),
  delaiContractuel: 30,
}));

const fournColumns = [
  { accessorKey: "fournisseur", header: "Fournisseur" },
  { accessorKey: "montant", header: "Montant", cell: ({ getValue }) => formatTND(getValue()) },
  { accessorKey: "etat", header: "État" },
  { accessorKey: "dateEcheance", header: "Échéance" },
  { accessorKey: "delaiEffectif", header: "Délai effectif (j)" },
  {
    accessorKey: "delaiContractuel",
    header: "Délai contractuel (j)",
    cell: ({ getValue, row }) => {
      const eff = row.original.delaiEffectif;
      const contr = getValue();
      return (
        <span className={eff > contr ? "text-red-400 font-semibold" : "text-green-400"}>
          {contr}j {eff > contr ? `(+${eff - contr}j)` : "✓"}
        </span>
      );
    },
  },
];

function TresorerietPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards — draft D2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Encaissements clients YTD" value="8.2 MDT" trend={6.1} icon={Banknote} />
        <KPICard label="Créances impayées" value="1.3 MDT" subtitle="dont 340K > 90j" trend={-2.1} icon={AlertCircle} />
        <KPICard label="Délai moyen règlement" value="23j" subtitle="+3j vs contractuel" icon={Clock} />
        <KPICard label="Taux recouvrement" value="87%" trend={2} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Widget A: Donut + grouped bar MAG vs GRT (KPI-07/07b) */}
        <ChartCard title="Encaissements par mode — MAG vs GRT (KPI-07/07b)">
          <div className="grid grid-cols-2 gap-2 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} fontSize={10}>
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={encaissementsMode} layout="vertical">
                <XAxis type="number" tick={{ fill: "#666", fontSize: 10 }} axisLine={false} />
                <YAxis type="category" dataKey="mode" tick={{ fill: "#999", fontSize: 10 }} axisLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#888" }} />
                <Bar dataKey="mag" fill="#3b82f6" name="MAG" radius={[0, 2, 2, 0]} />
                <Bar dataKey="grt" fill="#6366f1" name="GRT" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Widget B: Waterfall trésorerie prévisionnel (KPI-11) */}
        <ChartCard title="Flux trésorerie prévisionnel 30/60/90j (KPI-11)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={waterfallFlat}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#888" }} />
              <ReferenceLine y={0} stroke="#555" />
              <Bar dataKey="encaissements" fill="#22c55e" name="Encaissements" radius={[4, 4, 0, 0]} />
              <Bar dataKey="decaissements" fill="#ef4444" name="Décaissements" radius={[4, 4, 0, 0]} />
              <Line data={waterfallFlat} type="monotone" dataKey="solde" stroke="#000" strokeWidth={2} dot={false} name="Solde net" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Widget C: Stacked aging bar per client (KPI-09) */}
        <ChartCard title="Vieillissement des créances — Aging (KPI-09)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agingClients}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="client" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#888" }} />
              <Bar dataKey="0-30j" stackId="age" fill="#22c55e" name="0-30j" />
              <Bar dataKey="31-60j" stackId="age" fill="#f97316" name="31-60j" />
              <Bar dataKey="61-90j" stackId="age" fill="#a855f7" name="61-90j" />
              <Bar dataKey=">90j" stackId="age" fill="#ef4444" name=">90j" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Widget D: Impayés fournisseurs table (KPI-09c/08b) */}
        <ChartCard title="Impayés fournisseurs & Délais (KPI-09c/08b)">
          <div className="overflow-auto max-h-[280px]">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 bg-background">
                <tr className="text-text-dim border-b border-border">
                  <th className="text-left py-1 px-2">Fournisseur</th>
                  <th className="text-right py-1 px-2">Montant</th>
                  <th className="text-center py-1 px-2">État</th>
                  <th className="text-center py-1 px-2">Délai eff.</th>
                  <th className="text-center py-1 px-2">Écart</th>
                </tr>
              </thead>
              <tbody>
                {impayesFournisseurs.map((row, i) => {
                  const ecart = row.delaiEffectif - row.delaiContractuel;
                  return (
                    <tr key={i} className="border-b border-border/30 hover:bg-surface-hover/30">
                      <td className="py-1.5 px-2 text-foreground">{row.fournisseur}</td>
                      <td className="py-1.5 px-2 text-right text-foreground">{formatTND(row.montant)}</td>
                      <td className="py-1.5 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${row.etat === "Contentieux" ? "bg-red-500/20 text-red-400" : row.etat === "Partiel" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}`}>
                          {row.etat}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-center">{row.delaiEffectif}j</td>
                      <td className={`py-1.5 px-2 text-center font-medium ${ecart > 0 ? "text-red-400" : "text-green-400"}`}>
                        {ecart > 0 ? `+${ecart}j` : `${ecart}j`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}