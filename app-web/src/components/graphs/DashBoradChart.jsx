import React from "react";
import { PieChart } from "react-minimal-pie-chart";

const DashboardChart = ({ data, colors }) => {
  const totalValue = data.reduce((total, item) => total + item.value, 0);

  return (
    <PieChart
      data={data.map((item, index) => ({
        ...item,
        color: colors[index % colors.length],
      }))}
      lineWidth={20}
      label={({ dataEntry }) => `${Math.round((dataEntry.value / totalValue) * 100)}%`}
      labelStyle={{
        fontSize: "14px",
        fontFamily: "sans-serif",
        fill: "#444",
      }}
      labelPosition={0}
      animate
      animationDuration={1000}
      animationEasing="ease-out"
    />
  );
};

export default DashboardChart;
