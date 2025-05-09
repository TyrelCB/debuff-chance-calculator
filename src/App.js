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
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Raid: Debuff Chance Calculator</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Calculate Chance</h2>
            <div className="flex flex-wrap gap-6 mb-6">
              <label className="flex flex-col flex-grow">
                <span className="mb-2 text-gray-300">Accuracy</span>
                <input
                  type="number"
                  value={accuracy}
                  onChange={e => setAccuracy(Number(e.target.value))}
                  className="border p-3 rounded-md bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 focus:outline-none transition"
                />
              </label>
              <label className="flex flex-col flex-grow">
                <span className="mb-2 text-gray-300">Resistance</span>
                <input
                  type="number"
                  value={resistance}
                  onChange={e => setResistance(Number(e.target.value))}
                  className="border p-3 rounded-md bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 focus:outline-none transition"
                />
              </label>
            </div>
            
            <div className="p-4 bg-gray-700 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Accuracy - Resistance:</span>
                <span className="font-medium">{diff}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-300">Chance to apply debuff:</span>
                <span className="text-lg font-bold text-blue-400">{chance.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Key Points</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                <span>50/50 chance at <strong>-42</strong> diff</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span>92% chance at <strong>0</strong> diff</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                <span>Min chance: <strong>3%</strong></span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                <span>Max chance: <strong>97%</strong></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Success Rate Chart</h2>
          <div className="h-[500px] md:h-[600px] lg:h-[700px]">
            <Line data={data} options={options} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-sm text-gray-400">
        <div className="container mx-auto">
          <p>Based on information found in this video https://www.youtube.com/watch?v=iMmATDScbb0</p>
        </div>
      </footer>
    </div>
  );
}

