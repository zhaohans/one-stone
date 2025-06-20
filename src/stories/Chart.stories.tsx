import React from "react";
import { ChartContainer } from "../components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default {
  title: "UI/Chart",
  component: ChartContainer,
};

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 8 },
];

export const Default = () => (
  <ChartContainer config={{ line: { color: "#8884d8" } }}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="y" stroke="#8884d8" />
    </LineChart>
  </ChartContainer>
);
