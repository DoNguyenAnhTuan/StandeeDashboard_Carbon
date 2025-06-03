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
    <div className="glass-card p-3 rounded-lg bg-[#2e5ebf] text-white h-full min-w-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] text-blue-100">Week Usage</p>
          <p className="text-base font-bold leading-tight">
            25.5 kWh <span className="text-red-400 text-xs">▼ 2.5%</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-blue-100">Efficiency</p>
          <p className="text-base font-bold leading-tight">
            43.5% <span className="text-green-400 text-xs">▲ 4.75%</span>
          </p>
        </div>
      </div>

      {/* Sub-header */}
      <div className="flex justify-between items-center text-blue-100 mb-1">
        <p className="text-sm font-medium text-white">Usage This Day</p>
        <p className="text-xs">25.6 kWh</p>
      </div>

      {/* Chart */}
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#3b82f6" strokeDasharray="4 4" />
            <XAxis dataKey="date" stroke="#cbd5e1" fontSize={10} />
            <YAxis yAxisId="left" stroke="#38bdf8" tickFormatter={(v) => `${v} kWh`} fontSize={10} />
            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tickFormatter={(v) => `${v}%`} fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number, name: string) =>
                name === 'consumption'
                  ? [`${value.toFixed(1)} kWh`, 'Consumes']
                  : [`${value.toFixed(1)} %`, 'Efficiency']
              }
            />
            <Legend verticalAlign="top" height={24} iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 10, color: '#e0f2fe' }} />
            <Line yAxisId="left" type="monotone" dataKey="consumption" stroke="#67e8f9" strokeWidth={2} dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CarbonUsageCard;
