import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useChartHeight } from "@/components/dashboard/ChartCard";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DollarSign, ShoppingCart, Users, Percent, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  caByMonth,
  topFamilles,
  caByRegion,
  CHART_COLORS,
  formatTND,
  formatPercent,
} from "@/data/mockData";

export const Route = createFileRoute("/")({
  component: OverviewPage,
});

function OverviewPage() {
  const totalCA = caByMonth.reduce((s, m) => s + m.ca, 0);
  const chartH = useChartHeight();
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        // Removed pt-12 — the header offset is already handled by DashboardLayout's pt-20
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4",
        children: [
          _jsx(KPICard, {
            label: "Chiffre d'Affaires Total",
            value: formatTND(totalCA),
            trend: 8.2,
            icon: DollarSign,
          }),
          _jsx(KPICard, {
            label: "Nombre de Commandes",
            value: "2 847",
            trend: 5.1,
            icon: ShoppingCart,
          }),
          _jsx(KPICard, { label: "Clients Actifs", value: "312", trend: 3.4, icon: Users }),
          _jsx(KPICard, {
            label: "Taux de Recouvrement",
            value: formatPercent(78.5),
            trend: -2.1,
            icon: Percent,
          }),
          _jsx(KPICard, {
            label: "Marge Brute",
            value: formatPercent(24.3),
            trend: 1.8,
            icon: TrendingUp,
          }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "\u00C9volution mensuelle du CA",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: chartH,
              children: _jsxs(LineChart, {
                data: caByMonth,
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
                    tickFormatter: (v) => `${(v / 1000).toFixed(0)}k`,
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Line, {
                    type: "monotone",
                    dataKey: "ca",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    dot: false,
                    name: "CA",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Top 5 familles de produits par CA",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: chartH,
              children: _jsxs(BarChart, {
                data: topFamilles,
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
                    tickFormatter: (v) => `${(v / 1000).toFixed(0)}k`,
                  }),
                  _jsx(YAxis, {
                    type: "category",
                    dataKey: "name",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                    width: 100,
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, { dataKey: "ca", fill: "#3b82f6", radius: [0, 4, 4, 0], name: "CA" }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "R\u00E9partition CA par r\u00E9gion",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: chartH,
              children: _jsxs(PieChart, {
                children: [
                  _jsx(Pie, {
                    data: caByRegion,
                    dataKey: "ca",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 100,
                    label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`,
                    labelLine: false,
                    fontSize: 11,
                    children: caByRegion.map((_, i) =>
                      _jsx(Cell, { fill: CHART_COLORS[i % CHART_COLORS.length] }, i),
                    ),
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Ventes vs Objectifs",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: chartH,
              children: _jsxs(AreaChart, {
                data: caByMonth,
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
                    tickFormatter: (v) => `${(v / 1000).toFixed(0)}k`,
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Area, {
                    type: "monotone",
                    dataKey: "ca",
                    stroke: "#3b82f6",
                    fill: "#3b82f6",
                    fillOpacity: 0.15,
                    name: "CA R\u00E9alis\u00E9",
                  }),
                  _jsx(Area, {
                    type: "monotone",
                    dataKey: "objectif",
                    stroke: "#6366f1",
                    fill: "none",
                    strokeDasharray: "5 5",
                    name: "Objectif",
                  }),
                  _jsx(Legend, { wrapperStyle: { fontSize: 12, color: "#888" } }),
                ],
              }),
            }),
          }),
        ],
      }),
    ],
  });
}