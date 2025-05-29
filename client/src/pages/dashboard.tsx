import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { HeaderSection } from "@/components/dashboard/header-section";
import { ElectricityCard } from "@/components/dashboard/humidity-card"; 
import { NoiseCard } from "@/components/dashboard/noise-card";
import { EnergyCard } from "@/components/dashboard/energy-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@shared/schema";
import CarbonForecastCard from "@/components/dashboard/CarbonForecastCard";
import { EnergyUserCard } from "@/components/dashboard/EnergyUserCard";


export default function Dashboard() {
  const { dashboardData, connectionStatus } = useWebSocket();

  const { data: fallbackData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    enabled: !dashboardData,
  });

  const data = dashboardData || fallbackData;

  //  MOCK DATA cho Block
  const realBlocks = [
    { name: "EIU Block 5", usage: 3.87, emission: 120 },
    { name: "EIU Block 4", usage: 5.12, emission: 200 },
    { name: "EIU Block 8", usage: 4.33, emission: 180 },
    { name: "EIU Block 10", usage: 6.78, emission: 250 },
    { name: "EIU Block 11A", usage: 2.95, emission: 90 },
    { name: "EIU Block 11B", usage: 7.11, emission: 300 },
    { name: "EIU Block 3", usage: 3.14, emission: 130 },
    { name: "EIU Block 6", usage: 4.75, emission: 160 },
    { name: "EIU Garage", usage: 5.60, emission: 210 },
  ];

  const forecastData = [
    { date: "2025-05-20", consumption: 3.2, efficiency: 0.85 },
    { date: "2025-05-21", consumption: 3.8, efficiency: 0.86 },
    { date: "2025-05-22", consumption: 4.1, efficiency: 0.87 },
    { date: "2025-05-23", consumption: 4.7, efficiency: 0.88 },
    { date: "2025-05-24", consumption: 5.0, efficiency: 0.87 },
    { date: "2025-05-25", consumption: 4.6, efficiency: 0.86 },
    { date: "2025-05-26", consumption: 4.0, efficiency: 0.85 },
    { date: "2025-05-27", consumption: 3.5, efficiency: 0.84 },
    { date: "2025-05-28", consumption: 3.9, efficiency: 0.85 },
    { date: "2025-05-29", consumption: 4.3, efficiency: 0.86 },
  ];

  if (isLoading && !data) {
    return (
      <div className="min-h-screen dashboard-bg flex items-center justify-center">
        <div className="standee-container p-6">
          <div className="grid grid-cols-6 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="col-span-2 glass-card p-6 rounded-2xl">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-16 w-24 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen dashboard-bg flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="text-blue-200">Unable to load dashboard data. Please check your connection.</p>
          {connectionStatus === "disconnected" && (
            <p className="text-red-400 mt-2">WebSocket connection lost. Attempting to reconnect...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-bg overflow-hidden">
      <div className="standee-container relative">
        <HeaderSection />

        {/* HIỆN TẠI */}
        <div className="relative w-full mt-12">
          {/* Tab header nổi */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-block px-6 py-2 bg-blue-700 text-white text-xl font-bold rounded-full shadow border border-white/20">
              HIỆN TẠI
            </span>
          </div>

          {/* Card container cho các block */}
          <div className="glass-card px-6 py-6 pt-10 rounded-2xl bg-[#1e3a8a]/20 backdrop-blur border border-white/10 shadow-inner space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {realBlocks.map((block, idx) => (
                <ElectricityCard
                  key={idx}
                  blockName={block.name}
                  electricityUsage={block.usage}
                  carbonEmissions={block.emission}
                />
              ))}
            </div>
          </div>
        </div>

        {/* DỰ BÁO & THỐNG KÊ */}
        <div className="relative w-full mt-12">
          {/* Tab header nổi */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-block px-6 py-2 bg-blue-700 text-white text-xl font-bold rounded-full shadow border border-white/20">
              DỰ BÁO & THỐNG KÊ
            </span>
          </div>

          {/* Card container */}
          <div className="glass-card px-6 py-6 pt-10 rounded-2xl bg-[#1e3a8a]/20 backdrop-blur border border-white/10 shadow-inner space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NoiseCard score={30} />
              <CarbonForecastCard data={forecastData} />
            </div>
            <EnergyUserCard />
          </div>
        </div>
      </div>
    </div>
  );
}
