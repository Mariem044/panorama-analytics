import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { DollarSign, Truck, Clock, CheckCircle } from "lucide-react";
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
import { fournisseurs, achatsByMonth, FAMILLES, CHART_COLORS, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/achats")({
  component: AchatsPage,
});
const columns = [
  { accessorKey: "nom", header: "Fournisseur" },
  { accessorKey: "famille", header: "Famille" },
  {
    accessorKey: "totalAchats",
    header: "Total Achats",
    cell: ({ getValue }) => formatTND(getValue()),
  },
  { accessorKey: "nbCommandes", header: "Commandes" },
  { accessorKey: "delaiMoyen", header: "Délai (j)" },
  { accessorKey: "tauxConformite", header: "Conformité", cell: ({ getValue }) => `${getValue()}%` },
];
const totalAchats = fournisseurs.reduce((s, f) => s + f.totalAchats, 0);
const top10 = [...fournisseurs].sort((a, b) => b.totalAchats - a.totalAchats).slice(0, 10);
const achatsByFamille = FAMILLES.map((f) => ({
  name: f,
  value: fournisseurs.filter((fo) => fo.famille === f).reduce((s, fo) => s + fo.totalAchats, 0),
}));
function AchatsPage() {
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-12",
        children: [
          _jsx(KPICard, {
            label: "Total Achats",
            value: formatTND(totalAchats),
            trend: 3.7,
            icon: DollarSign,
          }),
          _jsx(KPICard, {
            label: "Fournisseurs Actifs",
            value: fournisseurs.length.toString(),
            icon: Truck,
          }),
          _jsx(KPICard, { label: "D\u00E9lai Moyen Livraison", value: "8 jours", icon: Clock }),
          _jsx(KPICard, {
            label: "Taux Conformit\u00E9",
            value: "91.2%",
            trend: 1.5,
            icon: CheckCircle,
          }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "Top 10 fournisseurs par achats",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: top10,
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
                    dataKey: "nom",
                    tick: { fill: "#666", fontSize: 10 },
                    axisLine: false,
                    width: 100,
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, {
                    dataKey: "totalAchats",
                    fill: "#3b82f6",
                    radius: [0, 4, 4, 0],
                    name: "Achats",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "\u00C9volution achats mensuels",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(LineChart, {
                data: achatsByMonth,
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "month",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Line, {
                    type: "monotone",
                    dataKey: "achats",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    dot: false,
                    name: "Achats",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "R\u00E9partition achats par famille",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(PieChart, {
                children: [
                  _jsx(Pie, {
                    data: achatsByFamille,
                    dataKey: "value",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 100,
                    label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`,
                    fontSize: 10,
                    children: achatsByFamille.map((_, i) =>
                      _jsx(Cell, { fill: CHART_COLORS[i % CHART_COLORS.length] }, i),
                    ),
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Achats vs Ventes par famille",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: achatsByFamille.map((a) => ({
                  ...a,
                  ventes: Math.round(a.value * (1.2 + Math.random() * 0.5)),
                })),
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "name",
                    tick: { fill: "#666", fontSize: 10 },
                    axisLine: false,
                    angle: -30,
                    textAnchor: "end",
                    height: 60,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Legend, { wrapperStyle: { fontSize: 12, color: "#888" } }),
                  _jsx(Bar, {
                    dataKey: "value",
                    fill: "#3b82f6",
                    name: "Achats",
                    radius: [4, 4, 0, 0],
                  }),
                  _jsx(Bar, {
                    dataKey: "ventes",
                    fill: "#22c55e",
                    name: "Ventes",
                    radius: [4, 4, 0, 0],
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      _jsx(DataTable, { data: fournisseurs, columns: columns }),
    ],
  });
}
