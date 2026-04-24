import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { Users, DollarSign, Target, MapPin } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { representants, caByMonth, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/commerciaux")({
  component: CommerciauxPage,
});
const columns = [
  { accessorKey: "nom", header: "Représentant" },
  { accessorKey: "region", header: "Région" },
  { accessorKey: "caTotal", header: "CA Total", cell: ({ getValue }) => formatTND(getValue()) },
  { accessorKey: "nbClients", header: "Clients" },
  { accessorKey: "nbCommandes", header: "Commandes" },
  { accessorKey: "tauxObjectif", header: "Taux Obj.", cell: ({ getValue }) => `${getValue()}%` },
];
const sorted = [...representants].sort((a, b) => b.caTotal - a.caTotal);
const radarData = sorted.slice(0, 5).map((r) => ({
  name: r.nom.replace("Représentant ", "R"),
  ca: Math.round(r.caTotal / 10000),
  clients: r.nbClients,
  commandes: Math.round(r.nbCommandes / 5),
  recouvrement: r.recouvrement,
}));
function CommerciauxPage() {
  const topRep = sorted[0];
  const avgObj = Math.round(
    representants.reduce((s, r) => s + r.tauxObjectif, 0) / representants.length,
  );
  const totalVisites = representants.reduce((s, r) => s + r.visites, 0);
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-12",
        children: [
          _jsx(KPICard, {
            label: "Repr\u00E9sentants",
            value: representants.length.toString(),
            icon: Users,
          }),
          _jsx(KPICard, {
            label: "Top CA",
            value: `${topRep.nom} (${formatTND(topRep.caTotal)})`,
            icon: DollarSign,
          }),
          _jsx(KPICard, {
            label: "Taux Objectif Moy.",
            value: `${avgObj}%`,
            trend: 2.3,
            icon: Target,
          }),
          _jsx(KPICard, {
            label: "Visites Clients",
            value: totalVisites.toLocaleString("fr-TN"),
            icon: MapPin,
          }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "Classement par CA",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: sorted,
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
                    width: 110,
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
            title: "Performance mensuelle",
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
                    name: "Performance",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Comparaison multi-crit\u00E8res (Radar)",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(RadarChart, {
                data: radarData,
                children: [
                  _jsx(PolarGrid, { stroke: "#2a2a2a" }),
                  _jsx(PolarAngleAxis, { dataKey: "name", tick: { fill: "#888", fontSize: 11 } }),
                  _jsx(PolarRadiusAxis, { tick: { fill: "#666", fontSize: 10 } }),
                  _jsx(Radar, {
                    name: "CA",
                    dataKey: "ca",
                    stroke: "#3b82f6",
                    fill: "#3b82f6",
                    fillOpacity: 0.2,
                  }),
                  _jsx(Radar, {
                    name: "Clients",
                    dataKey: "clients",
                    stroke: "#6366f1",
                    fill: "#6366f1",
                    fillOpacity: 0.1,
                  }),
                  _jsx(Legend, { wrapperStyle: { fontSize: 12, color: "#888" } }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "CA R\u00E9alis\u00E9 vs Objectif",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: sorted,
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "nom",
                    tick: { fill: "#666", fontSize: 9 },
                    axisLine: false,
                    angle: -30,
                    textAnchor: "end",
                    height: 60,
                  }),
                  _jsx(YAxis, { tick: { fill: "#666", fontSize: 11 }, axisLine: false }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Legend, { wrapperStyle: { fontSize: 12, color: "#888" } }),
                  _jsx(Bar, {
                    dataKey: "caTotal",
                    fill: "#3b82f6",
                    name: "R\u00E9alis\u00E9",
                    radius: [4, 4, 0, 0],
                  }),
                  _jsx(Bar, {
                    dataKey: "objectif",
                    fill: "#6366f1",
                    name: "Objectif",
                    radius: [4, 4, 0, 0],
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      _jsx(DataTable, {
        data: representants,
        columns: columns,
        expandable: true,
        renderSubRow: (r) =>
          _jsxs("p", {
            className: "text-[12px] text-secondary-foreground",
            children: [
              r.nom,
              " \u2014 ",
              r.nbClients,
              " clients, ",
              r.nbCommandes,
              " commandes, taux recouvrement ",
              r.recouvrement,
              "%",
            ],
          }),
      }),
    ],
  });
}
