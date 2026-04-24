import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { Users, UserPlus, UserCheck, DollarSign, Heart } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { clients, caByRegion, CHART_COLORS, MONTHS, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/clients")({
  component: ClientsPage,
});
const columns = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "nom", header: "Nom" },
  { accessorKey: "region", header: "Région" },
  { accessorKey: "caTotal", header: "CA Total", cell: ({ getValue }) => formatTND(getValue()) },
  { accessorKey: "nbCommandes", header: "Commandes" },
  { accessorKey: "derniereCommande", header: "Dernière Cmd" },
  {
    accessorKey: "soldeImpaye",
    header: "Solde Impayé",
    cell: ({ getValue }) => formatTND(getValue()),
  },
];
const top10 = [...clients].sort((a, b) => b.caTotal - a.caTotal).slice(0, 10);
const segments = [
  { name: "Grand compte", value: clients.filter((c) => c.segment === "Grand compte").length },
  { name: "PME", value: clients.filter((c) => c.segment === "PME").length },
  { name: "Petit client", value: clients.filter((c) => c.segment === "Petit client").length },
];
const clientsActifsByMonth = MONTHS.map((m, i) => ({
  month: m,
  actifs: Math.round(250 + Math.random() * 80),
}));
function ClientsPage() {
  const totalCA = clients.reduce((s, c) => s + c.caTotal, 0);
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-12",
        children: [
          _jsx(KPICard, { label: "Total Clients", value: clients.length.toString(), icon: Users }),
          _jsx(KPICard, {
            label: "Nouveaux Clients",
            value: clients.filter((c) => c.nouveau).length.toString(),
            trend: 12.5,
            icon: UserPlus,
          }),
          _jsx(KPICard, {
            label: "Clients Actifs",
            value: clients.filter((c) => c.actif).length.toString(),
            icon: UserCheck,
          }),
          _jsx(KPICard, {
            label: "CA Moyen/Client",
            value: formatTND(Math.round(totalCA / clients.length)),
            icon: DollarSign,
          }),
          _jsx(KPICard, {
            label: "Taux Fid\u00E9lisation",
            value: "82.4%",
            trend: 3.2,
            icon: Heart,
          }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "Top 10 clients par CA",
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
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                    width: 80,
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, {
                    dataKey: "caTotal",
                    fill: "#3b82f6",
                    radius: [0, 4, 4, 0],
                    name: "CA",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Segmentation clients",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(PieChart, {
                children: [
                  _jsx(Pie, {
                    data: segments,
                    dataKey: "value",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 100,
                    label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`,
                    fontSize: 11,
                    children: segments.map((_, i) => _jsx(Cell, { fill: CHART_COLORS[i] }, i)),
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "\u00C9volution clients actifs",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(LineChart, {
                data: clientsActifsByMonth,
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
                    dataKey: "actifs",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    dot: false,
                    name: "Actifs",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Clients par r\u00E9gion",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: caByRegion,
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "name",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, {
                    dataKey: "clients",
                    fill: "#6366f1",
                    radius: [4, 4, 0, 0],
                    name: "Clients",
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      _jsx(DataTable, {
        data: clients,
        columns: columns,
        expandable: true,
        renderSubRow: (row) =>
          _jsxs("p", {
            className: "text-[12px] text-secondary-foreground",
            children: [
              "Historique commandes de ",
              row.nom,
              " \u2014 ",
              row.nbCommandes,
              " commandes, derni\u00E8re le ",
              row.derniereCommande,
            ],
          }),
      }),
    ],
  });
}
