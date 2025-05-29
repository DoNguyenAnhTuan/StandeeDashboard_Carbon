import { Zap } from "lucide-react";

interface EnergyCardProps {
  currentUsage: number;
  hourlyUsage: number[];
}

export function EnergyCard({ currentUsage, hourlyUsage }: EnergyCardProps) {
  const todayTotal = hourlyUsage.reduce((sum, usage) => sum + usage, 0);
  const maxUsage = Math.max(...hourlyUsage);

  return (
    <div className="glass-card p-6 rounded-2xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-semibold">Energy Usage</h3>
        <Zap className="text-yellow-500 text-2xl" size={28} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-white text-3xl font-bold data-value">{currentUsage.toFixed(1)}</div>
          <div className="text-blue-200 text-sm">kWh Current</div>
        </div>
        <div className="text-center">
          <div className="text-white text-3xl font-bold data-value">{todayTotal.toFixed(1)}</div>
          <div className="text-blue-200 text-sm">kWh Today</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-blue-200 text-sm mb-2">Daily Usage Pattern</div>
        <div className="flex items-end space-x-1 h-12">
          {hourlyUsage.map((usage, index) => {
            const height = maxUsage > 0 ? (usage / maxUsage) * 100 : 0;
            return (
              <div 
                key={index}
                className="bg-dashboard-light-blue rounded-t flex-1 transition-all duration-1000" 
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
