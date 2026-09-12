import { motion } from "framer-motion";

export default function ArrayBars({ array, activeIndices=[], sortedIndices=[], pivotIndex=null, maxVal }){
  const max = maxVal || Math.max(...array, 1);
  const prefersReduced = typeof window!=="undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div className="flex items-end justify-center gap-1.5 md:gap-2 h-[220px] md:h-[260px] px-2" role="img" aria-label={`Array visualization with ${array.length} bars`}>
      {array.map((val, idx)=>{
        const isActive = activeIndices.includes(idx);
        const isSorted = sortedIndices.includes(idx);
        const isPivot = pivotIndex===idx;
        let bg = "bg-white";
        let border = "border-black";
        let shadow = "shadow-brutal-sm";
        if(isSorted){ bg="bg-brutalLime"; }
        else if(isPivot){ bg="bg-brutalYellow"; }
        else if(isActive){ bg="bg-brutalPink"; }
        else { bg="bg-white"; }

        const h = (val / max) * 100;
        return (
          <motion.div
            key={idx}
            layout={!prefersReduced}
            transition={prefersReduced ? {duration:0} : { type:"spring", stiffness:400, damping:26 }}
            aria-label={`Value ${val} at index ${idx} ${isSorted?"sorted":isActive?"active":""}`}
            className={`relative flex-1 max-w-[72px] rounded-t-xl border-[2.5px] ${border} ${bg} ${shadow} flex flex-col justify-end items-center overflow-hidden`}
            style={{ height: `${22 + h*0.78}%` }}
          >
            <span className={`text-xs md:text-sm font-black mb-1 ${isActive||isSorted||isPivot ? "text-black" : "text-black"}`}>{val}</span>
            <span className="text-[10px] font-bold text-black/50 mb-1 hidden md:block">{idx}</span>
            {/* brutal highlight line */}
            <div className="absolute inset-x-0 top-0 h-[6px] bg-white/60 border-b-[2px] border-black/10" />
          </motion.div>
        );
      })}
    </div>
  );
}
