import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { AlertTriangle, Users, DollarSign, Percent, Clock } from "lucide-react";
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
  ResponsiveContainer,
} from "recharts";
import { impayes, MONTHS, REGIONS, CHART_COLORS, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/impayes")({
  component: ImpayesPage,
});
function getRowBorderClass(anciennete) {
  if (anciennete > 90) return "border-l-[3px] border-l-[#ef4444]";
  if (anciennete > 60) return "border-l-[3px] border-l-[#f97316]";
  if (anciennete > 30) return "border-l-[3px] border-l-[#eab308]";
  return "";
}
const columns = [
  { accessorKey: "client", header: "Client" },
  { accessorKey: "region", header: "Région" },
  { accessorKey: "representant", header: "Représentant" },
  {
    accessorKey: "montantImpaye",
    header: "Montant",
    cell: ({ getValue }) => formatTND(getValue()),
  },
  { accessorKey: "dateEcheance", header: "Échéance" },
  { accessorKey: "anciennete", header: "Ancienneté (j)" },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ getValue }) => {
      const s = getValue();
      const cls =
        s === "Critique"
          ? "bg-status-unpaid-bg text-status-unpaid"
          : s === "Urgent"
            ? "bg-status-late-bg text-status-late"
            : s === "Attention"
              ? "bg-[#422006] text-[#fbbf24]"
              : "bg-secondary text-secondary-foreground";
      return _jsx("span", { className: `${cls} rounded px-2 py-0.5 text-[11px]`, children: s });
    },
  },
];
const totalImpayes = impayes.reduce((s, i) => s + i.montantImpaye, 0);
const uniqueClients = new Set(impayes.map((i) => i.client)).size;
const avgImpaye = Math.round(totalImpayes / uniqueClients);
const over90 = impayes.filter((i) => i.anciennete > 90).reduce((s, i) => s + i.montantImpaye, 0);
const tranches = [
  {
    name: "0-30j",
    value: impayes.filter((i) => i.anciennete <= 30).reduce((s, i) => s + i.montantImpaye, 0),
  },
  {
    name: "31-60j",
    value: impayes
      .filter((i) => i.anciennete > 30 && i.anciennete <= 60)
      .reduce((s, i) => s + i.montantImpaye, 0),
  },
  {
    name: "61-90j",
    value: impayes
      .filter((i) => i.anciennete > 60 && i.anciennete <= 90)
      .reduce((s, i) => s + i.montantImpaye, 0),
  },
  {
    name: "+90j",
    value: impayes.filter((i) => i.anciennete > 90).reduce((s, i) => s + i.montantImpaye, 0),
  },
];
const impayesEvolution = MONTHS.map((m) => ({
  month: m,
  impayes: Math.round(200000 + Math.random() * 300000),
}));
const top10 = [...impayes].sort((a, b) => b.montantImpaye - a.montantImpaye).slice(0, 10);
const impayesByRegion = REGIONS.map((r) => ({
  name: r,
  value: impayes.filter((i) => i.region === r).reduce((s, i) => s + i.montantImpaye, 0),
}));
function ImpayesPage() {
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-12",
        children: [
          _jsx(KPICard, {
            label: "Total Impay\u00E9s",
            value: formatTND(totalImpayes),
            trend: -5.2,
            icon: AlertTriangle,
          }),
          _jsx(KPICard, {
            label: "Clients en Impay\u00E9",
            value: uniqueClients.toString(),
            icon: Users,
          }),
          _jsx(KPICard, {
            label: "Impay\u00E9 Moyen/Client",
            value: formatTND(avgImpaye),
            icon: DollarSign,
          }),
          _jsx(KPICard, {
            label: "Taux Impay\u00E9/CA",
            value: "12.4%",
            trend: -1.8,
            icon: Percent,
          }),
          _jsx(KPICard, { label: "Impay\u00E9s > 90j", value: formatTND(over90), icon: Clock }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "Impay\u00E9s par tranche d'anciennet\u00E9",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: tranches,
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "name",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsxs(Bar, {
                    dataKey: "value",
                    name: "Montant",
                    radius: [4, 4, 0, 0],
                    children: [
                      _jsx(Cell, { fill: "#22c55e" }),
                      _jsx(Cell, { fill: "#eab308" }),
                      _jsx(Cell, { fill: "#f97316" }),
                      _jsx(Cell, { fill: "#ef4444" }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "\u00C9volution mensuelle des impay\u00E9s",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(LineChart, {
                data: impayesEvolution,
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
                    dataKey: "impayes",
                    stroke: "#ef4444",
                    strokeWidth: 2,
                    dot: false,
                    name: "Impay\u00E9s",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Top 10 clients par montant impay\u00E9",
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
                    dataKey: "client",
                    tick: { fill: "#666", fontSize: 10 },
                    axisLine: false,
                    width: 80,
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, {
                    dataKey: "montantImpaye",
                    fill: "#ef4444",
                    radius: [0, 4, 4, 0],
                    name: "Impay\u00E9",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "R\u00E9partition impay\u00E9s par r\u00E9gion",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(PieChart, {
                children: [
                  _jsx(Pie, {
                    data: impayesByRegion,
                    dataKey: "value",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 100,
                    label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`,
                    fontSize: 10,
                    children: impayesByRegion.map((_, i) =>
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
        data: impayes,
        columns: columns,
        expandable: true,
        renderSubRow: (row) =>
          _jsxs("div", {
            className: "space-y-1",
            children: [
              _jsx("p", {
                className: "text-[12px] text-muted-foreground font-medium mb-2",
                children: "Factures impay\u00E9es:",
              }),
              row.factures.map((f, i) =>
                _jsxs(
                  "div",
                  {
                    className: "flex gap-6 text-[12px] text-secondary-foreground",
                    children: [
                      _jsx("span", { children: f.numero }),
                      _jsx("span", { children: f.date }),
                      _jsx("span", { children: formatTND(f.montant) }),
                    ],
                  },
                  i,
                ),
              ),
            ],
          }),
      }),
    ],
  });
}
