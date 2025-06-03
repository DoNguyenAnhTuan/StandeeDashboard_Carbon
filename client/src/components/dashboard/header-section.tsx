import { useEffect, useState } from "react";

export function HeaderSection() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <div
      className="w-full bg-[#2D5339] px-4 flex flex-col sm:flex-row items-center justify-between rounded-b-2xl gap-3 sm:gap-0"
      style={{ height: 100 }} // giảm từ 120 xuống 100 nếu cần
    >
      {/* Logo trái */}
      <div className="bg-white rounded-lg flex items-center justify-center w-[120px] h-[40px]">
        <img
          src="/assets/logo-eiu.png"
          alt="EIU Logo"
          className="h-7 object-contain"
        />
      </div>

      {/* SMART BUILDING */}
      <div className="text-center">
        <h1 className="text-white text-base sm:text-xl font-extrabold tracking-widest leading-tight">
          EIU - VIETPULSE
        </h1>
        <p className="text-white text-xs sm:text-sm mt-1 font-mono tracking-wider">
          {formatTime(currentTime)}
        </p>
      </div>

      {/* Logo phải */}
      <div className="bg-white rounded-lg flex items-center justify-center w-[120px] h-[40px]">
        <img
          src="/assets/logo-fablab.png"
          alt="FabLab Logo"
          className="h-7 object-contain"
        />
      </div>
      
    </div>
  );
}
