import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { Banknote, Wallet, TrendingUp, Activity } from "lucide-react";
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
import { CHART_COLORS } from "@/data/mockData";

export const Route = createFileRoute("/caisse")({
  component: CaissePage,
});

// Multiple caisses (KPI-29)
const caisses = [
  { id: "CA-01", nom: "Caisse Centrale", especes: 58000, cheques: 15000, seuilMin: 20000 },
  { id: "CA-02", nom: "Caisse Tunis Nord", especes: 32000, cheques: 8000, seuilMin: 15000 },
  { id: "CA-03", nom: "Caisse Sfax", especes: 28000, cheques: 7000, seuilMin: 20000 },
  { id: "CA-04", nom: "Caisse Sousse", especes: 18000, cheques: 5000, seuilMin: 25000 },
  { id: "CA-05", nom: "Caisse Nabeul", especes: 11000, cheques: 3000, seuilMin: 15000 },
];

// Daily flux (KPI-30/31) — last 30 days
const dailyFlux = Array.from({ length: 30 }, (_, i) => {
  const credit = Math.round(8000 + Math.random() * 20000);
  const debit = Math.round(5000 + Math.random() * 15000);
  return {
    day: `J-${30 - i}`,
    credit,
    debit: -debit,
    net: credit - debit,
  };
});
let cumul = 120000;
dailyFlux.forEach((d) => { cumul += d.net; d.cumul = cumul; });

// Donut mouvements par nature (KPI-31)
const natureMvt = [
  { name: "Vente espèces", value: 38 },
  { name: "Transfert caisse", value: 22 },
  { name: "Remboursement", value: 15 },
  { name: "Dépenses courantes", value: 13 },
  { name: "Avances", value: 8 },
  { name: "Autres", value: 4 },
];

// Prophet forecast (KPI-32) — 90j historique + 30j prévision
const prophetData = Array.from({ length: 120 }, (_, i) => {
  const isHistorique = i < 90;
  const base = 147000 + Math.sin(i / 7) * 15000 + (Math.random() - 0.5) * 8000;
  return {
    day: `J${i - 89}`,
    historique: isHistorique ? Math.round(base) : null,
    prevision: !isHistorique ? Math.round(base * 1.05) : null,
    prevLow: !isHistorique ? Math.round(base * 0.88) : null,
    prevHigh: !isHistorique ? Math.round(base * 1.22) : null,
  };
});

// Multi-gauge component
function MultiGauge({ caisses }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2">
      {caisses.map((c) => {
        const total = c.especes + c.cheques;
        const belowMin = c.especes < c.seuilMin;
        const espPct = (c.especes / total) * 100;
        const chkPct = (c.cheques / total) * 100;
        return (
          <div key={c.id} className={`rounded-xl border p-3 ${belowMin ? "border-red-500/50 bg-red-500/5 animate-pulse" : "border-border/50 bg-surface-hover/30"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-foreground">{c.nom}</span>
              {belowMin && <span className="text-[9px] text-red-400 font-bold">⚠ SEUIL</span>}
            </div>
            <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-1.5">
              <div className="bg-blue-500 rounded-l-full" style={{ width: `${espPct}%` }} />
              <div className="bg-purple-500 rounded-r-full" style={{ width: `${chkPct}%` }} />
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-blue-400">Esp: {(c.especes / 1000).toFixed(0)}K</span>
              <span className="text-purple-400">Chq: {(c.cheques / 1000).toFixed(0)}K</span>
            </div>
            <div className="text-[10px] text-text-dim mt-0.5">seuil min: {(c.seuilMin / 1000).toFixed(0)}K DT</div>
          </div>
        );
      })}
    </div>
  );
}

function CaissePage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards — draft D6 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Solde espèces total" value="147 K DT" subtitle="toutes caisses" icon={Banknote} />
        <KPICard label="Solde chèques" value="38 K DT" subtitle="CA_SoldeCheque" icon={Wallet} />
        <KPICard label="Flux net journalier" value="+12 K DT" subtitle="Crédit - Débit (hier)" trend={5.2} icon={TrendingUp} />
        <KPICard label="Prévision solde J+15" value="185 K DT" subtitle="Modèle Prophet (80% conf.)" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Widget A: Multi-gauges par caisse (KPI-29) */}
        <ChartCard title="Solde de caisse par caisse — Espèces vs Chèques (KPI-29)">
          <MultiGauge caisses={caisses} />
          <div className="flex gap-3 text-[10px] text-text-dim mt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Espèces</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Chèques</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" /> Sous seuil min</span>
          </div>
        </ChartCard>

        {/* Widget B: Daily bar Débit/Crédit + cumul line (KPI-30/31) */}
        <ChartCard title="Flux journaliers débit / crédit (KPI-30/31)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyFlux.slice(-20)}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 9 }} axisLine={false} interval={3} />
              <YAxis yAxisId="left" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#888" }} />
              <ReferenceLine yAxisId="left" y={0} stroke="#444" />
              <Bar yAxisId="left" dataKey="credit" fill="#3b82f6" name="Crédit" radius={[2, 2, 0, 0]} />
              <Bar yAxisId="left" dataKey="debit" fill="#ef4444" name="Débit" radius={[0, 0, 2, 2]} />
              <Line yAxisId="right" type="monotone" dataKey="cumul" stroke="#000" strokeWidth={2} dot={false} name="Solde cumulé" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Widget C: Donut + top 10 nature mouvements (KPI-31) */}
        <ChartCard title="Mouvements par nature (KPI-31)">
          <div className="grid grid-cols-2 gap-2 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={natureMvt} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`} fontSize={10}>
                  {natureMvt.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="overflow-auto py-2">
              <p className="text-[10px] text-text-dim font-semibold uppercase tracking-wider mb-2">Top natures</p>
              {natureMvt.map((n, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-foreground truncate">{n.name}</div>
                    <div className="h-1 bg-surface-hover rounded-full mt-0.5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${n.value}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    </div>
                  </div>
                  <span className="text-[11px] text-text-dim">{n.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Widget D: Prophet forecast solde caisse (KPI-32) */}
        <ChartCard title="Prévision solde caisse — Prophet 30j (KPI-32)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={prophetData.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 9 }} axisLine={false} interval={4} />
              <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#888" }} />
              <ReferenceLine x="J1" stroke="#555" strokeDasharray="4 4" label={{ value: "Aujourd'hui", fill: "#666", fontSize: 9 }} />
              <Line type="monotone" dataKey="historique" stroke="#3b82f6" strokeWidth={2} dot={false} name="Historique 90j" connectNulls={false} />
              <Line type="monotone" dataKey="prevision" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Prévision 30j" connectNulls />
              <Line type="monotone" dataKey="prevHigh" stroke="#6366f1" strokeWidth={1} strokeDasharray="2 4" dot={false} name="IC 80% haut" connectNulls strokeOpacity={0.4} />
              <Line type="monotone" dataKey="prevLow" stroke="#6366f1" strokeWidth={1} strokeDasharray="2 4" dot={false} name="IC 80% bas" connectNulls strokeOpacity={0.4} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}