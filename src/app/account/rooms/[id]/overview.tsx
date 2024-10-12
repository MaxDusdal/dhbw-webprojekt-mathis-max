import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatNumber } from "./dashboard";

const monthNames = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

interface OverviewProps {
  monthlyEarnings: number[];
  bestMonth: number;
}

const CustomTooltip = ({ active, payload, label, coordinate }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="absolute rounded border border-gray-300 bg-white p-2 shadow-md"
        style={{
          left: coordinate.x,
          top: coordinate.y - 70, // Positioniert den Tooltip über dem Balken
          transform: "translateX(-50%)",
        }}
      >
        <div className="font-bold">{label}</div>
        <div className="text-primary">{formatNumber(payload[0].value)}€</div>
        <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 transform border-b border-r border-gray-300 bg-white"></div>
      </div>
    );
  }
  return null;
};

export default function Overview({
  monthlyEarnings,
  bestMonth,
}: OverviewProps) {
  const data = monthlyEarnings.map((total, index) => ({
    name: monthNames[index],
    total,
  }));

  const yAxisMax = Math.ceil(bestMonth / 1000) * 1000;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value}`}
          domain={[0, yAxisMax]}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "transparent" }}
          position={{ x: 0, y: 0 }} // Dies wird durch die benutzerdefinierte Positionierung überschrieben
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
