import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { DollarSign, Tag, Package, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { caByMonth, topFamilles, ventesDetail, MONTHS, FAMILLES, formatTND } from "@/data/mockData";

export const Route = createFileRoute("/achats")({
  component: VentesPage,
});

// Extend caByMonth with Prophet forecast for last 3 months
const forecastData = caByMonth.map((d, i) => ({
  ...d,
  forecast: i >= 9 ? Math.round(d.ca * (1 + (Math.random() * 0.1 - 0.02))) : null,
  forecastLow: i >= 9 ? Math.round(d.ca * 0.88) : null,
  forecastHigh: i >= 9 ? Math.round(d.ca * 1.12) : null,
}));

// CA by client category (KPI-03)
const clientCategoryData = [
  { name: "DÉTAILLANTS", ca: 5820000, count: 3603 },
  { name: "SEMI-GROS", ca: 3140000, count: 1567 },
  { name: "HORECA", ca: 980000, count: 54 },
  { name: "GROSSISTES", ca: 1560000, count: 27 },
  { name: "DISTRIBUTEUR", ca: 900000, count: 12 },
];

// Dual-axis top familles (KPI-02 / KPI-06)
const dualAxisFamilles = topFamilles.map((f) => ({
  ...f,
  quantite: Math.round(f.ca / (Math.random() * 30 + 20)),
}));

// Heatmap data: Famille x Mois (KPI-06)
const heatmapData = FAMILLES.slice(0, 8).map((f) => ({
  famille: f,
  values: MONTHS.map(() => Math.round(Math.random() * 100)),
}));

const MIN_VAL = 0;
const MAX_VAL = 100;

function getHeatColor(val) {
  const ratio = (val - MIN_VAL) / (MAX_VAL - MIN_VAL);
  const r = Math.round(59 + ratio * (239 - 59));
  const g = Math.round(130 - ratio * 130);
  const b = Math.round(246 - ratio * 200);
  return `rgb(${r},${g},${b})`;
}

function Heatmap() {
  const cellW = 44;
  const cellH = 28;
  const labelW = 110;
  const headerH = 22;
  const width = labelW + MONTHS.length * cellW;
  const height = headerH + FAMILLES.slice(0, 8).length * cellH;

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} style={{ fontSize: 10 }}>
        {/* Month headers */}
        {MONTHS.map((m, mi) => (
          <text
            key={m}
            x={labelW + mi * cellW + cellW / 2}
            y={headerH - 5}
            textAnchor="middle"
            fill="#666"
            fontSize={10}
          >
            {m}
          </text>
        ))}
        {heatmapData.map((row, ri) => (
          <g key={row.famille}>
            <text
              x={labelW - 6}
              y={headerH + ri * cellH + cellH / 2 + 4}
              textAnchor="end"
              fill="#999"
              fontSize={10}
            >
              {row.famille}
            </text>
            {row.values.map((val, mi) => (
              <g key={mi}>
                <rect
                  x={labelW + mi * cellW + 1}
                  y={headerH + ri * cellH + 1}
                  width={cellW - 2}
                  height={cellH - 2}
                  fill={getHeatColor(val)}
                  rx={3}
                  opacity={0.85}
                />
                <text
                  x={labelW + mi * cellW + cellW / 2}
                  y={headerH + ri * cellH + cellH / 2 + 4}
                  textAnchor="middle"
                  fill={val > 60 ? "#fff" : "#ccc"}
                  fontSize={9}
                >
                  {val}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

const columns = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "client", header: "Client" },
  { accessorKey: "famille", header: "Famille" },
  { accessorKey: "article", header: "Article" },
  { accessorKey: "quantite", header: "Quantité" },
  { accessorKey: "montantHT", header: "Montant HT", cell: ({ getValue }) => formatTND(getValue()) },
  { accessorKey: "montantTTC", header: "Montant TTC", cell: ({ getValue }) => formatTND(getValue()) },
];

function VentesPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards — draft D1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="CA Total HT 2024" value="12.4 MDT" trend={8.2} icon={DollarSign} />
        <KPICard label="CA Total TTC 2024" value="14.7 MDT" trend={8.2} icon={DollarSign} />
        <KPICard label="Taux remise moyen" value="3.8%" trend={-0.4} icon={Tag} />
        <KPICard label="Articles actifs" value="3 777" subtitle="1 014 en sommeil" icon={Package} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Widget A: LineChart + Prophet forecast (KPI-01/05) */}
        <ChartCard title="Évolution CA HT — Prévision Prophet (KPI-01/05)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={forecastData}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#888" }} />
              <ReferenceLine x="Oct" stroke="#444" strokeDasharray="4 4" label={{ value: "Prévision →", fill: "#666", fontSize: 10 }} />
              <Line type="monotone" dataKey="ca" stroke="#3b82f6" strokeWidth={2} dot={false} name="CA réel" />
              <Line type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Prévision" connectNulls />
              <Line type="monotone" dataKey="forecastHigh" stroke="#6366f1" strokeWidth={1} strokeDasharray="2 4" dot={false} name="IC 80% haut" connectNulls strokeOpacity={0.5} />
              <Line type="monotone" dataKey="forecastLow" stroke="#6366f1" strokeWidth={1} strokeDasharray="2 4" dot={false} name="IC 80% bas" connectNulls strokeOpacity={0.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Widget B: Horizontal BarChart by client category (KPI-03) */}
        <ChartCard title="CA par catégorie client (KPI-03)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={clientCategoryData} layout="vertical">
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#999", fontSize: 11 }} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ca" fill="#3b82f6" radius={[0, 4, 4, 0]} name="CA (DT)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Widget C: Dual-axis Bar CA + Quantité (KPI-02/06) */}
        <ChartCard title="Top familles — CA & Quantité (KPI-02/06)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dualAxisFamilles}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 10 }} axisLine={false} angle={-20} textAnchor="end" height={45} />
              <YAxis yAxisId="left" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#a855f7", fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#888" }} />
              <Bar yAxisId="left" dataKey="ca" fill="#3b82f6" radius={[4, 4, 0, 0]} name="CA (DT)" />
              <Bar yAxisId="right" dataKey="quantite" fill="#a855f7" radius={[4, 4, 0, 0]} name="Quantité" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Widget D: Heatmap Famille × Mois (KPI-06) */}
        <ChartCard title="Saisonnalité ventes — Famille × Mois (KPI-06)">
          <div className="pt-2">
            <Heatmap />
            <p className="text-[10px] text-text-dim mt-2 text-right">Couleur = intensité ventes (quantité)</p>
          </div>
        </ChartCard>
      </div>

      <DataTable data={ventesDetail} columns={columns} expandable />
    </div>
  );
}