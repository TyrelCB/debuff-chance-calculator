import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

// Calibrated sigmoid: 3–97% cap, 50/50 at -42, 92% at 0
const calibratedSigmoid = (d) => {
  const minCap = 0.03;
  const maxCap = 0.97;
  const d0 = -42;
  const k = 0.0686;
  const raw = 1 / (1 + Math.exp(-k * (d - d0)));
  return (minCap + (maxCap - minCap) * raw) * 100;
};

export default function DebuffChanceCalculator() {
  const [accuracy, setAccuracy] = useState(100);
  const [resistance, setResistance] = useState(100);

  const diff = accuracy - resistance;
  const chance = calibratedSigmoid(diff);

  const xValues = Array.from({ length: 201 }, (_, i) => i - 100);
  const yValues = xValues.map(d => calibratedSigmoid(d));

  const data = {
    labels: xValues,
    datasets: [
      {
        label: 'Debuff Chance (%)',
        data: yValues,
        borderColor: '#63b3ed', // lighter blue for dark mode
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Your Input',
        data: xValues.map(x => (x === diff ? chance : null)),
        pointBackgroundColor: '#fc8181', // softer red for dark mode
        pointBorderColor: '#fc8181',
        pointRadius: xValues.map(x => (x === diff ? 6 : 0)),
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    backgroundColor: '#1a202c', // Dark background for the chart
    plugins: {
      legend: { position: 'top', labels: { color: '#e2e8f0' } }, // light gray text
      title: {
        display: true,
        text: 'Debuff Application Chance vs Accuracy - Resistance',
        color: '#e2e8f0',
      },
      tooltip: {
        backgroundColor: '#2d3748', // dark gray background
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#4a5568',
        borderWidth: 1,
      },
      annotation: {
        annotations: {
          fiftyFiftyLine: {
            type: 'line',
            xMin: -42,
            xMax: -42,
            borderColor: '#a0aec0', // medium gray
            borderDash: [6, 6],
            label: {
              content: '50/50 Threshold',
              enabled: true,
              position: 'start',
              backgroundColor: '#a0aec0',
              color: '#1a202c',
            },
          },
          attackerAdvantageLine: {
            type: 'line',
            xMin: 0,
            xMax: 0,
            borderColor: '#68d391', // soft green
            borderDash: [4, 4],
            label: {
              content: 'Attacker Bias',
              enabled: true,
              position: 'start',
              backgroundColor: '#68d391',
              color: '#1a202c',
            },
          },
          tinyChanceZone: {
            type: 'box',
            yMin: 0,
            yMax: 5,
            backgroundColor: 'rgba(247, 88, 88, 0.1)',
            label: {
              content: 'Tiny chance zone (≤5%)',
              enabled: true,
              position: 'center',
              backgroundColor: '#fc8181',
              color: '#1a202c',
            },
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Accuracy - Resistance',
          color: '#e2e8f0',
        },
        ticks: {
          color: '#e2e8f0',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Chance to Apply Debuff (%)',
          color: '#e2e8f0',
        },
        ticks: {
          color: '#e2e8f0',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Raid: Debuff Chance Calculator</h1>
        </div>

        <div className="flex gap-4 mb-4 flex-wrap">
          <label className="flex flex-col">
            Accuracy
            <input
              type="number"
              value={accuracy}
              onChange={e => setAccuracy(Number(e.target.value))}
              className="border p-2 rounded bg-gray-800 text-gray-100 border-gray-700"
            />
          </label>
          <label className="flex flex-col">
            Resistance
            <input
              type="number"
              value={resistance}
              onChange={e => setResistance(Number(e.target.value))}
              className="border p-2 rounded bg-gray-800 text-gray-100 border-gray-700"
            />
          </label>
        </div>

        <p className="mb-4">
          Chance to apply debuff: <strong>{chance.toFixed(2)}%</strong>{' '}
          (<em>Accuracy - Resistance = {diff}</em>)
        </p>

        <div className="bg-gray-800 p-4 rounded-lg mb-4" style={{ height: '400px' }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

