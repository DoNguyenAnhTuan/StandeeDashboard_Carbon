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
import { useEffect, useState } from "react";

type Block = {
  name: string;
  usage: number;
  emission: number;
};

const defaultBlocks: Block[] = [
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
  { date: "2025-05-23", actual: 574.8, forecast: 567.6 },
  { date: "2025-05-24", actual: 543.1, forecast: 540.3 },
  { date: "2025-05-25", actual: 582.4, forecast: 565.8 },
  { date: "2025-05-26", actual: 626.2, forecast: 608.3 },
  { date: "2025-05-27", actual: 538.3, forecast: 550.5 },
  { date: "2025-05-28", actual: 538.3, forecast: 558.6 },
  { date: "2025-05-29", actual: 526.5, forecast: 531.9 },
  { date: "2025-05-30", actual: 598.8, forecast: 610.1 },
  { date: "2025-05-31", actual: 559.3, forecast: 563.9 },
  { date: "2025-06-01", actual: 542.7, forecast: 540.4 },
  { date: "2025-06-02", actual: 575.6, forecast: 577.0 },
  { date: "2025-06-03", actual: 540.1, forecast: 537.0 },
  { date: "2025-06-04", actual: null, forecast: 568.8 },
  { date: "2025-06-05", actual: null, forecast: 594.9 },
  { date: "2025-06-06", actual: null, forecast: 549.1 },
];

export default function Dashboard() {
  const { dashboardData, connectionStatus } = useWebSocket();
  const { data: fallbackData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    enabled: !dashboardData,
  });

  const data = dashboardData || fallbackData;
  const [realBlocks, setRealBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetch("/api/actual")
      .then((res) => res.json())
      .then((data: { name: string; usage: number ;carbon_emission: number}[]) => {
        const updated = defaultBlocks.map((block) => {
          const found = data.find((d) => d.name === block.name);
          return {
            ...block,
            usage: found ? found.usage : block.usage,
            emission: found ? found.carbon_emission : block.emission,
          };
        });
        setRealBlocks(updated);
      })
      .catch((err) => {
        console.error("Lỗi lấy actual:", err);
      });
  }, []);



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
            {/* <CarbonForecastCard data={forecastData} /> */}
            <EnergyUserCard />
          </div>
        </div>
      </div>
    </div>
  );
}
