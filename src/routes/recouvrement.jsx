import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { DollarSign, Users, Percent, Clock, AlertTriangle } from "lucide-react";
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
} from "recharts";
import { reglements, encaissementsByMonth, MONTHS, CHART_COLORS, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/recouvrement")({
  component: RecouvrementPage,
});
function StatusBadge({ statut }) {
  const cls =
    statut === "Payé"
      ? "bg-status-paid-bg text-status-paid"
      : statut === "Impayé"
        ? "bg-status-unpaid-bg text-status-unpaid"
        : "bg-status-late-bg text-status-late";
  return _jsx("span", { className: `${cls} rounded px-2 py-0.5 text-[11px]`, children: statut });
}
const columns = [
  { accessorKey: "client", header: "Client" },
  { accessorKey: "dateEcheance", header: "Échéance" },
  { accessorKey: "montant", header: "Montant", cell: ({ getValue }) => formatTND(getValue()) },
  { accessorKey: "modeReglement", header: "Mode" },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ getValue }) => _jsx(StatusBadge, { statut: getValue() }),
  },
  {
    accessorKey: "retard",
    header: "Retard (j)",
    cell: ({ getValue }) => {
      const v = getValue();
      return v > 0 ? _jsxs("span", { className: "text-trend-down", children: [v, "j"] }) : "-";
    },
  },
];
const totalEncaisse = reglements
  .filter((r) => r.statut === "Payé")
  .reduce((s, r) => s + r.montant, 0);
const totalImpayes = reglements
  .filter((r) => r.statut === "Impayé")
  .reduce((s, r) => s + r.montant, 0);
const tauxRecouv = (totalEncaisse / (totalEncaisse + totalImpayes)) * 100;
const modeData = ["Espèces", "Chèque", "Virement", "Traite"].map((m) => ({
  name: m,
  value: reglements.filter((r) => r.modeReglement === m).reduce((s, r) => s + r.montant, 0),
}));
const top10Encours = [...reglements]
  .filter((r) => r.statut !== "Payé")
  .sort((a, b) => b.montant - a.montant)
  .slice(0, 10);
const tauxRecovByMonth = MONTHS.map((m, i) => ({
  month: m,
  taux: Math.round(65 + Math.random() * 25),
}));
function RecouvrementPage() {
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-12",
        children: [
          _jsx(KPICard, {
            label: "Total Encaiss\u00E9",
            value: formatTND(totalEncaisse),
            trend: 4.2,
            icon: DollarSign,
          }),
          _jsx(KPICard, { label: "Encours Client", value: formatTND(totalImpayes), icon: Users }),
          _jsx(KPICard, {
            label: "Taux Recouvrement",
            value: `${tauxRecouv.toFixed(1)}%`,
            trend: -1.5,
            icon: Percent,
          }),
          _jsx(KPICard, { label: "D\u00E9lai Moyen Paiement", value: "42 jours", icon: Clock }),
          _jsx(KPICard, {
            label: "Total Impay\u00E9s",
            value: formatTND(totalImpayes),
            trend: -3.8,
            icon: AlertTriangle,
          }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "Encaissements par mois (empil\u00E9)",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: encaissementsByMonth,
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "month",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Legend, { wrapperStyle: { fontSize: 12, color: "#888" } }),
                  _jsx(Bar, {
                    dataKey: "especes",
                    stackId: "a",
                    fill: "#3b82f6",
                    name: "Esp\u00E8ces",
                  }),
                  _jsx(Bar, {
                    dataKey: "cheque",
                    stackId: "a",
                    fill: "#6366f1",
                    name: "Ch\u00E8que",
                  }),
                  _jsx(Bar, {
                    dataKey: "virement",
                    stackId: "a",
                    fill: "#8b5cf6",
                    name: "Virement",
                  }),
                  _jsx(Bar, {
                    dataKey: "traite",
                    stackId: "a",
                    fill: "#a855f7",
                    name: "Traite",
                    radius: [4, 4, 0, 0],
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "\u00C9volution taux de recouvrement",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(LineChart, {
                data: tauxRecovByMonth,
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "month",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                  }),
                  _jsx(YAxis, {
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                    domain: [0, 100],
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Line, {
                    type: "monotone",
                    dataKey: "taux",
                    stroke: "#22c55e",
                    strokeWidth: 2,
                    dot: false,
                    name: "Taux %",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "R\u00E9partition par mode de r\u00E8glement",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(PieChart, {
                children: [
                  _jsx(Pie, {
                    data: modeData,
                    dataKey: "value",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 100,
                    label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`,
                    fontSize: 11,
                    children: modeData.map((_, i) => _jsx(Cell, { fill: CHART_COLORS[i] }, i)),
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Top 10 clients par encours impay\u00E9",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: top10Encours,
                layout: "vertical",
                children: [
                  _jsx(CartesianGrid, {
                    stroke: "#2a2a2a",
                    strokeDasharray: "3 3",
                    horizontal: false,
                  }),
                  _jsx(XAxis, {
                    type: "number",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                  }),
                  _jsx(YAxis, {
                    type: "category",
                    dataKey: "client",
                    tick: { fill: "#666", fontSize: 10 },
                    axisLine: false,
                    width: 80,
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, {
                    dataKey: "montant",
                    fill: "#ef4444",
                    radius: [0, 4, 4, 0],
                    name: "Impay\u00E9",
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      _jsx(DataTable, { data: reglements, columns: columns }),
    ],
  });
}
