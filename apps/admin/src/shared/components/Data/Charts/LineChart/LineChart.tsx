import React from 'react';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

type LineChartProps = {
  labels: string[];
  dataset: {
    label: string;
    data: any[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  };
};

export const LineChart = ({ labels, dataset }: LineChartProps) => {
  const options = {
    responsive: true,
  };

  const data = {
    labels,
    datasets: [dataset],
  };

  return <Line options={options} data={data} />;
};
