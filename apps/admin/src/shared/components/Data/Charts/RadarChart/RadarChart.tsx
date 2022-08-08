import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

type RadarChartProps = {
  labels: string[];
  dataset: {
    label: string;
    data: any[];
    borderColor?: string;
    backgroundColor?: string;
    borderWidth?: number;
  };
};

export const RadarChart = ({ labels, dataset }: RadarChartProps) => {
  const data = {
    labels,
    datasets: [dataset],
  };

  return <Radar data={data} />;
};
