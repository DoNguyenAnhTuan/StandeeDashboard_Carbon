import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart
} from "recharts";

const barData = [
  { month: 'Jan', consumption: 30, efficiency: 20 },
  { month: 'Feb', consumption: 40, efficiency: 25 },
  { month: 'Mar', consumption: 55, efficiency: 35 },
  { month: 'Apr', consumption: 65, efficiency: 45 },
  { month: 'May', consumption: 80, efficiency: 60 },
  { month: 'Jun', consumption: 75, efficiency: 55 },
  { month: 'Jul', consumption: 70, efficiency: 50 },
  { month: 'Aug', consumption: 65, efficiency: 45 },
  { month: 'Sep', consumption: 50, efficiency: 35 },
  { month: 'Oct', consumption: 45, efficiency: 30 },
  { month: 'Nov', consumption: 40, efficiency: 25 },
  { month: 'Dec', consumption: 35, efficiency: 20 },
];

const radarData = barData.map(({ month, consumption }) => ({
  subject: month,
  A: consumption,
}));

export function EnergyUserCard() {
  return (
    <div
      className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#3b70b7] text-white text-xs sm:text-sm"
      style={{ height: 420 }} //  Tổng chiều cao cố định
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-base sm:text-lg font-semibold">Energy User</h3>
        <button className="bg-[#2D5339] text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs opacity-80 hover:opacity-100">
          Last 1 Year
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 h-[240px]">
        {/* Bar Chart */}
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis dataKey="month" stroke="#cbd5e1" fontSize={10} />
              <YAxis stroke="#cbd5e1" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="efficiency" stackId="a" fill="#2D5339" />
              <Bar dataKey="consumption" stackId="a" fill="#88dda3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={70} data={radarData}>
              <PolarGrid stroke="#5b91d5" />
              <PolarAngleAxis dataKey="subject" stroke="#cbd5e1" fontSize={10} />
              <PolarRadiusAxis stroke="#cbd5e1" fontSize={9} />
              <Radar name="Energy" dataKey="A" stroke="#67e8f9" fill="#88dda3" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center pt-3 text-[10px] sm:text-xs text-blue-100 border-t border-blue-300 mt-4">
        <div>
          <p className="text-[10px]">⚡ Year Usage</p>
          <p className="text-sm font-semibold text-white">
            134.5 kWh <span className="text-green-300 text-xs ml-1">▲ 5.5%</span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px]">Efficiency</p>
          <p className="text-sm font-semibold text-white">
            124.7% <span className="text-green-300 text-xs ml-1">▲ 1.2%</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white font-bold leading-tight">
            Energy Save up 124.7% this year
          </p>
          <p className="text-[10px]">Show Total Energy for the last 1 year</p>
        </div>
      </div>
    </div>
  );
}
