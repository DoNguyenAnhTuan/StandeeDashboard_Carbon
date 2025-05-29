import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

interface CarbonUsageCardProps {
  data: { date: string; consumption: number; efficiency: number }[];
}

export function CarbonUsageCard({ data }: CarbonUsageCardProps) {
  return (
    <div className="glass-card p-6 rounded-2xl bg-[#2e5ebf] text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-blue-100">Week Usage</p>
          <p className="text-2xl font-bold">25.5 kWh <span className="text-red-400 text-sm">▼ 2.5%</span></p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-100">Efficiency</p>
          <p className="text-2xl font-bold">43.5% <span className="text-green-400 text-sm">▲ 4.75%</span></p>
        </div>
      </div>

      {/* Chart Title */}
      <div className="flex justify-between items-center text-blue-100 mb-2">
        <p className="text-lg font-semibold text-white">Usage This Day</p>
        <p className="text-sm">25.6 kWh</p>
      </div>

      {/* Chart */}
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="#3b82f6" strokeDasharray="4 4" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis yAxisId="left" stroke="#38bdf8" tickFormatter={(v) => `${v} kWh`} />
            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number, name: string) => {
                return name === 'consumption'
                  ? [`${value.toFixed(1)} kWh`, 'Consumes']
                  : [`${value.toFixed(1)} %`, 'Efficiency'];
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={10} wrapperStyle={{ color: '#e0f2fe' }} />
            <Line yAxisId="left" type="monotone" dataKey="consumption" stroke="#67e8f9" strokeWidth={3} dot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CarbonUsageCard;
