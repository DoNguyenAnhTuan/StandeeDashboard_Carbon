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
  score: number;
}

export function NoiseCard({ score }: NoiseCardProps) {
  return (
    <div
      className="glass-card p-4 rounded-2xl bg-[#4c75c7] text-white"
      style={{ height: 320 }} // Chiều cao cố định
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-lg font-semibold">Room 104</h3>
        <Leaf className="text-white opacity-70" size={20} />
      </div>

      {/* Nội dung chính */}
      <div className="flex gap-3 h-[250px]">
        {/* Biểu đồ */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={airQualityData}
              barSize={14}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#5b91d5" />
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value}`, 'µg/m³']}
              />
              <Bar dataKey="value" fill="#ffffff">
                <LabelList dataKey="value" position="top" fill="#4ade80" fontSize={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Điểm số */}
        <div className="w-24 flex flex-col items-center justify-center">
          <div className="text-green-400 text-4xl font-bold leading-none">
            {score}
          </div>
          <div className="text-white text-base">Fresh</div>
        </div>
      </div>
    </div>
  );
}
