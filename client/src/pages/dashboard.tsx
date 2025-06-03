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
import { getAccessToken, fetchSiteData, fetchSiteData_ConsumptionSummary } from "@/utils/API";

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
      <div className="tv-wrapper">
        <div className="dashboard-bg h-[1270px] flex items-center justify-center">
          <div className="standee-container p-6">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="col-span-2 glass-card p-4 rounded-xl">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-10 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="tv-wrapper">
        <div className="dashboard-bg h-[1270px] flex items-center justify-center text-white text-center">
          <div>
            <h2 className="text-xl font-bold mb-2">No Data Available</h2>
            <p className="text-blue-200">Unable to load dashboard data.</p>
            {connectionStatus === "disconnected" && (
              <p className="text-red-400 mt-2">WebSocket lost. Reconnecting...</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="tv-wrapper">
      <div className="dashboard-bg h-[1270px] flex flex-col justify-start px-4 pt-4 space-y-4 overflow-hidden">
        <HeaderSection />

        {/* HIỆN TẠI */}
        <div className="relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-block px-4 py-1 bg-blue-700 text-white text-sm font-semibold rounded-full shadow border border-white/20">
              LIVE STATUS
            </span>
          </div>

          {/* <div className="glass-card px-4 py-4 pt-8 rounded-xl bg-[#1e3a8a]/20 border border-white/10 shadow-inner space-y-4"> */}
          <div className="glass-card px-2 py-2 pt-4 rounded-lg bg-[#1e3a8a]/20 border border-white/10 shadow-inner space-y-2">

            <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
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
        <div className="relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-block px-4 py-1 bg-blue-700 text-white text-sm font-semibold rounded-full shadow border border-white/20">
              PERFORMANCE FORECAST
            </span>
          </div>

          <div className="glass-card px-4 py-4 pt-8 rounded-xl bg-[#1e3a8a]/20 border border-white/10 shadow-inner space-y-4">
            {/* <div className="grid grid-cols-2 gap-4">
              <EnergyUserCard />
              <NoiseCard score={30} />
              <CarbonForecastCard data={forecastData} />
            </div> */}
            <EnergyUserCard />
          </div>
        </div>
      </div>
    </div>
  );
}