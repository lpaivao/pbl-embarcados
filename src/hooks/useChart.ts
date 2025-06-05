import { ChartData, ChartOptions } from "chart.js";

function useChart(title: string, xLabels: string[], data: number[]) {
  const chartData: ChartData<"line", number[], string> = {
    labels: xLabels,
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title + " x Tempo",
      },
    },
  };

  return { chartData, options };
}

export default useChart;
