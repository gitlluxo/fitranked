import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ReferenceLine
} from 'recharts';

const NutritionChart = ({ data }) => {
  const PROTEIN_GOAL = 120;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="activeCalories" fill="#ff3b30" name="Active Calories" />
          <Line type="monotone" dataKey="protein" stroke="#ff9500" name="Protein (g)" />
          <ReferenceLine y={PROTEIN_GOAL} stroke="#00C49F" strokeDasharray="4 4" label="Protein Goal" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;


