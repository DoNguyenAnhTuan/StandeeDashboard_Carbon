import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";
import { Leaf } from "lucide-react";

const airQualityData = [
  { name: "PM2.5", value: 30.6 },
  { name: "PM10", value: 15.2 },
  { name: "SO₂", value: 2.5 },
  { name: "NO₂", value: 6.8 },
  { name: "O₃", value: 19.7 },
  { name: "CO", value: 1.9 },
];

interface NoiseCardProps {
  score: number; // ✅ dùng score thay vì noiseLevel
}

export function NoiseCard({ score }: NoiseCardProps) {
  return (
    <div className="glass-card p-6 rounded-2xl bg-[#4c75c7] text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-semibold">Room 104</h3>
        <Leaf className="text-white opacity-70" size={22} />
      </div>

      {/* Content */}
      <div className="flex items-center gap-4">
        {/* Biểu đồ cột */}
        <div className="flex-1 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={airQualityData} barSize={16} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#5b91d5" />
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} />
              <YAxis stroke="#cbd5e1" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value}`, 'µg/m³']}
              />
              <Bar dataKey="value" fill="#ffffff">
                <LabelList dataKey="value" position="top" fill="#4ade80" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Số tổng & trạng thái */}
        <div className="text-center w-24">
          <div className="text-green-400 text-5xl font-extrabold">{score}</div>
          <div className="text-white text-xl">Fresh</div>
        </div>
      </div>
    </div>
  );
}
