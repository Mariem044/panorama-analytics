import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { Package, Star, DollarSign, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { articles, FAMILLES, CHART_COLORS, caByMonth, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/produits")({
  component: ProduitsPage,
});
const columns = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "designation", header: "Désignation" },
  { accessorKey: "famille", header: "Famille" },
  { accessorKey: "qteVendue", header: "Qté Vendue" },
  { accessorKey: "ca", header: "CA", cell: ({ getValue }) => formatTND(getValue()) },
  { accessorKey: "prixMoyen", header: "Prix Moyen", cell: ({ getValue }) => `${getValue()} TND` },
  { accessorKey: "marge", header: "Marge %", cell: ({ getValue }) => `${getValue()}%` },
];
const top15 = [...articles].sort((a, b) => b.qteVendue - a.qteVendue).slice(0, 15);
const bestArticle = top15[0];
const caByFamille = FAMILLES.map((f) => ({
  name: f,
  value: articles.filter((a) => a.famille === f).reduce((s, a) => s + a.ca, 0),
}));
const treemapData = caByFamille.map((f, i) => ({
  name: f.name,
  size: f.value,
  fill: CHART_COLORS[i % CHART_COLORS.length],
}));
function ProduitsPage() {
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-12",
        children: [
          _jsx(KPICard, {
            label: "R\u00E9f\u00E9rences Actives",
            value: articles.length.toString(),
            icon: Package,
          }),
          _jsx(KPICard, {
            label: "Article Top",
            value: `${bestArticle.designation} (${bestArticle.qteVendue})`,
            icon: Star,
          }),
          _jsx(KPICard, {
            label: "Top Famille CA",
            value: caByFamille.sort((a, b) => b.value - a.value)[0].name,
            icon: DollarSign,
          }),
          _jsx(KPICard, {
            label: "Taux de Rupture",
            value: "4.2%",
            trend: -1.1,
            icon: AlertTriangle,
          }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "CA par famille (Treemap)",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsx(Treemap, {
                data: treemapData,
                dataKey: "size",
                nameKey: "name",
                stroke: "#2a2a2a",
                children: treemapData.map((d, i) => _jsx(Cell, { fill: d.fill }, i)),
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Top 15 articles par quantit\u00E9",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: top15,
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "designation",
                    tick: { fill: "#666", fontSize: 10 },
                    axisLine: false,
                    angle: -45,
                    textAnchor: "end",
                    height: 60,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, {
                    dataKey: "qteVendue",
                    fill: "#3b82f6",
                    radius: [4, 4, 0, 0],
                    name: "Quantit\u00E9",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "\u00C9volution ventes article s\u00E9lectionn\u00E9",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(LineChart, {
                data: caByMonth,
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
                    dataKey: "ca",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    dot: false,
                    name: "Ventes",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "R\u00E9partition CA par famille",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(PieChart, {
                children: [
                  _jsx(Pie, {
                    data: caByFamille,
                    dataKey: "value",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 100,
                    label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`,
                    fontSize: 10,
                    children: caByFamille.map((_, i) =>
                      _jsx(Cell, { fill: CHART_COLORS[i % CHART_COLORS.length] }, i),
                    ),
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                ],
              }),
            }),
          }),
        ],
      }),
      _jsx(DataTable, { data: articles, columns: columns }),
    ],
  });
}
