
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AudioWaveformProps {
  isPlaying: boolean;
  className?: string;
}

const AudioWaveform = ({ isPlaying, className }: AudioWaveformProps) => {
  const [bars, setBars] = useState<number[]>([]);
  
  // Generate random heights for bars on mount
  useEffect(() => {
    const newBars = Array.from({ length: 20 }, () => 
      Math.floor(Math.random() * 60 + 20)
    );
    setBars(newBars);
  }, []);

  return (
    <div className={cn("flex items-center justify-center gap-1 h-12", className)}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={cn(
            "w-1 bg-white/40 rounded-full transition-all duration-300",
            isPlaying ? 
              `animate-wave-${(index % 5) + 1}` : 
              "h-1"
          )}
          style={isPlaying ? { height: `${height}%` } : undefined}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
