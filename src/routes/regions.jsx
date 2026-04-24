import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { MapPin, Trophy, DollarSign, Globe } from "lucide-react";
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
import { caByRegion, caByMonth, REGIONS, CHART_COLORS, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/regions")({
  component: RegionsPage,
});
const columns = [
  { accessorKey: "name", header: "Région" },
  { accessorKey: "clients", header: "Clients" },
  { accessorKey: "ca", header: "CA Total", cell: ({ getValue }) => formatTND(getValue()) },
  { accessorKey: "commandes", header: "Commandes" },
];
const sorted = [...caByRegion].sort((a, b) => b.ca - a.ca);
const totalCA = caByRegion.reduce((s, r) => s + r.ca, 0);
const topRegion = sorted[0];
const avgCA = Math.round(totalCA / REGIONS.length);
const caEvolution = caByMonth.map((m) => {
  const obj = { month: m.month };
  REGIONS.slice(0, 4).forEach((r, i) => {
    obj[r] = Math.round(50000 + Math.random() * 200000);
  });
  return obj;
});
function RegionsPage() {
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-12",
        children: [
          _jsx(KPICard, {
            label: "R\u00E9gions Actives",
            value: REGIONS.length.toString(),
            icon: MapPin,
          }),
          _jsx(KPICard, { label: "R\u00E9gion Top CA", value: topRegion.name, icon: Trophy }),
          _jsx(KPICard, {
            label: "CA Moyen/R\u00E9gion",
            value: formatTND(avgCA),
            icon: DollarSign,
          }),
          _jsx(KPICard, { label: "Taux Couverture", value: "87.5%", trend: 2.1, icon: Globe }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "CA par r\u00E9gion (classement)",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: sorted,
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "name",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, { dataKey: "ca", fill: "#3b82f6", radius: [4, 4, 0, 0], name: "CA" }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "\u00C9volution CA par r\u00E9gion (12 mois)",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(LineChart, {
                data: caEvolution,
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
                  REGIONS.slice(0, 4).map((r, i) =>
                    _jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: r,
                        stroke: CHART_COLORS[i],
                        strokeWidth: 2,
                        dot: false,
                      },
                      r,
                    ),
                  ),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Comparaison r\u00E9gions",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: sorted.slice(0, 6),
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "name",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Legend, { wrapperStyle: { fontSize: 12, color: "#888" } }),
                  _jsx(Bar, { dataKey: "ca", fill: "#3b82f6", name: "CA", radius: [4, 4, 0, 0] }),
                  _jsx(Bar, {
                    dataKey: "clients",
                    fill: "#6366f1",
                    name: "Clients",
                    radius: [4, 4, 0, 0],
                  }),
                  _jsx(Bar, {
                    dataKey: "commandes",
                    fill: "#8b5cf6",
                    name: "Commandes",
                    radius: [4, 4, 0, 0],
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Part de march\u00E9 par r\u00E9gion",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
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
                    fontSize: 10,
                    children: caByRegion.map((_, i) =>
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
      _jsx(DataTable, {
        data: caByRegion,
        columns: columns,
        expandable: true,
        renderSubRow: (r) =>
          _jsxs("p", {
            className: "text-[12px] text-secondary-foreground",
            children: [
              "Clients de ",
              r.name,
              ": ",
              r.clients,
              " clients, ",
              r.commandes,
              " commandes",
            ],
          }),
      }),
    ],
  });
}
