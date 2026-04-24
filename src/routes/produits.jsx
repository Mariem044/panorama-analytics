import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { Boxes, AlertTriangle, Clock, Bell } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  Treemap,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
} from "recharts";
import { articles, FAMILLES, CHART_COLORS, formatTND } from "@/data/mockData";

export const Route = createFileRoute("/produits")({
  component: ProduitsPage,
});

// Treemap data (KPI-13): surface=valeur, color=rotation rate
const treemapData = FAMILLES.map((f, i) => ({
  name: f,
  size: Math.round(300000 + Math.random() * 1200000),
  rotation: Math.random(), // 0=slow(red), 1=fast(blue)
  fill: CHART_COLORS[i % CHART_COLORS.length],
}));

function rotationColor(r) {
  if (r < 0.33) return "#ef4444";
  if (r < 0.66) return "#f97316";
  return "#22c55e";
}

// Alerts table (KPI-17/18)
const alertes = Array.from({ length: 20 }, (_, i) => ({
  article: `ART-${String(i + 1).padStart(4, "0")}`,
  designation: `Article critique ${i + 1}`,
  stockActuel: Math.ceil(Math.random() * 50),
  seuil: 30 + Math.ceil(Math.random() * 30),
  dateRupture: `2024-${String(Math.ceil(Math.random() * 3) + 9).padStart(2, "0")}-${String(Math.ceil(Math.random() * 28)).padStart(2, "0")}`,
  fournisseur: `Fournisseur ${String.fromCharCode(65 + (i % 8))}`,
  priorite: ["CRITIQUE", "URGENT", "ATTENTION"][Math.floor(Math.random() * 3)],
})).sort((a, b) => {
  const order = { CRITIQUE: 0, URGENT: 1, ATTENTION: 2 };
  return order[a.priorite] - order[b.priorite];
});

// DSI scatter (KPI-15): 4 quadrants
const dsiScatter = articles.slice(0, 40).map((a) => ({
  dsi: Math.round(10 + Math.random() * 90),
  ca: a.ca,
  stockVal: Math.round(a.ca * (0.1 + Math.random() * 0.4)),
  name: a.designation,
}));

// Gauge component
function GaugeChart({ value, target, label }) {
  const pct = Math.min(value / 100, 1);
  const r = 70;
  const cx = 100;
  const cy = 90;
  const startAngle = Math.PI;
  const endAngle = 0;
  const arcLength = endAngle - startAngle;
  const valueAngle = startAngle + arcLength * pct;

  const arcX = (angle, radius) => cx + radius * Math.cos(angle);
  const arcY = (angle, radius) => cy + radius * Math.sin(angle);

  const bgPath = `M ${arcX(startAngle, r)} ${arcY(startAngle, r)} A ${r} ${r} 0 0 1 ${arcX(endAngle, r)} ${arcY(endAngle, r)}`;
  const valPath = `M ${arcX(startAngle, r)} ${arcY(startAngle, r)} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${arcX(valueAngle, r)} ${arcY(valueAngle, r)}`;
  const color = value < target ? "#22c55e" : value < target * 1.5 ? "#f97316" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width={200} height={110}>
        <path d={bgPath} fill="none" stroke="#2a2a2a" strokeWidth={14} strokeLinecap="round" />
        <path d={valPath} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />
        <line
          x1={cx}
          y1={cy}
          x2={arcX(valueAngle, r - 18)}
          y2={arcY(valueAngle, r - 18)}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={4} fill={color} />
        <text x={cx} y={cy - 18} textAnchor="middle" fill={color} fontSize={22} fontWeight="bold">
          {value}%
        </text>
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#666" fontSize={10}>
          objectif &lt; {target}%
        </text>
        <text x={cx} y={105} textAnchor="middle" fill="#888" fontSize={11}>
          {label}
        </text>
      </svg>
    </div>
  );
}

function priorityBadge(p) {
  const map = {
    CRITIQUE: "bg-red-500/20 text-red-400 border border-red-500/30",
    URGENT: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    ATTENTION: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };
  return map[p] || "";
}

function ProduitsPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards — draft D3 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Valeur stock total" value="4.7 MDT" subtitle="Dépôt MAG principal" icon={Boxes} />
        <KPICard label="Articles en rupture" value="127" subtitle="sur 2 763 actifs (4.6%)" trend={-1.1} icon={AlertTriangle} />
        <KPICard label="DSI moyen (rotation)" value="38j" subtitle="Days Sales of Inventory" icon={Clock} />
        <KPICard label="Alertes restock actives" value="89" subtitle="à commander sous 7j" icon={Bell} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Widget A: Treemap valeur × rotation (KPI-13) */}
        <ChartCard title="Valeur stock par dépôt × famille (KPI-13)">
          <ResponsiveContainer width="100%" height={280}>
            <Treemap
              data={treemapData}
              dataKey="size"
              nameKey="name"
              stroke="#1a1a1a"
              content={({ x, y, width, height, name, rotation }) => (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill={rotationColor(rotation ?? 0.5)} stroke="#111" strokeWidth={2} rx={3} opacity={0.85} />
                  {width > 40 && height > 20 && (
                    <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={10} dominantBaseline="middle">
                      {name}
                    </text>
                  )}
                </g>
              )}
            />
          </ResponsiveContainer>
          <div className="flex gap-4 text-[10px] text-text-dim mt-1 justify-end">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Rotation lente</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Moyenne</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Rapide</span>
          </div>
        </ChartCard>

        {/* Widget B: Alerts table (KPI-17/18) */}
        <ChartCard title="Alertes réapprovisionnement (KPI-17/18)">
          <div className="overflow-auto max-h-[280px]">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 bg-background">
                <tr className="text-text-dim border-b border-border">
                  <th className="text-left py-1 px-2">Article</th>
                  <th className="text-right py-1 px-2">Stock</th>
                  <th className="text-right py-1 px-2">Seuil</th>
                  <th className="text-center py-1 px-2">Rupture</th>
                  <th className="text-center py-1 px-2">Priorité</th>
                </tr>
              </thead>
              <tbody>
                {alertes.map((row, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-surface-hover/30">
                    <td className="py-1.5 px-2">
                      <div className="font-medium text-foreground">{row.article}</div>
                      <div className="text-text-dim text-[10px]">{row.fournisseur}</div>
                    </td>
                    <td className={`py-1.5 px-2 text-right font-semibold ${row.stockActuel < row.seuil ? "text-red-400" : "text-foreground"}`}>
                      {row.stockActuel}
                    </td>
                    <td className="py-1.5 px-2 text-right text-text-dim">{row.seuil}</td>
                    <td className="py-1.5 px-2 text-center text-text-dim text-[10px]">{row.dateRupture}</td>
                    <td className="py-1.5 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${priorityBadge(row.priorite)}`}>
                        {row.priorite}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Widget C: Gauge taux rupture (KPI-14/16) */}
        <ChartCard title="Taux de rupture & tension stock (KPI-14/16)">
          <div className="flex items-start gap-4 h-[280px]">
            <div className="flex flex-col items-center justify-center flex-shrink-0 pt-4">
              <GaugeChart value={4.6} target={3} label="Taux rupture global" />
            </div>
            <div className="flex-1 overflow-auto">
              <p className="text-[10px] text-text-dim font-semibold uppercase tracking-wider mb-2 mt-2">
                Top 10 articles en tension (réservé/dispo &gt; 80%)
              </p>
              {alertes.slice(0, 10).map((a, i) => {
                const ratio = Math.round(70 + Math.random() * 29);
                return (
                  <div key={i} className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-text-dim w-16 flex-shrink-0">{a.article}</span>
                    <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${ratio}%`,
                          background: ratio > 90 ? "#ef4444" : ratio > 80 ? "#f97316" : "#22c55e",
                        }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium w-8 text-right ${ratio > 90 ? "text-red-400" : ratio > 80 ? "text-orange-400" : "text-green-400"}`}>
                      {ratio}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartCard>

        {/* Widget D: Scatter DSI vs CA — 4 quadrants (KPI-15) */}
        <ChartCard title="Rotation stocks — DSI vs CA par article (KPI-15)">
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="dsi" name="DSI (j)" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} label={{ value: "DSI (jours)", position: "insideBottom", offset: -10, fill: "#555", fontSize: 11 }} />
              <YAxis dataKey="ca" name="CA" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <ZAxis dataKey="stockVal" range={[40, 400]} name="Valeur stock" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={38} stroke="#444" strokeDasharray="4 4" label={{ value: "DSI moy.", fill: "#555", fontSize: 10, position: "top" }} />
              <ReferenceLine y={articles.reduce((s, a) => s + a.ca, 0) / articles.length} stroke="#444" strokeDasharray="4 4" />
              <Scatter
                data={dsiScatter}
                fill="#3b82f6"
                opacity={0.7}
                shape={(props) => {
                  const { cx, cy, payload } = props;
                  const isStarOrFast = payload.dsi < 38 && payload.ca > 50000;
                  const isSleeping = payload.dsi >= 38 && payload.ca <= 50000;
                  return <circle cx={cx} cy={cy} r={6} fill={isStarOrFast ? "#22c55e" : isSleeping ? "#ef4444" : "#3b82f6"} opacity={0.75} />;
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-[10px] text-text-dim mt-1 justify-end">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Star / Fast</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Normal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Sleeping / Slow</span>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}