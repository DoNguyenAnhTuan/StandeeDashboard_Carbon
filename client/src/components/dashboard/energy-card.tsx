import { Zap } from "lucide-react";

interface EnergyCardProps {
  currentUsage: number;
  hourlyUsage: number[];
}

export function EnergyCard({ currentUsage, hourlyUsage }: EnergyCardProps) {
  const todayTotal = hourlyUsage.reduce((sum, usage) => sum + usage, 0);
  const maxUsage = Math.max(...hourlyUsage);

  return (
    <div
      className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl animate-slide-up flex flex-col justify-between"
      style={{ animationDelay: '0.5s', height: 300 }} // ✅ Tổng chiều cao cố định
    >
      {/* Tiêu đề và Icon */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-white text-base sm:text-xl font-semibold">Energy Usage</h3>
        <Zap className="text-yellow-500" size={24} />
      </div>

      {/* Hiển thị số liệu hiện tại & hôm nay */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center">
          <div className="text-white text-2xl sm:text-3xl font-bold">{currentUsage.toFixed(1)}</div>
          <div className="text-blue-200 text-xs sm:text-sm">kWh Current</div>
        </div>
        <div className="text-center">
          <div className="text-white text-2xl sm:text-3xl font-bold">{todayTotal.toFixed(1)}</div>
          <div className="text-blue-200 text-xs sm:text-sm">kWh Today</div>
        </div>
      </div>

      {/* Biểu đồ cột mini hiển thị theo giờ */}
      <div className="flex flex-col justify-end flex-1">
        <div className="text-blue-200 text-xs sm:text-sm mb-1">Daily Usage Pattern</div>
        <div className="flex items-end space-x-[2px] h-[72px] sm:h-[80px]">
          {hourlyUsage.map((usage, index) => {
            const height = maxUsage > 0 ? (usage / maxUsage) * 100 : 0;
            return (
              <div
                key={index}
                className="bg-dashboard-light-blue rounded-t flex-1 transition-all duration-700 ease-in-out"
                style={{ height: `${height}%` }}
                title={`${usage.toFixed(1)} kWh`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
