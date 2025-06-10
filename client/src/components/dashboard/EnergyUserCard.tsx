import { useEffect, useState } from "react";
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
  RadarChart,
} from "recharts";


type BarItem = {
  hour: string;
  consumption: number;
  carbon_emission: number;
};

export function EnergyUserCard() {
  const [barData, setBarData] = useState<BarItem[]>([]); // ✅ Dùng trong component

  useEffect(() => {
  fetch("/assets/data/bar_data.json")
    .then((res) => res.json())
    .then((data) => {
      // 1. Xác định thời điểm hiện tại làm tròn về 00 hoặc 30
      const now = new Date();
      now.setSeconds(0);
      now.setMilliseconds(0);
      const minute = now.getMinutes();
      now.setMinutes(minute < 30 ? 0 : 30);

      // 2. Tạo danh sách 12 mốc thời gian (giảm dần)
      const recentHours: string[] = [];
      for (let i = 11; i >= 0; i--) {
        const t = new Date(now.getTime() - i * 30 * 60 * 1000); // lùi 30 phút mỗi lần
        const hourStr = t.toTimeString().slice(0, 5); // "HH:MM"
        recentHours.push(hourStr);
      }

      // 3. Lọc dữ liệu theo 12 mốc giờ đó
      const filtered = data.filter((item: any) => recentHours.includes(item.hour));

      // 4. Đảm bảo giữ đúng thứ tự thời gian
      const sorted = recentHours.map((h) =>
        filtered.find((item: any) => item.hour === h) || {
          hour: h,
          consumption: 0,
          carbon_emission: 0,
        }
      );

      const formatted = sorted.map((item: any) => ({
        hour: item.hour,
        consumption: item.consumption,
        carbon_emission: item.carbon_emission,
      }));
      setBarData(formatted);
    })
    .catch((err) => console.error("Lỗi khi load dữ liệu bar_data.json:", err));
}, []);



  const radarData = barData.map(({ hour, consumption }) => ({
    subject: hour,
    A: consumption,
  }));

  return (
    <div
      className="glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#3b70b7] text-white text-xs sm:text-sm"
      style={{ height: 340 }} //  Tổng chiều cao cố định
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-base sm:text-lg font-semibold">Electricity Usage</h3>
        <button className="bg-[#2D5339] text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs opacity-80 hover:opacity-100">
          Today
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 h-[180px]">
        {/* Bar Chart */}
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis dataKey="hour" stroke="#cbd5e1" fontSize={10} />
              <YAxis stroke="#cbd5e1" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="carbon_emission" stackId="a" fill="#2D5339" />
              <Bar dataKey="consumption" stackId="a" fill="#A64C29" />
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center pt-2 text-[10px] sm:text-xs text-blue-100 border-t border-blue-300 mt-2">
        <div>
          <p className="text-[10px]">⚡ Year Usage</p>
          <p className="text-sm font-semibold text-white">
            134.5 kWh <span className="text-green-300 text-xs ml-1">▲ 5.5%</span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px]">Carbon Emission</p>
          <p className="text-sm font-semibold text-white">
            124.7% <span className="text-green-300 text-xs ml-1">▲ 1.2%</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white font-bold leading-tight">
            Energy Save up 124.7% this year
          </p>
          <p className="text-[10px]">Total campus energy today</p>
        </div>
      </div>
    </div>
  );
}
