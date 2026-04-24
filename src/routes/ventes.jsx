import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { DollarSign, Package, FileText, ShoppingCart, RotateCcw } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { caByMonth, topFamilles, ventesDetail, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/ventes")({
  component: VentesPage,
});
const columns = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "client", header: "Client" },
  { accessorKey: "famille", header: "Famille" },
  { accessorKey: "article", header: "Article" },
  { accessorKey: "quantite", header: "Quantité" },
  {
    accessorKey: "prixUnitaire",
    header: "Prix Unit.",
    cell: ({ getValue }) => `${getValue()} TND`,
  },
  { accessorKey: "montantHT", header: "Montant HT", cell: ({ getValue }) => formatTND(getValue()) },
  {
    accessorKey: "montantTTC",
    header: "Montant TTC",
    cell: ({ getValue }) => formatTND(getValue()),
  },
];
const scatterData = ventesDetail.map((v) => ({ x: v.quantite, y: v.montantHT, name: v.client }));
function VentesPage() {
  const totalCA = ventesDetail.reduce((s, v) => s + v.montantHT, 0);
  const totalQty = ventesDetail.reduce((s, v) => s + v.quantite, 0);
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-12",
        children: [
          _jsx(KPICard, {
            label: "CA Total",
            value: formatTND(totalCA),
            trend: 6.3,
            icon: DollarSign,
          }),
          _jsx(KPICard, {
            label: "Quantit\u00E9 Totale",
            value: totalQty.toLocaleString("fr-TN"),
            trend: 4.1,
            icon: Package,
          }),
          _jsx(KPICard, {
            label: "Lignes de Vente",
            value: ventesDetail.length.toString(),
            icon: FileText,
          }),
          _jsx(KPICard, {
            label: "Panier Moyen",
            value: formatTND(Math.round(totalCA / ventesDetail.length)),
            icon: ShoppingCart,
          }),
          _jsx(KPICard, { label: "Taux de Retour", value: "2.3%", trend: -0.5, icon: RotateCcw }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "CA par famille de produits",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
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
            title: "\u00C9volution des ventes par mois",
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
                    name: "CA",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Volume vs CA par client",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(ScatterChart, {
                children: [
                  _jsx(CartesianGrid, { stroke: "#2a2a2a", strokeDasharray: "3 3" }),
                  _jsx(XAxis, {
                    dataKey: "x",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                    name: "Quantit\u00E9",
                  }),
                  _jsx(YAxis, {
                    dataKey: "y",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                    name: "CA",
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Scatter, { data: scatterData, fill: "#3b82f6" }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Comparaison N vs N-1",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
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
                  _jsx(Legend, { wrapperStyle: { fontSize: 12, color: "#888" } }),
                  _jsx(Bar, { dataKey: "ca", fill: "#3b82f6", name: "2024", radius: [4, 4, 0, 0] }),
                  _jsx(Bar, {
                    dataKey: "caN1",
                    fill: "#6366f1",
                    name: "2023",
                    radius: [4, 4, 0, 0],
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      _jsx(DataTable, {
        data: ventesDetail,
        columns: columns,
        expandable: true,
        renderSubRow: (row) =>
          _jsxs("div", {
            className: "space-y-1",
            children: [
              _jsx("p", {
                className: "text-[12px] text-muted-foreground font-medium mb-2",
                children: "Lignes de commande:",
              }),
              row.lignes.map((l, i) =>
                _jsxs(
                  "div",
                  {
                    className: "flex gap-6 text-[12px] text-secondary-foreground",
                    children: [
                      _jsx("span", { children: l.article }),
                      _jsxs("span", { children: ["Qt\u00E9: ", l.quantite] }),
                      _jsxs("span", { children: ["PU: ", l.prixUnitaire, " TND"] }),
                      _jsxs("span", { children: ["HT: ", formatTND(l.montantHT)] }),
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
