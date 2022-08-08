import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  labels: string[];
  dataset: {
    label: string;
    data: any[];
    borderColor?: string[];
    backgroundColor?: string[];
    borderWidth?: number;
  };
};

export const PieChart = ({ labels, dataset }: PieChartProps) => {
  const data = {
    labels,
    datasets: [dataset],
  };

  return <Pie data={data} />;
};
