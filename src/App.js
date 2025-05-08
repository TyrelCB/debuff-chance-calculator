import React, { useState } from 'react';
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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const sigmoid = (d, L = 0.7222, x0 = 1.033, k = -24.55, scale = 40.66) => {
  return L / (1 + Math.exp(-k * ((d / scale) - x0)));
};

export default function DebuffChanceCalculator() {
  const [accuracy, setAccuracy] = useState(100);
  const [resistance, setResistance] = useState(100);

  const diff = accuracy - resistance;
  const chance = sigmoid(diff) * 100;

  const xValues = Array.from({ length: 201 }, (_, i) => i - 100);
  const yValues = xValues.map(d => sigmoid(d) * 100);

  const data = {
    labels: xValues,
    datasets: [
      {
        label: 'Debuff Chance (%)',
        data: yValues,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Your Input',
        data: xValues.map(x => (x === diff ? chance : null)),
        pointBackgroundColor: 'red',
        pointBorderColor: 'red',
        pointRadius: xValues.map(x => (x === diff ? 6 : 0)),
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Debuff Application Chance vs Accuracy - Resistance',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Accuracy - Resistance',
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Chance to Apply Debuff (%)',
        },
      },
    },
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Raid: Debuff Chance Calculator</h1>
      <div className="flex gap-4 mb-4">
        <label className="flex flex-col">
          Accuracy
          <input
            type="number"
            value={accuracy}
            onChange={e => setAccuracy(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>
        <label className="flex flex-col">
          Resistance
          <input
            type="number"
            value={resistance}
            onChange={e => setResistance(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>
      </div>
      <p className="mb-4">Chance to apply debuff: <strong>{chance.toFixed(2)}%</strong></p>
      <Line data={data} options={options} />
    </div>
  );
}