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
      legend: { position: 'top', labels: { color: 'grey' } },
      title: {
        display: true,
        text: 'Debuff Application Chance vs Accuracy - Resistance',
        color: 'grey',
      },
      annotation: {
        annotations: {
          fiftyFiftyLine: {
            type: 'line',
            xMin: -42,
            xMax: -42,
            borderColor: 'gray',
            borderDash: [6, 6],
            label: {
              content: '50/50 Threshold',
              enabled: true,
              position: 'start',
              backgroundColor: 'gray',
              color: 'white',
            },
          },
          attackerAdvantageLine: {
            type: 'line',
            xMin: 0,
            xMax: 0,
            borderColor: 'green',
            borderDash: [4, 4],
            label: {
              content: 'Attacker Bias',
              enabled: true,
              position: 'start',
              backgroundColor: 'green',
              color: 'white',
            },
          },
          tinyChanceZone: {
            type: 'box',
            yMin: 0,
            yMax: 5,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            label: {
              content: 'Tiny chance zone (≤5%)',
              enabled: true,
              position: 'center',
              backgroundColor: 'red',
              color: 'white',
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
          color: 'grey',
        },
        ticks: {
          color: 'grey',
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Chance to Apply Debuff (%)',
          color: 'grey',
        },
        ticks: {
          color: 'grey',
        },
      },
    },
  };

  return (
    <div className="p-4 min-h-screen bg-black text-white">
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
              className="border p-2 rounded text-black"
            />
          </label>
          <label className="flex flex-col">
            Resistance
            <input
              type="number"
              value={resistance}
              onChange={e => setResistance(Number(e.target.value))}
              className="border p-2 rounded text-black"
            />
          </label>
        </div>

        <p className="mb-4">
          Chance to apply debuff: <strong>{chance.toFixed(2)}%</strong>{' '}
          (<em>Accuracy - Resistance = {diff}</em>)
        </p>

        <Line data={data} options={options} />
      </div>
    </div>
  );
}

