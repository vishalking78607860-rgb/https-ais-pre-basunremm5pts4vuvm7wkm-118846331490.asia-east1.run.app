import React from 'react';
import { Megaphone } from 'lucide-react';

interface LiveMarqueeProps {
  text: string;
}

export const LiveMarquee: React.FC<LiveMarqueeProps> = ({ text }) => {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-bold py-1.5 px-3 border-y-2 border-amber-600 shadow-md flex items-center overflow-hidden">
      <div className="flex items-center gap-1.5 flex-shrink-0 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm mr-2.5 animate-pulse">
        <Megaphone className="w-3.5 h-3.5" />
        <span>NOTICE / अलर्ट</span>
      </div>

      <div className="overflow-hidden whitespace-nowrap w-full">
        <div className="animate-marquee font-hind font-semibold text-xs sm:text-sm tracking-wide">
          {text} &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; {text}
        </div>
      </div>
    </div>
  );
};
