import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from 'chart.js';
import { useTheme } from 'next-themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export function LineChart({ data }: LineChartProps) {
  const { theme } = useTheme();

  // Define color palette for product types
  const colorPalette = {
    courses: '#0ea5e9', // cyan-400 / sky-500
    tickets: '#f472b6', // pink-400 / fuchsia-600
    subscriptions: '#65a30d', // lime-400 / lime-700
    digital: '#8b5cf6', // yellow-400 / amber-600
    physical: '#d97706', // yellow-400 / amber-600
  };

  // Assign colors to datasets by label
  const themedData = {
    ...data,
    datasets: data.datasets.map((dataset) => {
      let color = colorPalette.courses;
      if (dataset.label.toLowerCase().includes('ticket'))
        color = colorPalette.tickets;
      if (dataset.label.toLowerCase().includes('subscription'))
        color = colorPalette.subscriptions;
      if (dataset.label.toLowerCase().includes('digital'))
        color = colorPalette.digital;
      if (dataset.label.toLowerCase().includes('physical'))
        color = colorPalette.physical;
      return {
        ...dataset,
        borderColor: color,
        backgroundColor: color + '33', // 20% opacity for fill
        pointBackgroundColor: color,
        pointBorderColor: theme === 'dark' ? '#18181b' : '#fff',
        pointHoverBackgroundColor: theme === 'dark' ? '#fff' : color,
        pointHoverBorderColor: color,
      };
    }),
  };

  // Interactive and beautiful chart options
  const baseOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#fff' : '#374151',
          boxWidth: 12,
          padding: 20,
          usePointStyle: true,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets || [];
            return datasets.map((ds, i) => {
              const label = typeof ds.label === 'string' ? ds.label : '';
              let color = colorPalette.courses;
              if (label.toLowerCase().includes('ticket'))
                color = colorPalette.tickets;
              if (label.toLowerCase().includes('subscription'))
                color = colorPalette.subscriptions;
              if (label.toLowerCase().includes('digital'))
                color = colorPalette.digital;
              if (label.toLowerCase().includes('physical'))
                color = colorPalette.physical;
              return {
                text: label,
                fillStyle: color,
                strokeStyle: color,
                lineWidth: 3,
                hidden: !chart.isDatasetVisible(i),
                index: i,
                fontColor: color,
                pointStyle: 'circle',
              };
            });
          },
          font: {
            size: 14,
            weight: 'bold',
            family: 'inherit',
          },
        },
        onClick: (e, legendItem, legend) => {
          const ci = legend.chart;
          const idx =
            typeof legendItem.index === 'number' ? legendItem.index : 0;
          ci.toggleDataVisibility(idx);
          ci.update();
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === 'dark' ? '#18181b' : '#fff',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        bodyColor: theme === 'dark' ? '#d1d5db' : '#4b5563',
        borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
        borderWidth: 1,
        padding: 14,
        usePointStyle: true,
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null)
              label += context.parsed.y.toLocaleString();
            return label;
          },
        },
        caretSize: 8,
        caretPadding: 8,
        cornerRadius: 8,
        titleFont: { weight: 'bold', size: 16 },
        bodyFont: { size: 14 },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
    },
    elements: {
      line: {
        tension: 0.35, // smooth curves
        borderWidth: 3,
        fill: 'start',
        backgroundColor: (ctx) => {
          // Add a subtle gradient fill
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return 'rgba(0,0,0,0)';
          // Use the dataset color for the gradient
          const datasetIndex = ctx.datasetIndex;
          const ds = themedData.datasets[datasetIndex];
          const color = ds.borderColor as string;
          const gradient = canvasCtx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, color + '33'); // 20% opacity
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          return gradient;
        },
      },
      point: {
        radius: 5,
        hoverRadius: 8,
        borderWidth: 2,
        hoverBorderWidth: 3,
        hitRadius: 12,
        pointStyle: 'circle',
      },
    },
    scales: {
      x: {
        grid: {
          color:
            theme === 'dark'
              ? 'rgba(75, 85, 99, 0.3)'
              : 'rgba(209, 213, 219, 0.5)',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        },
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color:
            theme === 'dark'
              ? 'rgba(75, 85, 99, 0.3)'
              : 'rgba(209, 213, 219, 0.5)',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          stepSize: 100,
        },
        title: {
          display: false,
        },
      },
    },
  };

  return (
    <div className='h-[400px] w-full'>
      <Line options={baseOptions} data={themedData} />
    </div>
  );
}
