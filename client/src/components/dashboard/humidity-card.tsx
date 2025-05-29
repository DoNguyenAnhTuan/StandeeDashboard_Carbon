import { Droplet, Zap, Leaf } from "lucide-react";

interface HumidityCardProps {
  humidity: number;
}

interface ElectricityCardProps {
  electricityUsage: number; // MWh
  carbonEmissions: number;  // kg CO2e
  blockName: string;        // Tên block/tòa nhà
}


export function ElectricityCard({ electricityUsage, carbonEmissions, blockName }: ElectricityCardProps) {
  return (
    <div className="glass-card p-10 rounded-2xl flex flex-col justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Block name: chữ trắng, bo tròn theo chữ, viền trắng, nền trong suốt */}
{/* Block Name */}
      <div className="text-white text-xl font-bold uppercase tracking-wider mb-6 px-6 py-1 rounded-full border border-white/40 bg-white/10">
        {blockName}
      </div>

      {/* Electricity Usage */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-white text-lg font-semibold flex items-center gap-2 mb-2">
          <Zap className="text-yellow-300" size={24} />
          Electricity Usage
        </div>
        <div className="text-white text-5xl font-extrabold">
          {electricityUsage.toFixed(2)}
          <span className="text-2xl font-normal ml-2">MWh</span>
        </div>
      </div>

      {/* Carbon Emissions */}
      <div className="flex flex-col items-center">
        <div className="text-white text-lg font-semibold flex items-center gap-2 mb-2">
          <Leaf className="text-green-300" size={22} />
          Carbon Emissions
        </div>
        <div className="text-green-300 text-3xl font-bold">
          {carbonEmissions.toFixed(0)}
          <span className="text-base font-normal ml-1">kg CO₂e</span>
        </div>
      </div>
    </div>
  );
}
