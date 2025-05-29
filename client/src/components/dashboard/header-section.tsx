import { Building } from "lucide-react";
import { useEffect, useState } from "react";

export function HeaderSection() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="rounded-b-2xl px-6 py-4 flex items-center justify-between">
      {/* Logo EIU bên trái */}
      <div className="bg-white rounded-xl flex items-center justify-center" style={{ width: 220, height: 56 }}>
        <img src="/assets/logo-eiu.png" alt="EIU Logo" className="h-10 object-contain" />
      </div>

      {/* SMART BUILDING ở giữa */}
      <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-widest">
        SMART BUILDING
      </h1>

      {/* Logo scb bên phải */}
      <div className="bg-white rounded-xl flex items-center justify-center" style={{ width: 220, height: 56 }}>
        <img src="/assets/logo-fablab.png" alt="scb Logo" className="h-10 object-contain" />
      </div>
    </div>
  );
}
