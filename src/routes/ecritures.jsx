import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CustomTooltip } from "@/components/dashboard/CustomTooltip";
import { DataTable } from "@/components/dashboard/DataTable";
import { ArrowDownLeft, ArrowUpRight, Activity, FileText, AlertCircle } from "lucide-react";
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
import { ecritures, MONTHS, CHART_COLORS, formatTND } from "@/data/mockData";
export const Route = createFileRoute("/ecritures")({
  component: EcrituresPage,
});
const columns = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "numPiece", header: "N° Pièce" },
  { accessorKey: "journal", header: "Journal" },
  { accessorKey: "compte", header: "Compte" },
  { accessorKey: "libelle", header: "Libellé" },
  { accessorKey: "debit", header: "Débit", cell: ({ getValue }) => formatTND(getValue()) },
  { accessorKey: "credit", header: "Crédit", cell: ({ getValue }) => formatTND(getValue()) },
  {
    accessorKey: "solde",
    header: "Solde",
    cell: ({ getValue }) => {
      const v = getValue();
      return _jsx("span", {
        className: v >= 0 ? "text-trend-up" : "text-trend-down",
        children: formatTND(v),
      });
    },
  },
];
const totalDebit = ecritures.reduce((s, e) => s + e.debit, 0);
const totalCredit = ecritures.reduce((s, e) => s + e.credit, 0);
const journalData = ["Ventes", "Achats", "Banque", "Caisse"].map((j) => ({
  name: j,
  value: ecritures.filter((e) => e.journal === j).length,
}));
const debitCreditByMonth = MONTHS.map((m) => ({
  month: m,
  debit: Math.round(100000 + Math.random() * 200000),
  credit: Math.round(100000 + Math.random() * 200000),
}));
let cumul = 0;
const soldeCumule = debitCreditByMonth.map((d) => {
  cumul += d.debit - d.credit;
  return { month: d.month, solde: cumul };
});
function EcrituresPage() {
  return _jsxs("div", {
    className: "space-y-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-12",
        children: [
          _jsx(KPICard, {
            label: "Total D\u00E9bit",
            value: formatTND(totalDebit),
            icon: ArrowDownLeft,
          }),
          _jsx(KPICard, {
            label: "Total Cr\u00E9dit",
            value: formatTND(totalCredit),
            icon: ArrowUpRight,
          }),
          _jsx(KPICard, {
            label: "Solde Net",
            value: formatTND(totalDebit - totalCredit),
            icon: Activity,
          }),
          _jsx(KPICard, {
            label: "Nb \u00C9critures",
            value: ecritures.length.toString(),
            icon: FileText,
          }),
          _jsx(KPICard, { label: "Taux Erreur", value: "0.8%", trend: -0.3, icon: AlertCircle }),
        ],
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
          _jsx(ChartCard, {
            title: "D\u00E9bit vs Cr\u00E9dit par mois",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: debitCreditByMonth,
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
                    dataKey: "debit",
                    fill: "#3b82f6",
                    name: "D\u00E9bit",
                    radius: [4, 4, 0, 0],
                  }),
                  _jsx(Bar, {
                    dataKey: "credit",
                    fill: "#6366f1",
                    name: "Cr\u00E9dit",
                    radius: [4, 4, 0, 0],
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "\u00C9volution solde cumul\u00E9",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(LineChart, {
                data: soldeCumule,
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
                    dataKey: "solde",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    dot: false,
                    name: "Solde",
                  }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "R\u00E9partition par journal",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(PieChart, {
                children: [
                  _jsx(Pie, {
                    data: journalData,
                    dataKey: "value",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 100,
                    label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`,
                    fontSize: 11,
                    children: journalData.map((_, i) => _jsx(Cell, { fill: CHART_COLORS[i] }, i)),
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                ],
              }),
            }),
          }),
          _jsx(ChartCard, {
            title: "Top comptes par montant",
            children: _jsx(ResponsiveContainer, {
              width: "100%",
              height: 280,
              children: _jsxs(BarChart, {
                data: ecritures.slice(0, 10),
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
                    dataKey: "compte",
                    tick: { fill: "#666", fontSize: 11 },
                    axisLine: false,
                    width: 70,
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, {
                    dataKey: "debit",
                    fill: "#3b82f6",
                    name: "Montant",
                    radius: [0, 4, 4, 0],
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      _jsx(DataTable, { data: ecritures, columns: columns }),
    ],
  });
}
