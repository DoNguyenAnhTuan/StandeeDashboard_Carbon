import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';


interface CarbonForecastCardProps {
  data: { date: string; actual: number | null; forecast: number }[]; // 👈 Phải cho phép actual là `null`
}


export function CarbonForecastCard({ data }: CarbonForecastCardProps) {
  const today = "2025-05-22"; // Hoặc new Date().toISOString().slice(0, 10)

  return (
    <div className="glass-card p-3 rounded-lg bg-[#2e5ebf] text-white h-full min-w-0">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] text-blue-100">Carbon Forecast</p>
          <p className="text-base font-bold leading-tight">
            Next 7 Days <span className="text-blue-100 text-xs"> (tons CO₂)</span>
          </p>
        </div>
      </div>

      <div className="w-full h-[140px]"> 
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#3b82f6" />
            <XAxis dataKey="date" stroke="#cbd5e1" fontSize={10} />
            <YAxis stroke="#38bdf8" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} labelStyle={{ color: '#fff' }} />
            <Legend verticalAlign="top" height={24} iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 10, color: '#e0f2fe' }} />

            <Area
              type="monotone"
              dataKey="actual"
              stroke="#facc15"
              fill="#facc15"
              fillOpacity={0.3}
              dot={{ r: 3 }}
              name="Actual"
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#60a5fa"
              fill="#60a5fa"
              fillOpacity={0.3}
              dot={{ r: 3 }}
              name="Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default CarbonForecastCard;