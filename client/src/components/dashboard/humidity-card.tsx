import { Zap, Leaf } from "lucide-react";

interface ElectricityCardProps {
  electricityUsage: number;
  carbonEmissions: number;
  blockName: string;
}

export function ElectricityCard({ electricityUsage, carbonEmissions, blockName }: ElectricityCardProps) {
  return (
    <div className="glass-card flex flex-col justify-center items-center p-3 rounded-lg h-full animate-slide-up">
      <div className="text-white text-sm font-bold uppercase tracking-wide mb-2 px-3 py-1 rounded-md border border-white/40 bg-white/10 text-center">
        {blockName}
      </div>

      <div className="flex flex-col items-center mb-3">
        <div className="text-white text-sm font-semibold flex items-center gap-1 mb-1">
          <Zap className="text-yellow-300" size={16} />
          Electricity Usage
        </div>
        <div className="text-white text-2xl font-extrabold">
          {electricityUsage.toFixed(2)}
          <span className="text-sm font-normal ml-1">MWh</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-white text-sm font-semibold flex items-center gap-1 mb-1">
          <Leaf className="text-green-300" size={16} />
          Carbon Emissions
        </div>
        <div className="text-green-300 text-lg font-bold">
          {carbonEmissions.toFixed(0)}
          <span className="text-xs font-normal ml-1">kg CO₂e</span>
        </div>
      </div>
    </div>
  );
}
